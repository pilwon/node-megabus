const megabus = require('../dist');

async function main() {
  const finder = new megabus.TicketFinder('7/1/2017', '7/10/2017', [
    // New York <-> Atlanta
    //new megabus.Route('NewYork', 'Atlanta'),
    //new megabus.Route('Atlanta', 'NewYork'),

    // New York <-> Boston
    //new megabus.Route('New York', 'Boston'),
    //new megabus.Route('Boston', 'NewYork'),

    // New York <-> Chicago
    // new megabus.Route('NewYork', 'Chicago'),
    // new megabus.Route('Chicago', 'NewYork'),

    // New York <-> Philadelphia
    //new megabus.Route('NewYork', 'Philadelphia'),
    //new megabus.Route('Philadelphia', 'NewYork'),

    // New York <-> New Haven
    //new megabus.Route('NewYork', 'NewHaven'),
    //new megabus.Route('NewHaven', 'NewYork'),

    // New York <-> Toronto
    //new megabus.Route('NewYork', 'Toronto'),
    new megabus.Route('Toronto', 'NewYork'),

    // New York <-> Washington
    // new megabus.Route('NewYork', 'Washington'),
    // new megabus.Route('Washington', 'NewYork'),
  ]);

  const tickets = await finder.getTickets();
  // const tickets = await finder.getTicketsInPriceRange(0, 30);
  tickets.forEach((ticket, idx) => {
    console.log(`[${idx + 1}] ${ticket}`);
  });
  console.log(`*** ${tickets.length} tickets found ***`);
}

if (module === require.main) {
  main().catch(console.error);
}
