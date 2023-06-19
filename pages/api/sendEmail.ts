import type { NextApiRequest, NextApiResponse } from "next";
import { Status } from "../../src/API";
import nodemailer from "nodemailer";
import NextCors from "nextjs-cors";

import {
  nccApprovedEmailTemplate,
  nccRejectedEmailTemplate,
} from "../../src/ncc-email-templates";

export interface ISendEmail {
  status: Status.APPROVED | Status.REJECTED | undefined;
  email: string | undefined;
  studentName: string | undefined;
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const logo =
    "https://res.cloudinary.com/dqg2db5gf/image/upload/v1684390827/Ncc/IBS_Logo_-_Vertical_-_Gold_hfynaq.png";

  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "https://graceful-medovik-220176.netlify.app", //! TODO add correct url
    optionsSuccessStatus: 200,
  });

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    secure: true,
  });

  let data = JSON.parse(req.body);
  console.log(data);

  try {
    if (data === null || data === undefined) {
      return res
        .status(500)
        .json(
          "Failed to send an email to the given user. Please try again later."
        );
    }

    if (data !== null)
      if (data.status === undefined) {
        return res.status(500).json("Application status is undefined");
      }

    if (data.status === Status.REJECTED) {
      const mailData = {
        from: process.env.GMAIL_USERNAME,
        to: data.email,
        subject: `A decision was made with your application`,
        html: await nccRejectedEmailTemplate(logo, data.studentName),
      };

      transporter.sendMail(mailData, function (err, info) {
        if (err) {
          res.status(500);
          res.json({ message: err.message });
        } else {
          res.status(200);
          res.json({ message: info.response });
        }
      });
    }

    if (data.status === Status.APPROVED) {
      const mailData = {
        from: process.env.GMAIL_USERNAME,
        to: data.email,
        subject: `A decision was made with your application`,
        html: nccApprovedEmailTemplate(logo, data.studentName),
      };

      transporter.sendMail(mailData, function (err, info) {
        if (err) {
          res.status(500);
          res.json({ message: err.message });
        } else {
          res.status(200);
          res.json({ message: info.envelope });
        }
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}
