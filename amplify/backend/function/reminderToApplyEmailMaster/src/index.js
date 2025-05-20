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

const { StudentTable: STUDENT_TABLE, MasterBatchTable: MASTER_BATCH_TABLE } = {
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterBatchTable: "MasterBatch-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

exports.handler = async (event) => {
  try {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    if (event.Records[0].eventName !== "INSERT") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Passing over non-insert event" }),
      };
    }

    // Get student details from the event
    const studentCPR = event.Records[0].dynamodb.NewImage.cpr.S;
    const student = await getStudent(studentCPR);

    // Check if student is a MASTER applicant
    if (
      !student.m_applicantType ||
      !student.m_applicantType.includes("MASTER")
    ) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Not a master applicant, skipping email",
        }),
      };
    }

    // Get batch information for deadline
    const currentBatch = await getCurrentBatch(new Date().getFullYear);
    console.log(`Getting the current year from the batch ${currentBatch}`);

    // Get deadline and subtract one day
    const deadlineDate = new Date(currentBatch.createApplicationEndDate);
    deadlineDate.setDate(deadlineDate.getDate() - 1);
    const deadline = deadlineDate.toISOString().split("T")[0];

    // Send email
    await sendReminderEmail(
      student.email,
      student.fullName,
      deadline,
      msalConfig,
      tokenRequest,
      graphEndpoint
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Reminder email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending reminder email" }),
    };
  }
};

async function getStudent(cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: cpr,
    },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

async function getCurrentBatch(batchvalue) {
  const params = {
    TableName: MASTER_BATCH_TABLE,
    id: batchvalue,
  };
  const result = await dynamoDB.scan(params).promise();
  return result.Items[0];
}

async function sendReminderEmail(
  email,
  studentName,
  deadline,
  msalConfig,
  tokenRequest,
  graphEndpoint
) {
  const logo =
    "https://res.cloudinary.com/dedap3cb9/image/upload/v1688627927/logos/nccEmailLogo_mjrwyk.png";
  const emailContent = emailTemplate(logo, studentName, deadline);

  const cca = new ConfidentialClientApplication(msalConfig);
  const tokenInfo = await cca.acquireTokenByClientCredential(tokenRequest);

  const headers = {
    Authorization: `Bearer ${tokenInfo?.accessToken}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    message: {
      subject: "Reminder: Submit Your Application | تذكير: قم بإرسال طلبك",
      body: {
        contentType: "HTML",
        content: emailContent,
      },
      toRecipients: [{ emailAddress: { address: email } }],
    },
    saveToSentItems: "false",
  });

  const response = await fetch(
    `${graphEndpoint}/v1.0/users/${process.env.OUTLOOK_USERNAME}/sendMail`,
    {
      method: "POST",
      headers,
      body,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }
}

function emailTemplate(logo, studentName, deadline) {
  const formattedDeadline = new Date(deadline).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const arabicFormattedDeadline = new Intl.DateTimeFormat("ar-BH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(deadline));

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Application Reminder</title>
  </head>
  <body style="background-color:rgb(255,251,235); padding-top:2.5rem; padding-bottom:2.5rem; font-family:sans-serif;">
    <div style="max-width:36rem; margin:0 auto; background-color:rgb(255,255,255); padding:2.5rem;">
      <img alt="Logo" src="${logo}" style="display:block; max-width:12rem; margin:0 auto;" />
      
      <!-- English Section -->
      <div style="margin-top:2.5rem; background-color:rgb(249,250,251); padding:1.5rem; border:1px solid #eee;">
        <p style="font-size:16px; font-weight:600;">Dear Student,</p>
        <p style="font-size:14px; line-height:1.5;">
          Thank you for your interest in the Postgraduate Studies Scholarship Programs offered by the Isa bin Salman Education Charitable Trust, and your commitment to advancing your education.
        </p>
        <p style="font-size:14px; line-height:1.5;">
          We would like to remind you that your application has not yet been submitted. We highly encourage you to submit and complete your application before the deadline on ${formattedDeadline}.
        </p>
        <p style="font-size:14px; line-height:1.5;">
          For more information on the eligibility criteria and registration process, please refer to the Trust's social media platforms.
        </p>
        <p style="font-size:14px; line-height:1.5;">
          Thank you, and we look forward to receiving your application.
        </p>
        <p style="font-size:14px; line-height:1.5;">
          Warm regards,<br>
          General Secretariat of the Isa bin Salman Education Charitable Trust
        </p>
      </div>

      <hr style="margin:2.5rem 0; border-top:1px solid #eaeaea;" />

      <!-- Arabic Section -->
      <div style="background-color:rgb(249,250,251); padding:1.5rem; border:1px solid #eee; text-align:right; direction:rtl;">
        <p style="font-size:16px; font-weight:600;">عزيزي الطالب،</p>
        <p style="font-size:14px; line-height:1.5;">
          نشكر لكم اهتمامكم ببعثات وقف عيسى بن سلمان التعليمي الخيري الخاصة بالدراسات العليا وعلى حرصكم على الالتزام بتطوير مسيرتكم التعليمية.
        </p>
        <p style="font-size:14px; line-height:1.5;">
          نود تذكيرك بأن طلبك لم يُقدَّم بعد. نحثك بشدة على تقديم طلبك وإكماله قبل الموعد النهائي في ${arabicFormattedDeadline}.
        </p>
        <p style="font-size:14px; line-height:1.5;">
          لمزيد من المعلومات حول معايير القبول وعملية التسجيل، يُرجى متابعة منصات التواصل الاجتماعي الخاصة بالوقف.
        </p>
        <p style="font-size:14px; line-height:1.5;">
          شكرًا لك، ونتطلع لاستلام طلبك قريبًا.
        </p>
        <p style="font-size:14px; line-height:1.5;">
          مع أطيب التحيات،<br>
          الأمانة العامة لوقف عيسى بن سلمان التعليمي الخيري
        </p>
      </div>

      <div style="text-align:center; margin-top:2rem;">
        <a href="mailto:info@waqfisa.bh" style="display:inline-block; background-color:rgb(201,141,75); color:#fff; padding:10px 30px; border-radius:0.375rem; text-decoration:none;">
          Contact Support / تواصل معنا
        </a>
      </div>
    </div>
  </body>
</html>`;
}
