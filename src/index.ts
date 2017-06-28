import * as querystring from 'querystring';

import { flatten } from 'lodash';
const cheerio = require('cheerio');
import fetch from 'node-fetch';
import * as moment from 'moment';

const DATE_FORMAT = 'MM/DD/YYYY';

export enum LocationCode {
  Atlanta = 289,
  Boston = 94,
  Chicago = 100,
  Philadelphia = 127,
  Toronto = 145,
  NewHaven = 122,
  NewYork = 123,
  Washington = 142,
}

export const LocationCodes = {
  Atlanta: LocationCode.Atlanta,
  Boston: LocationCode.Boston,
  Chicago: LocationCode.Chicago,
  Philadelphia: LocationCode.Philadelphia,
  Toronto: LocationCode.Toronto,
  NewHaven: LocationCode.NewHaven,
  NewYork: LocationCode.NewYork,
  Washington: LocationCode.Washington,
};

export type LocationName = 'Boston' | 'Chicago' | 'Toronto' | 'NewHaven' | 'NewYork';

export class Route {
  readonly origin: LocationName;
  readonly originCode: LocationCode;
  readonly destination: LocationName;
  readonly destinationCode: LocationCode;

  constructor(origin: LocationName, destination: LocationName) {
    if (!LocationCodes[origin]) {
      throw new Error(`Unknown origin: ${origin}`);
    }
    if (!LocationCodes[destination]) {
      throw new Error(`Unknown destination: ${destination}`);
    }
    this.origin = origin;
    this.originCode = LocationCodes[origin];
    this.destination = destination;
    this.destinationCode = LocationCodes[destination];
  }
}

export interface TicketOptions {
  origin: LocationName;
  destination: LocationName;
  date: moment.Moment;
  departure: string;
  arrival: string;
  price: number;
}

export class Ticket {
  readonly origin: LocationName;
  readonly destination: LocationName;
  readonly date: moment.Moment;
  readonly departure: string;
  readonly arrival: string;
  readonly price: number;

  constructor(options: TicketOptions) {
    this.origin = options.origin;
    this.destination = options.destination;
    this.date = options.date;
    this.departure = options.departure;
    this.arrival = options.arrival;
    this.price = options.price;
  }

  toString() {
    return `{$${this.price}} ${this.origin} -> ${this.destination} (${this.date.format(DATE_FORMAT)} ${this.departure} - ${this.arrival})`;
  }
}

export class TicketFinder {
  constructor(
    readonly startDate: string,
    readonly endDate: string,
    readonly routes: Route[]) {}

  private _buildURL(date: moment.Moment, originCode: LocationCode, destinationCode: LocationCode): string {
    const qs = querystring.stringify({
      originCode,
      destinationCode,
      outboundDepartureDate: date.format(DATE_FORMAT),
      inboundDepartureDate: '',
      passengerCount: 1,
      transportType: 0,
      concessionCount: 0,
      nusCount: 0,
      outboundWheelchairSeated: 0,
      outboundOtherDisabilityCount: 0,
      inboundWheelchairSeated: 0,
      inboundOtherDisabilityCount: 0,
      outboundPcaCount: 0,
      inboundPcaCount: 0,
      promotionCode: '',
      withReturn: 0
    });
    return `http://us.megabus.com/JourneyResults.aspx?${qs}`;
  }

  private async _getHTML(url: string): Promise<string> {
    const res = await fetch(url);
    return res.text();
  }

  private _parseTickets(html: string, date: moment.Moment, route: Route): Ticket[] {
    const $ = cheerio.load(html);
    const items: any[] = $('#JourneyResylts_OutboundList_main_div > ul')
      .not('.heading')
      .toArray();
    return items.map((item) => {
      const $item = $(item);
      const departure = /Departs\s+(.*)\s+/.exec($item.find('.two > p:nth-child(1)').text());
      const arrival = /Arrives\s+(.*)\s+/.exec($item.find('.two > p:nth-child(2)').text());
      const price = /\$([\d.]+)/.exec($item.find('.five > p').text());
      return new Ticket({
        origin: route.origin,
        destination: route.destination,
        date: date,
        departure: departure && departure[1],
        arrival: arrival && arrival[1],
        price: price && +price[1]
      });
    });
  }

  private async _getTickets(date: moment.Moment, route: Route) {
    const url = this._buildURL(date, route.originCode, route.destinationCode);
    const html = await this._getHTML(url);
    return this._parseTickets(html, date, route);
  }

  async getTickets(): Promise<Ticket[]> {
    const startDate = moment(this.startDate, DATE_FORMAT);
    const endDate = moment(this.endDate, DATE_FORMAT);
    const promises: Promise<Ticket[]>[] = [];
    for (const date = moment(startDate); !date.isAfter(endDate); date.add(1, 'days')) {
      this.routes.forEach((route) => {
        promises.push(this._getTickets(date, route));
      });
    }
    return flatten(await Promise.all(promises));
  }

  async getTicketsInPriceRange(min: number, max: number): Promise<Ticket[]> {
    const tickets = await this.getTickets();
    const filterFn = (ticket: Ticket) => min <= ticket.price && ticket.price <= max;
    return tickets.filter(filterFn);
  }
}
