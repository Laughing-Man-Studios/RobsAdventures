/* -------- content/trips.js ---------- *\
| The purpose of this file is to be fill |
| the database with the list of trips I  |
| have been on so I can start filing     |
| location data and messages under them  |
\* -------------------------------------*/

const { PrismaClient } = require('@prisma/client');
const trips = [
  { 
    name: 'RITO_ALTO_FOUR_PASS_LOOP',
    zoom: 3,
    lng: 0,
    lat: 0
  },
  { 
    name: 'JOHN_MUIR_TRAIL',
    zoom: 8,
    lng: -118.86505,
    lat: 37.090345
  },
  { 
    name: 'WOODLAND_LAKE',
    zoom: 14,
    lng: -105.63268,
    lat: 39.96284
  },
]
const prisma = new PrismaClient();



async function main() {
  for (const { name, zoom, lng, lat } of trips) {
    console.log(`Adding ${name} to TRIP table`);
    await prisma.Trip.upsert({
        where: {
          name
        },
        update: {
            name,
            zoom,
            lng,
            lat
        },
        create: {
          name,
            zoom,
            lng,
            lat
        }
    });
  }
}
  
main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect();
  })