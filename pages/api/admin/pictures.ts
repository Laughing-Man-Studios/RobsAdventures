import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import sessionOptions from "../../../common/session";
const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
    console.log('IN PICTURES HANDLER');
    if (req.method === "POST") {
        console.log('IN POST HANDLER');
        const { name, photosUrl } = req.body;
        console.log('Name: '+name);
        console.log('photosUrl: '+photosUrl);
        try {
            await prisma.trip.update({
                where: {
                    name
                },
                data: {
                    photosUrl
                }
            });
            res.redirect("/admin/trips");
        } catch(e) {
            res.status(500).send("Undable to update photo url: " + name)
        }
    }
}

export default withIronSessionApiRoute(handler, sessionOptions);