/* -------- content/trips.js ---------- *\
| The purpose of this file is to be fill |
| the database with the list of trips I  |
| have been on so I can start filing     |
| location data and messages under them  |
\* -------------------------------------*/

const { PrismaClient } = require('@prisma/client');
const trips = ['RITO_ALTO_FOUR_PASS_LOOP', 'JOHN_MUIR_TRAIL'];
const prisma = new PrismaClient();
const TRIP_TO_REPLACE = 'RITO_ALTO_FOUR_PASS_LOOP';
const TRIP_TO_REPLACE_WITH = 'WOODLAND_LAKE';



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
  // Update Rito Alto Four Pass Loop With Woodland Pond
  await prisma.Trip.update({
    where: {
      name: TRIP_TO_REPLACE
    },
    data: {
      name: TRIP_TO_REPLACE_WITH
    }
  })
}
  
main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect();
  })