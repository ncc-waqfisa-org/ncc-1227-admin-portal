import * as AWS from "aws-sdk";
import * as nodemailer from "nodemailer";
import { adminEmail } from "../constants/constants";
import config from "../src/aws-exports";

AWS.config.update({
  accessKeyId: process.env.CONFIG_ACCESS_KEY_ID,
  secretAccessKey: process.env.CONFIG_SECRET_ACCESS_KEY,
  region: config.aws_project_region,
});

AWS.config.getCredentials(function (error) {
  if (error) {
    console.log(error.stack);
  }
});
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const adminMail = adminEmail;

// Create a transporter of nodemailer
const transporter = nodemailer.createTransport({
  SES: ses,
});

const logo =
  "https://res.cloudinary.com/dqg2db5gf/image/upload/v1672816898/Ncc/logo_siywsu.png";

export const sendApprovalMail = async (userEmail: string, userName: string) => {
  try {
    const response = await transporter.sendMail({
      from: adminMail,
      to: userEmail,
      subject: "NCC Scholarship Decision",
      html: `
      <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->


    <link href="https://fonts.googleapis.com/css?family=Inter:wght@200;300;400;500;600;700&display=swap"
        rel="stylesheet">

    <!-- CSS Reset : BEGIN -->
    <style>
        html,
        body {
            margin: 0 auto !important;
            padding: 0 !important;
            background: white;
        }

        /* What it does: Stops email clients resizing small text. */
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        /* What it does: Centers email on Android 4.4 */
        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }

        /* What it does: Stops Outlook from adding extra spacing to tables. */
        table,
        td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }

        /* What it does: Fixes webkit padding issue. */
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }

        /* What it does: Uses a better rendering method when resizing images in IE. */
        img {
            -ms-interpolation-mode: bicubic;
        }

        /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
        a {
            text-decoration: none;
        }

        /* What it does: A work-around for email clients meddling in triggered links. */
        *[x-apple-data-detectors],
        /* iOS */
        .unstyle-auto-detected-links *,
        .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        .a6S {
            display: none !important;
            opacity: 0.01 !important;
        }

        /* What it does: Prevents Gmail from changing the text color in conversation threads. */
        .im {
            color: inherit !important;
        }

        /* If the above doesn't work, add a .g-img class to any image in question. */
        img.g-img+div {
            display: none !important;
        }

        /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
        /* Create one of these media queries for each additional viewport size you'd like to fix */

        /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u~div .email-container {
                min-width: 320px !important;
            }
        }

        /* iPhone 6, 6S, 7, 8, and X */
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u~div .email-container {
                min-width: 375px !important;
            }
        }

        /* iPhone 6+, 7+, and 8+ */
        @media only screen and (min-device-width: 414px) {
            u~div .email-container {
                min-width: 414px !important;
            }
        }
    </style>

    <!-- CSS Reset : END -->

    <!-- Progressive Enhancements : BEGIN -->
    <style>


    </style>


</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
    <div style="background-color: #f1f1f1;">
        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
        <div style="padding: 40px 0;
        text-align: center;">
            <img src="${logo}" alt="logo" width='400' height='100' />
        </div>
            <h2 style="font-family: inter; color: #243746; text-align: center;">A decision was made on your application!
            </h2>

            <p style="color: #243746; font-family: inter;">Dear ${userName}, <br /><br /> Thank you for
                applying to Isa Bin Salman Education Charitable Trust Scholarship Service. We have given
                a careful consideration to your application.<br /><br /></p>

            <p style="color: #243746; font-family: inter;">Congratulations! We are pleased
                to
                inform you
                that your application
                has been approved. <br /><br /></p>
            <p style="color: #243746; font-family: inter;">
                More information will be sent to you in the following days.
                <br /><br />
            </p>

            <div style="text-align: center;">
                <div style="padding: 2rem">
                    <a href="#"><button
                            style="cursor: pointer; font-family: inter; font-weight: bold; border: none; background-color: #e1ba3d; padding: 1rem 2rem; border-radius: 100px;">Contact
                            Support</button></a>
                </div>
            </div>
        </div>

    </div>

</body>

</html>

`,
    });

    if (response.accepted) {
      console.log("success ");
      return response?.messageId
        ? { ok: true }
        : { ok: false, msg: "Failed to send email" };
    }

    if (response.rejected) {
      throw new Error("Failed to send email");
    }

    return response?.messageId
      ? { ok: true }
      : { ok: false, msg: "Failed to send email" };
  } catch (error) {
    console.log("ERROR", error);
    return { ok: false, msg: "Failed to send email" };
  }
};

export const sendRefusalEmail = async (userEmail: string, userName: string) => {
  try {
    const response = await transporter.sendMail({
      from: adminMail,
      to: userEmail,
      subject: "NCC Scholarship Decision",
      html: `
      <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->


    <link href="https://fonts.googleapis.com/css?family=Inter:wght@200;300;400;500;600;700&display=swap"
        rel="stylesheet">

    <!-- CSS Reset : BEGIN -->
    <style>
        html,
        body {
            margin: 0 auto !important;
            padding: 0 !important;
            background: white;
        }

        /* What it does: Stops email clients resizing small text. */
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        /* What it does: Centers email on Android 4.4 */
        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }

        /* What it does: Stops Outlook from adding extra spacing to tables. */
        table,
        td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }

        /* What it does: Fixes webkit padding issue. */
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }

        /* What it does: Uses a better rendering method when resizing images in IE. */
        img {
            -ms-interpolation-mode: bicubic;
        }

        /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
        a {
            text-decoration: none;
        }

        /* What it does: A work-around for email clients meddling in triggered links. */
        *[x-apple-data-detectors],
        /* iOS */
        .unstyle-auto-detected-links *,
        .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        .a6S {
            display: none !important;
            opacity: 0.01 !important;
        }

        /* What it does: Prevents Gmail from changing the text color in conversation threads. */
        .im {
            color: inherit !important;
        }

        /* If the above doesn't work, add a .g-img class to any image in question. */
        img.g-img+div {
            display: none !important;
        }

        /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
        /* Create one of these media queries for each additional viewport size you'd like to fix */

        /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u~div .email-container {
                min-width: 320px !important;
            }
        }

        /* iPhone 6, 6S, 7, 8, and X */
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u~div .email-container {
                min-width: 375px !important;
            }
        }

        /* iPhone 6+, 7+, and 8+ */
        @media only screen and (min-device-width: 414px) {
            u~div .email-container {
                min-width: 414px !important;
            }
        }
    </style>

    <!-- CSS Reset : END -->

    <!-- Progressive Enhancements : BEGIN -->
    <style>


    </style>


</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
    <div style="background-color: #f1f1f1;">
        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
            <div style="padding: 40px 0;
            text-align: center;">
                <img src="${logo}" alt="logo" width='400' height='100' />
            </div>
            <h2 style="font-family: inter; color: #243746; text-align: center;">A decision was made on your application.
                            </h2>
                             
                            <p style="color: #243746; font-family: inter;">Dear ${userName}, <br /><br /> Thank you for
                             applying to Isa Bin Salman Education Charitable Trust Scholarship Service. We have given
                            a careful consideration to your application.<br /><br /></p>

                            <p style="color: #243746; font-family: inter;">We regret to
                                inform you that your application has been rejected. <br /><br /></p>
                            
                            <p style="color: #243746; font-family: inter;">We wish you the best in all your future endeavors.<br /><br /></p>
                <br /><br />
            </p>

            <div style="text-align: center;">
                <div style="padding: 2rem">
                    <a href="#"><button
                            style="cursor: pointer; font-family: inter; font-weight: bold; border: none; background-color: #e1ba3d; padding: 1rem 2rem; border-radius: 100px;">Contact
                            Support</button></a>
                </div>
            </div>
        </div>

    </div>

</body>

</html>
  `,
    });

    return response?.messageId
      ? { ok: true }
      : { ok: false, msg: "Failed to send email" };
  } catch (error) {
    console.log("ERROR", error);
    return { ok: false, msg: "Failed to send email" };
  }
};
