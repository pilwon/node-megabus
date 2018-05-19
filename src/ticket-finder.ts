import * as querystring from 'querystring';

import { flatten } from 'lodash';
import * as moment from 'moment';
import fetch from 'node-fetch';

import { API_DATE_FORMAT, DATE_FORMAT } from './const';
import { Journey } from './journey';
import { LocationId } from './location';
import { Route } from './route';
import { Ticket } from './ticket';

let COUNT = 0;

export class TicketFinder {
  constructor(
    readonly startDate: string,
    readonly endDate: string,
    readonly routes: Route[]) {}

  async getTickets(): Promise<Ticket[]> {
    const startDate = moment(this.startDate, DATE_FORMAT);
    const endDate = moment(this.endDate, DATE_FORMAT);
    const promises: Array<Promise<Ticket[]>> = [];
    for (const date = moment(startDate); !date.isAfter(endDate); date.add(1, 'days')) {
      this.routes.forEach((route) => {
        promises.push(this._getTickets(moment(date), route));
      });
    }
    return flatten(await Promise.all(promises));
  }

  async getTicketsInPriceRange(min: number, max: number): Promise<Ticket[]> {
    const tickets = await this.getTickets();
    const filterFn = (ticket: Ticket) => min <= ticket.price && ticket.price <= max;
    return tickets.filter(filterFn);
  }

  private _buildURL(date: moment.Moment, originId: LocationId, destinationId: LocationId): string {
    const qs = querystring.stringify({
      concessionCount: 0,
      days: 1,
      departureDate: date.format(API_DATE_FORMAT),
      destinationId,
      nusCount: 0,
      originId,
      totalPassengers: 1,
    });
    return `https://us.megabus.com/journey-planner/api/journeys?${qs}`;
  }

  private _buildTickets(data: any, date: moment.Moment, route: Route): Ticket[] {
    const journeys: Journey[] = data.journeys;
    return journeys.map((journey) => {
      return new Ticket({
        arrivalTime: journey.arrivalDateTime,
        date: date.toDate(),
        departureTime: journey.departureDateTime,
        destination: route.destination,
        origin: route.origin,
        price: journey.price,
      });
    });
  }

  private async _getTickets(date: moment.Moment, route: Route) {
    const url = this._buildURL(date, route.originId, route.destinationId);
    const res = await fetch(url);
    const data = await res.json();
    return this._buildTickets(data, date, route);
  }
}
