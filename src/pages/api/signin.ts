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

    const { email, password } = req.body

    // Retrieve user with the given email and password
    const user = await prisma.user.findFirst({
        where: { email: email, password: password }
    })

    if (!user) {
        res.json({ token: null })
        return
    }
    res.json({
        token: jwt.sign({
            id: user.id,
            name: user.first_name,
            email: user.email,
            password: user.password,
            role: user.role,
        }, env.JSON_WEB_TOKEN_SECRET)
    })
}