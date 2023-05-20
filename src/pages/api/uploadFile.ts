import fs from "fs";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { uploadFile } from "~/server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error uploading file' });
      } else {
        const uploadedFile = files.file as formidable.File
        const fileContent = fs.readFileSync(uploadedFile.filepath)
        const filePath = fields.fullPath as string
        const status = await uploadFile(fileContent, filePath)

        res.status(200).json({ message: 'File uploaded successfully', status });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}