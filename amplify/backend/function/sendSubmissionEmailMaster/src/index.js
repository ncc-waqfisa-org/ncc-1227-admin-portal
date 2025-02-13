/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT
 */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const { ConfidentialClientApplication } = require("@azure/msal-node");

const clientSecret = process.env.AZURE_APP_SECRET;
const clientId = process.env.AZURE_APP_ID;

const tenantId = process.env.AZURE_TENANT_ID;

const aadEndpoint =
  process.env.AAD_ENDPOINT || "https://login.microsoftonline.com";
const graphEndpoint =
  process.env.GRAPH_ENDPOINT || "https://graph.microsoft.com";

const nodeAuth = {
  clientId: clientId,
  clientSecret: clientSecret,
  authority: `${aadEndpoint}/${tenantId}`,
};

const msalConfig = {
  auth: nodeAuth,
};

const tokenRequest = {
  scopes: ["https://graph.microsoft.com/.default"],
};

const {
  StudentTable: STUDENT_TABLE,
  AttachmentTable: ATTACHMENT_TABLE,
  UniversityTable: MASTER_UNIVERSITIES_TABLE,
} = {
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AttachmentTable: "MasterAttachment-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  UniversityTable:
    "MasterAppliedUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

exports.handler = async (event) => {
  if (event.Records[0].eventName !== "INSERT") {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Passing over non-insert event" }),
    };
  }

  try {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    // get the email from dynamodb event
    const cpr = event.Records[0].dynamodb.NewImage.studentCPR.S;
    const student = await getStudent(cpr);
    const email = student.email;
    const language = student.language; // no longer used for template selection
    const studentName = event.Records[0].dynamodb.NewImage.studentName.S;
    const attachmentId =
      event.Records[0].dynamodb.NewImage.masterApplicationAttachmentId.S;
    const attachment = await getAttachment(attachmentId);
    console.log(`Attachment: ${JSON.stringify(attachment)}`);
    const universityCertificate = attachment.universityCertificate;
    const transcript = attachment.transcriptDoc;
    const acceptanceLetter = attachment.acceptanceLetterDoc;
    const university = await getUniversity(
      event.Records[0].dynamodb.NewImage.universityID.S
    );
    const toeflILETSCertificate = attachment.toeflIELTSCertificate;
    const missingDoc = [];
    if (!universityCertificate) {
      missingDoc.push("University Certificate");
    }
    if (!transcript) {
      missingDoc.push("Transcript");
    }
    if (!toeflILETSCertificate) {
      missingDoc.push("Toefl/IELTS Certificate");
    }
    if (!acceptanceLetter) {
      if (!university.isException) {
        missingDoc.push("Acceptance Letter");
      }
    }

    console.log(`Email: ${email}`);

    const logo =
      "https://res.cloudinary.com/dedap3cb9/image/upload/v1688627927/logos/nccEmailLogo_mjrwyk.png";
    const cca = new ConfidentialClientApplication(msalConfig);
    const tokenInfo = await cca.acquireTokenByClientCredential(tokenRequest);
    const headers = new Headers();
    const bearer = `Bearer ${tokenInfo?.accessToken}`;
    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json");

    // Use the combined template that contains both English and Arabic sections
    const emailContent = emailTemplateCombined(logo, studentName, missingDoc);
    const body = JSON.stringify({
      message: {
        // Updated subject to include both languages
        subject: "Waqf Isa Application Submission | تقديم الطلب",
        body: {
          contentType: "HTML",
          content: emailContent,
        },
        toRecipients: [
          {
            emailAddress: {
              address: email,
            },
          },
        ],
      },
      saveToSentItems: "false",
    });

    // Ensure that we set the appropriate options for the fetch call
    const options = {
      method: "POST",
      headers,
      body,
    };

    const response = await fetch(
      `${graphEndpoint}/v1.0/users/${process.env.OUTLOOK_USERNAME}/sendMail`,
      options
    );
    console.log(`RESPONSE: ${JSON.stringify(response)}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent" }),
    };
  } catch (error) {
    console.error("Error sending email", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending email" }),
    };
  }
};

async function getAttachment(attachmentId) {
  const params = {
    TableName: ATTACHMENT_TABLE,
    Key: {
      id: attachmentId,
    },
  };
  const attachment = await dynamoDB.get(params).promise();
  return attachment.Item;
}

async function getStudent(cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: cpr,
    },
  };
  const student = await dynamoDB.get(params).promise();
  const result = {
    email: student.Item.email,
    name: student.Item.name,
    language: student.Item.preferredLanguage,
  };
  return result;
}

// function emailTemplate(logo, studentName, missingDoc) {
//   return `
//     <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
//     <html lang="en">
//       <head>
//         <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
//       </head>
//       <div id="__react-email-preview" style="display:none;">Application submitted</div>
//       <body style="background-color:rgb(255,251,235);padding-top:2.5rem;padding-bottom:2.5rem;font-family:sans-serif;">
//         <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="max-width:36rem;background-color:rgb(255,255,255);padding:2.5rem;">
//           <tbody>
//             <tr>
//               <td>
//                 <img alt="Ncc" src="${logo}" style="display:block;max-width:12rem;margin:0 auto;" />
//                 <p style="padding-top:2.5rem;text-align:center;font-size:18px;font-weight:600;">Application submitted</p>
//                 <table align="center" role="presentation" width="100%" style="background-color:rgb(249,250,251);padding:0.75rem;border:1px solid #eee;">
//                   <tr>
//                     <td>
//                       <p style="font-size:16px;font-weight:600;">Dear applicant,</p>
//                       <p style="font-size:14px;">We are pleased to receive your application for the Isa bin Salman Education Charitable Trust scholarship for the academic year ${new Date().getFullYear()} - ${
//     new Date().getFullYear() + 1
//   }.</p>
//                       ${
//                         missingDoc.length > 0
//                           ? `<p style="font-size:14px;">Please note that your application is <b>incomplete</b>. You can visit the website to update your application before the registration period ends.</p>
//                       <p style="font-size:14px;">Missing documents:</p>
//                       <ul style="font-size:14px;">
//                       ${missingDoc.map((doc) => `<li>${doc}</li>`).join("")}
//                       </ul>`
//                           : `<p style="font-size:14px;">Please note that your application is <b>completed</b> and is under review.
//                           Once the application is reviewed, you will be notified of the result via your email</p>`
//                       }
//                       <p style="font-size:14px;">We thank you for your cooperation and wish you good luck!</p>
//                     </td>
//                   </tr>
//                 </table>
//                 <hr style="margin:1.5rem 0;border-top:1px solid #eaeaea" />
//                 <a href="mailto:info@waqfisa.bh" target="_blank" style="display:block;text-align:center;background-color:rgb(201,141,75);color:#fff;padding:10px 0;border-radius:0.375rem;text-decoration:none;">Contact Support</a>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </body>
//     </html>
//   `;
// }

// function emailTemplateArabic(logo, missingDoc) {
//   const nextYear = new Date().getFullYear() + 1;
//   const currentYear = new Date().getFullYear();
//   const missingDocArabic = missingDoc.map((doc) => {
//     switch (doc) {
//       case "University Certificate":
//         return "الشهادة الجامعية";
//       case "Transcript":
//         return "السجل الأكاديمي";
//       case "Acceptance Letter":
//         return "رسالة القبول";
//       case "Toefl/IELTS Certificate":
//         return "شهادة التوفل/الأيلتس";
//       default:
//         return "";
//     }
//   });
//   return `
//     <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
//     <html lang="ar" dir="rtl">
//       <head>
//         <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
//       </head>
//       <div id="__react-email-preview" style="display:none;">تم تقديم الطلب</div>
//       <body style="background-color:rgb(255,251,235);padding-top:2.5rem;padding-bottom:2.5rem;font-family:sans-serif;">
//         <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="max-width:36rem;background-color:rgb(255,255,255);padding:2.5rem;">
//           <tbody>
//             <tr>
//               <td>
//                 <img alt="Ncc" src="${logo}" style="display:block;max-width:12rem;margin:0 auto;" />
//                 <p style="padding-top:2.5rem;text-align:center;font-size:18px;font-weight:600;">تم تقديم الطلب</p>
//                 <table align="center" role="presentation" width="100%" style="background-color:rgb(249,250,251);padding:0.75rem;border:1px solid #eee;">
//                   <tr>
//                     <td>
//                       <p style="font-size:16px;font-weight:600;text-align:right;">،عزيزي مقدم الطلب</p>
//                       <p style="font-size:14px;text-align:right;direction:rtl;">يسعدنا تقديمك على بعثة وقف عيسى بن سلمان التعليمي الخيري للعام الأكاديمي ${currentYear} - ${nextYear}.</p>
//                       ${
//                         missingDoc.length > 0
//                           ? `<p style="font-size:14px;text-align:right;direction:rtl;">يرجى التنويه بأن طلبك <b>غير مكتمل</b>. يمكنك زيارة الموقع الإلكتروني لمراجعة وتحديث طلبك قبل نهاية فترة التسجيل.</p>
//                       <p style="font-size:14px;text-align:right;direction:rtl;font-weight:600;">:المستندات المفقودة</p>
//                       <ul style="font-size:14px;text-align:right;direction:rtl;">
//                       ${missingDocArabic
//                         .map(
//                           (doc) => `<li style="margin-right:10px;">${doc}</li>`
//                         )
//                         .join("")}
//                       </ul>`
//                           : `<p style="font-size:14px;text-align:right;direction:rtl;">يرجى التنويه بأن طلبك <b>مكتمل</b> وقيد المراجعة. وسيتم تزويدكم بآخر التطورات بعد استكمال فترة التسجيل.</p>`
//                       }
//                       <p style="font-size:14px;text-align:right;direction:rtl;">.شاكرين لكم حسن تعاونكم ونتمنى لكم حظًا جميلاً</p>
//                     </td>
//                   </tr>
//                 </table>
//                 <hr style="margin:1.5rem 0;border-top:1px solid #eaeaea" />
//                 <a href="mailto:info@waqfisa.bh" target="_blank" style="display:block;text-align:center;background-color:rgb(201,141,75);color:#fff;padding:10px 0;border-radius:0.375rem;text-decoration:none;">تواصل معنا</a>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </body>
//     </html>
//   `;
// }

function emailTemplateCombined(logo, studentName, missingDoc) {
  const nextYear = new Date().getFullYear() + 1;
  const currentYear = new Date().getFullYear();

  // Generate Arabic missing document names
  const missingDocArabic = missingDoc.map((doc) => {
    switch (doc) {
      case "University Certificate":
        return "الشهادة الجامعية";
      case "Transcript":
        return "السجل الأكاديمي";
      case "Acceptance Letter":
        return "رسالة القبول";
      case "Toefl/IELTS Certificate":
        return "شهادة التوفل/الأيلتس";
      default:
        return "";
    }
  });

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Waqf Isa Application Submission | تقديم الطلب</title>
  </head>
  <body style="background-color:rgb(255,251,235); padding-top:2.5rem; padding-bottom:2.5rem; font-family:sans-serif;">
    <div style="max-width:36rem; margin: 0 auto; background-color:rgb(255,255,255); padding:2.5rem;">
      <!-- English Section -->
      <table align="center" border="0" width="100%">
        <tr>
          <td align="center">
            <img alt="Ncc" src="${logo}" style="display:block; max-width:12rem; margin:0 auto;" />
            <p style="padding-top:2.5rem; text-align:center; font-size:18px; font-weight:600;">Application submitted / تم تقديم الطلب</p>
          </td>
        </tr>
        <tr>
          <td>
            <table align="center" border="0" width="100%" style="background-color:rgb(249,250,251); padding:0.75rem; border:1px solid #eee;">
              <tr>
                <td>
                  <p style="font-size:16px; font-weight:600; text-align:left;">Dear applicant,</p>
                  <p style="font-size:14px; text-align:left;">
                    We are pleased to receive your application for the Isa bin Salman Education Charitable Trust scholarship for the academic year ${currentYear} - ${nextYear}.
                  </p>
                  ${
                    missingDoc.length > 0
                      ? `<p style="font-size:14px; text-align:left;">
                           Please note that your application is <b>incomplete</b>. You can visit the website to update your application before the registration period ends.
                         </p>
                         <p style="font-size:14px; text-align:left;">Missing documents:</p>
                         <ul style="font-size:14px; text-align:left;">
                           ${missingDoc
                             .map((doc) => `<li>${doc}</li>`)
                             .join("")}
                         </ul>`
                      : `<p style="font-size:14px;">Please note that your application is <b>completed</b> and is under review.
                          Once the application is reviewed, you will be notified of the result via your email</p>`
                  }
                  <p style="font-size:14px; text-align:left;">We thank you for your cooperation and wish you good luck!</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <!-- Divider between English and Arabic sections -->
      <hr style="margin:2.5rem 0;" />
      
      <!-- Arabic Section -->
      <table align="center" border="0" width="100%">
        <tr>
          <td>
            <table align="center" border="0" width="100%" style="background-color:rgb(249,250,251); padding:0.75rem; border:1px solid #eee;">
              <tr>
                <td>
                  <p style="font-size:16px; font-weight:600; text-align:right;">،عزيزي مقدم الطلب</p>
                  <p style="font-size:14px; text-align:right; direction:rtl;">
                    يسعدنا تقديمك على بعثة وقف عيسى بن سلمان التعليمي الخيري للعام الأكاديمي ${currentYear} - ${nextYear}.
                  </p>
                  ${
                    missingDoc.length > 0
                      ? `<p style="font-size:14px; text-align:right; direction:rtl;">
                           يرجى التنويه بأن طلبك <b>غير مكتمل</b>. يمكنك زيارة الموقع الإلكتروني لمراجعة وتحديث طلبك قبل نهاية فترة التسجيل.
                         </p>
                         <p style="font-size:14px; text-align:right; direction:rtl; font-weight:600;">:المستندات المفقودة</p>
                         <ul style="font-size:14px; text-align:right; direction:rtl;">
                           ${missingDocArabic
                             .map(
                               (doc) =>
                                 `<li style="margin-right:10px;">${doc}</li>`
                             )
                             .join("")}
                         </ul>`
                      : `<p style="font-size:14px;line-height:24px;margin:16px 0;text-align:right; direction: rtl">نريد أن ننوه بأن طلبك
                        <b>مكتمل</b> 
                        وقيد المراجعة.
                        بعد مراجعة الطلب، سيتم اعلامكم بالنتيجة عبر البريد الالكتروني.
                         </p>`
                  }
                  <p style="font-size:14px; text-align:right; direction:rtl;">.شاكرين لكم حسن تعاونكم ونتمنى لكم حظًا جميلاً</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <table align="center" border="0" width="100%">
        <tr>
          <td align="center">
            <hr style="margin:1.5rem 0; width:100%; border-top:1px solid #eaeaea;" />
            <a href="mailto:info@waqfisa.bh" target="_blank" style="display:inline-block; width:100%; background-color:rgb(201,141,75); color:#fff; padding:10px 0; border-radius:0.375rem; text-align:center; text-decoration:none;">
              Contact Support / تواصل معنا
            </a>
          </td>
        </tr>
      </table>
      
    </div>
  </body>
</html>
  `;
}

async function getUniversity(universityId) {
  const params = {
    TableName: MASTER_UNIVERSITIES_TABLE,
    Key: {
      id: universityId,
    },
  };

  const university = await dynamoDB.get(params).promise();
  return university.Item;
}
