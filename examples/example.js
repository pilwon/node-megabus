// Kevin Ly

'use strict';

// require megabus module
const megabus = require('../lib');

// location codes of destinations
megabus.LOCATION_CODES = {
  'Boston': 94,
  'Chicago': 100,
  'Toronto': 145,
  'New Haven': 122,
  'New York': 123,
};

if (module === require.main) {
  let finder = new megabus.TicketFinder({ // creating a TicketFinder for
    // Valentine Day Trip
    startDate: '2/12/2016', // this starting date
    endDate: '2/15/2016', // this ending date
    routes: [ // with these 4 routes
    
      // New York <-> Chicago
      new megabus.Route('New York', 'Chicago'),
      new megabus.Route('Chicago', 'New York'),

      // Boston <-> New Haven
      new megabus.Route('Boston', 'New Haven'),
      new megabus.Route('New Haven', 'Boston'),

      // Toronto <-> New York
      new megabus.Route('Toronto', 'New York'),
      new megabus.Route('New York', 'Toronto'),

      // Chicago <-> Boston
      new megabus.Route('Chicago', 'Boston'),
      new megabus.Route('Boston', 'Chicago'),
      
    ]
  });

  finder // finder begins searching for tickets
    .getTicketsInPriceRangePromise(0, 50) // promises to get all tickets between $0 and $10
    .then((tickets) => { // then...
      tickets.forEach((ticket, idx) => { // filter all tickets returned
        console.log(`[${idx + 1}] ${ticket.toString()}`); // print out tickets that match
      })
      console.log(`*** ${tickets.length} tickets found ***`); // print out how many tickets found
    });
}