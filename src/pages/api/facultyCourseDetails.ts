import { getfacultyInfo }  from "~/server/db"
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    const email = req.body;

    const facultyCourseInfo = await getfacultyInfo(email)
        .catch((err) => {
            console.log(err);
            res.json({ error: err });
            return null;
        });

    if (!facultyCourseInfo) {
        return
    }    

    res.json({
        facultyCourseObject : facultyCourseInfo
    })

};