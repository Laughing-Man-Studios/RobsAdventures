import { PrismaClient, Prisma } from '@prisma/client'

async function main() {
    const jmtTrip = await prisma.Trip.findUnique({
        where: {
            name: 'John Muir Trail'
        }
    });

    if (!jmtTrip) {
        await prisma.Trip.create({
            data: {
                name: 'John Muir Trail'
            }
        })
    }

    const createUser = await prisma.user.create({ data: user })
  }
  
  main()
    .catch((e) => {
      throw e
    })
    .finally(async () => {
      await prisma.$disconnect()
    })