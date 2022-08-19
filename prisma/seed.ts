/* -------- content/trips.js ---------- *\
| The purpose of this file is to be fill |
| the database with the list of trips I  |
| have been on so I can start filing     |
| location data and messages under them  |
\* -------------------------------------*/

import { PrismaClient } from "@prisma/client";
import { TRIP_META_DATA } from "../common/literals";
const prisma = new PrismaClient();



async function main() {
  for (const { name, zoom, lng, lat } of TRIP_META_DATA) {
    console.log(`Adding ${name} to TRIP table`);
    await prisma.trip.upsert({
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
  .catch(async (e) => {
    await prisma.$disconnect();
    throw e
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })