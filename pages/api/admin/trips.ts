import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import sessionOptions from "../../../common/session";
const prisma = new PrismaClient();

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<String>
    ) {
    if (req.method === 'POST') {
        const { create: name } = req.body;
        try {
            await prisma.trip.create({
                data: {
                    name,
                    zoom: 3
                }
            });
            res.redirect('/admin/trips');
        } catch(e) {
            res.status(500).send("Unable to create trip: "+name);
        }
    } else if (req.method === 'DELETE') {
        const { trip } = JSON.parse(req.body)
        console.log(trip);
        try {
            await prisma.messages.deleteMany({
                where: {
                    trip: {
                        name: trip
                    }
                }
            });
            await prisma.location.deleteMany({
                where: {
                    trip: {
                        name: trip
                    }
                }
            });
            await prisma.trip.delete({
                where: {
                    name: trip
                }
            });
            res.status(200).send("Trip "+trip+" deleted");
        } catch (e) {
            console.log(e);
            res.status(500).send("Unable to delete trip: "+trip);
        }

    } else {
        res.status(404).end();
    }
    await prisma.$disconnect();
}

export default withIronSessionApiRoute(handler, sessionOptions);