import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import { prisma } from "~/server/db";
import { env } from "../../env.mjs"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    const { firstName, lastName, email, password, role } = req.body

    // Check if email id is already in use
    const count = await prisma.user.count({
        where: { email: email }
    })

    if(count > 0) {
        res.json({ created: false, message: "Email already in use" })
        return
    }

    // Create user
    const user = await prisma.user.create({
        data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            role: role,
        }
    });

    res.json({ created: user !== null })
}