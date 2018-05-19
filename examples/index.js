const megabus = require('../build');

const DATE_FROM = '5/1/2018';
const DATE_TO = '9/30/2018';
const PRICE_FROM = 0;
const PRICE_TO = 30;

async function main() {
  const finder = new megabus.TicketFinder(DATE_FROM, DATE_TO, [
    // New York <-> Atlanta
    //new megabus.Route('New York', 'Atlanta'),
    //new megabus.Route('Atlanta', 'New York'),

    // New York <-> Boston
    //new megabus.Route('New York', 'Boston'),
    //new megabus.Route('Boston', 'New York'),

    // New York <-> Chicago
    // new megabus.Route('New York', 'Chicago'),
    // new megabus.Route('Chicago', 'New York'),

    // New York <-> Philadelphia
    //new megabus.Route('New York', 'Philadelphia'),
    //new megabus.Route('Philadelphia', 'New York'),

    // New York <-> New Haven
    //new megabus.Route('New York', 'New Haven'),
    //new megabus.Route('New Haven', 'New York'),

    // New York <-> Toronto
    new megabus.Route('New York', 'Toronto'),
    new megabus.Route('Toronto', 'New York'),

    // New York <-> Washington
    // new megabus.Route('New York', 'Washington'),
    // new megabus.Route('Washington', 'New York'),
  ]);

  // const tickets = await finder.getTickets();
  const tickets = await finder.getTicketsInPriceRange(PRICE_FROM, PRICE_TO);
  tickets.forEach((ticket, idx) => {
    console.log(`[${idx + 1}] ${ticket}`);
  });
  console.log(`*** ${tickets.length} tickets found ***`);
}

if (module === require.main) {
  main().catch(console.error);
}
