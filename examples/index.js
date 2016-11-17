const megabus = require('../lib');

megabus.LOCATION_CODES = {
  'Atlanta': 289,
  'Boston': 94,
  'Chicago': 100,
  'Philadelphia': 127,
  'Toronto': 145,
  'New Haven': 122,
  'New York': 123,
  'Washington': 142,
};

function main() {
  let finder = new megabus.TicketFinder({
    startDate: '11/18/2016',
    endDate: '3/14/2017',
    routes: [
      // New York <-> Atlanta
      // new megabus.Route('New York', 'Atlanta'),
      // new megabus.Route('Atlanta', 'New York'),

      // New York <-> Boston
      // new megabus.Route('New York', 'Boston'),
      // new megabus.Route('Boston', 'New York'),

      // New York <-> Chicago
      // new megabus.Route('New York', 'Chicago'),
      // new megabus.Route('Chicago', 'New York'),

      // New York <-> Philadelphia
      // new megabus.Route('New York', 'Philadelphia'),
      // new megabus.Route('Philadelphia', 'New York'),

      // New York <-> New Haven
      // new megabus.Route('New York', 'New Haven'),
      // new megabus.Route('New Haven', 'New York'),

      // New York <-> Toronto
      new megabus.Route('New York', 'Toronto'),
      new megabus.Route('Toronto', 'New York'),

      // New York <-> Washington
      // new megabus.Route('New York', 'Washington'),
      // new megabus.Route('Washington', 'New York'),
    ]
  });

  finder
    // .getTicketsPromise()
    .getTicketsInPriceRangePromise(0, 1)
    .then((tickets) => {
      tickets.forEach((ticket, idx) => {
        console.log(`[${idx + 1}] ${ticket.toString()}`);
      })
      console.log(`*** ${tickets.length} tickets found ***`);
    });
}

if (module === require.main) {
  main();
}
