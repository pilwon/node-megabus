const megabus = require('../build');

async function main() {
  const finder = new megabus.TicketFinder('9/1/2017', '9/30/2017', [
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
    //new megabus.Route('New York', 'Toronto'),
    new megabus.Route('Toronto', 'New York'),

    // New York <-> Washington
    // new megabus.Route('New York', 'Washington'),
    // new megabus.Route('Washington', 'New York'),
  ]);

  // const tickets = await finder.getTickets();
  const tickets = await finder.getTicketsInPriceRange(0, 30);
  tickets.forEach((ticket, idx) => {
    console.log(`[${idx + 1}] ${ticket}`);
  });
  console.log(`*** ${tickets.length} tickets found ***`);
}

if (module === require.main) {
  main().catch(console.error);
}
