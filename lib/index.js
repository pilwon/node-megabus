'use strict';

/** 
 * For string querying
 * @requires querystring
 */
const querystring = require('querystring');

/** 
 * Provides clean, performant methods for manipulating objects and collections
 * @requires lodash
 */
const _ = require('lodash'); /** * @requires lodash */

/** 
 * Light-weight and fast alternative of JSDOM/jQuery
 * @requires cheerio
 */
const cheerio = require('cheerio');

/** 
 * Used for HTTP requests
 * @requires node-fetch
 */
const fetch = require('node-fetch');


/** 
 * for date formatting
 * @requires moment
 */
const moment = require('moment');

/**
 * Key: Value Map of locations and thier corresponding codes
 */
exports.LOCATION_CODES = {
  'Boston': 94,
  'Chicago': 100,
  'Toronto': 145,
  'New Haven': 122,
  'New York': 123,
};


/**
 * Creates a bus route object
 * 
 * @param {String} origin The starting location
 * @param {String} destination The ending destination
 */
class Route {
  /**
   * @constructs Bus route
   */
  constructor(origin, destination) {
    if (!exports.LOCATION_CODES[origin]) {
      throw new Error(`Unknown origin: ${origin}`); // Throws error if origin is not found
    }
    if (!exports.LOCATION_CODES[destination]) {
      throw new Error(`Unknown destination: ${destination}`); // Throws error if destination is not found
    }
    this.origin = origin;
    this.originCode = exports.LOCATION_CODES[origin];
    this.destination = destination;
    this.destinationCode = exports.LOCATION_CODES[destination];
  }
}

/**
 * Creates a ticket object and returns toString of ticket information
 * 
 * @param {Object} data contains the necessary ticket information
 */
class Ticket {
  /**
   * @constructs Ticket
   */
  constructor(data) {
    this.origin = data.origin;
    this.destination = data.destination;
    this.date = data.date;
    this.departure = data.departure;
    this.arrival = data.arrival;
    this.price = data.price;
  }
  
  /**
   * @return {toString} ticket information
   */
  toString() {
    return `{$${this.price}} ${this.origin} -> ${this.destination} (${this.date} ${this.departure} - ${this.arrival})`;
  }
}


/**
 * Creates a TicketFinder object to find Tickets within specified date/price range
 * 
 * @param {Object} data Contains route information and travel dates
 */
class TicketFinder {
  /**
   * @constructs TicketFinder
   */
  constructor(data) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.routes = data.routes;
  }

  _buildURL(date, originCode, departureCode) {
    let qs = querystring.stringify({
      originCode: originCode,
      destinationCode: departureCode,
      outboundDepartureDate: date,
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

  _getHTMLPromise(url) {
    return fetch(url)
      .then((res) => {
        return res.text();
      });
  }

  _parseTickets(html, date, route) {
    let $ = cheerio.load(html);
    let items = $('#JourneyResylts_OutboundList_main_div > ul')
      .not('.heading')
      .toArray();
    return items.map((item) => {
      let $item = $(item);
      let departure = /Departs\s+(.*)\s+/.exec($item.find('.two > p:nth-child(1)').text());
      let arrival = /Arrives\s+(.*)\s+/.exec($item.find('.two > p:nth-child(2)').text());
      let price = /\$([\d.]+)/.exec($item.find('.five > p').text());
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

  _getTicketsPromise(date, route) {
    let url = this._buildURL(date, route.originCode, route.destinationCode);
    return this._getHTMLPromise(url).then((html) => {
      return this._parseTickets(html, date, route);
    });
  }

/**
 * @return result {Tickets} an array of tickets matching route and date range
 */
  getTicketsPromise() {
    let startDate = moment(this.startDate, 'MM/DD/YYYY');
    let endDate = moment(this.endDate, 'MM/DD/YYYY');
    let promises = []; // Array of promised route/date
    for (let date = moment(startDate); !date.isAfter(endDate); date.add(1, 'days')) { // loop through start date until end date
      this.routes.forEach((route) => { // loop through routes returned based on specified dates
        promises.push(this._getTicketsPromise(date.format('MM/DD/YYYY'), route)); // pushes this promise of date/route into promise array
      });
    }
    return Promise.all(promises) // complete all promises
      .then((results) => { // then return result from those promises
        return _.flatten(results); // flatten nested arrays into one
      });
  }
  
/**
 * @param min {double} minimum price
 * @param max {double} maximum price
 * @return result {Tickets} an array of tickets matching specified price range
 */
  getTicketsInPriceRangePromise(min, max) {
    return this.getTicketsPromise().then((tickets) => { // return a promise of tickets in price range
      return tickets.filter((ticket) => { // asyncronously filter tickets basked on price range
        return min <= ticket.price && ticket.price <= max; // 
      });
    });
  }
}

exports.Route = Route;
exports.Ticket = Ticket;
exports.TicketFinder = TicketFinder;