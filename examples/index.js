'use strict';

const megabus = require('../lib');

megabus.LOCATION_CODES = {
  'Boston': 94,
  'Chicago': 100,
  'Toronto': 145,
  'New Haven': 122,
  'New York': 123,
};

if (module === require.main) {
  let finder = new megabus.TicketFinder({
    startDate: '1/1/2016',
    endDate: '3/14/2016',
    routes: [
      // New York <-> Boston
      new megabus.Route('New York', 'Boston'),
      new megabus.Route('Boston', 'New York'),

      // New York <-> Chicago
      new megabus.Route('New York', 'Chicago'),
      new megabus.Route('Chicago', 'New York'),

      // New York <-> New Haven
      new megabus.Route('New York', 'New Haven'),
      new megabus.Route('New Haven', 'New York'),

      // New York <-> Toronto
      new megabus.Route('New York', 'Toronto'),
      new megabus.Route('Toronto', 'New York'),
    ]
  });

  finder
    // .getTicketsPromise()
    .getTicketsInPriceRangePromise(0, 10)
    .then((tickets) => {
      tickets.forEach((ticket, idx) => {
        console.log(`[${idx + 1}] ${ticket.toString()}`);
      })
      console.log(`*** ${tickets.length} tickets found ***`);
    });
}
