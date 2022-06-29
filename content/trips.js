/* -------- content/trips.js ---------- *\
| The purpose of this file is to be fill |
| the database with the list of trips I  |
| have been on so I can start filing     |
| location data and messages under them  |
\* -------------------------------------*/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const trips = ['RITO_ALTO_FOUR_PASS_LOOP','JOHN_MUIR_TRAIL'];


async function main() {
  for (const trip of trips) {
    const jmtTrip = await prisma.Trip.findUnique({
        where: {
            name: trip
        }
    });

    if (!jmtTrip) {
      console.log(`Adding ${trip} to TRIP table`)
      await prisma.Trip.create({
          data: {
              name: trip
          }
      })
    }
  }
}
  
main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect();
  })