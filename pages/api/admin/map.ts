import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import sessionOptions from "../../../common/session";
const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  if (req.method === "POST") {
    const { trips: name, lng, lat, zoom } = req.body;
    if (name && lng && lat && zoom) {
      const count = await prisma.trip.count({
        where: {
          name,
        },
      });
      if (count > 0) {
        console.log(`Updating Map Values for ${name}`);
        await prisma.trip.update({
          where: {
            name,
          },
          data: {
            name,
            zoom: Number(zoom),
            lng: Number(lng),
            lat: Number(lat),
          },
        });
        res.redirect("/admin/map");
      }
    } else {
      res
        .status(404)
        .send("Missing one of required fields: trip, lng, lat, zoom");
    }
  } else {
    res.status(404).end();
  }
  await prisma.$disconnect();
}

export default withIronSessionApiRoute(handler, sessionOptions);
