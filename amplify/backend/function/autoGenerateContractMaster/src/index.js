// Set the LD_LIBRARY_PATH so the Chromium binary can find its shared libraries.
process.env.LD_LIBRARY_PATH = (process.env.LD_LIBRARY_PATH || "") + ":/opt/lib";

const AWS = require("aws-sdk");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");

const s3 = new AWS.S3();

// Initialize Cognito and DynamoDB clients
const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Define table names using constants
const {
  MasterApplicationTable: MASTER_APPLICATION_TABLE,
  StudentTable: STUDENT_TABLE,
  MasterUniversityTable: MASTER_UNIVERSITY_TABLE,
  AdminTable: ADMIN_TABLE,
  S3Bucket: S3_BUCKET,
  UserPool: USER_POOL,
  ClientID: CLIENT_ID,
} = {
  MasterApplicationTable:
    "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterUniversityTable:
    "MasterAppliedUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  S3Bucket: "ncc1227bucket65406-staging",
  UserPool: "us-east-1_79xE8d6FS", //user pool
  ClientID: "5uhjhod54mf44a2t1ajo7g301l", //this is client ID for web app in cogniot
};

// Define constants for the HTML template location in S3
const TEMPLATE_BUCKET = "ncc1227bucket2e2e0-masterdev";
const TEMPLATE_KEY = "private/contract-master.html";

/**
 * Lambda handler for generating the contract PDF for masters.
 */
exports.handler = async (event) => {
  try {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    // --- ADMIN CHECK ---
    if (!event.headers || !event.headers.authorization) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Missing authorization token" }),
      };
    }
    const token = event.headers.authorization.slice(7);
    const isAdmin = await checkIsAdmin(token);
    if (!isAdmin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Forbidden: User is not an admin" }),
      };
    }

    // Parse the request body
    const requestBody =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { applicationID, startDate, scholarshipPeriod, numberOfSemesters } =
      requestBody;
    if (!applicationID) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Error: Please provide the application ID",
        }),
      };
    }

    // Retrieve the master application record from DynamoDB
    const masterApplication = await getMasterApplicationByID(applicationID);
    if (!masterApplication) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Error: Master application not found",
        }),
      };
    }

    // Fetch the student record using the student's CPR from the master application
    const student = await getStudentByCPR(masterApplication.studentCPR);
    if (!student) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Error: Student not found" }),
      };
    }

    // Fetch the master university record using the universityID from masterApplication
    const masterUniversity = await getMasterUniversityByID(
      masterApplication.universityID
    );

    // Format the startDate using the same "ar-BH" options:
    const formattedStartDate = new Intl.DateTimeFormat("ar-BH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(startDate));

    // Build the PDFFormat object using master application data and student record with master fields
    // Build the PDFFormat object using master application data and student record
    const PDFFormat = {
      studentFirstName: student.m_firstName || "",
      studentSecondName: student.m_secondName || "",
      studentThirdName: student.m_thirdName || "",
      studentLastName: student.m_lastName || "",
      guardianFirstName: student.m_guardianFirstName || "",
      guardianSecondName: student.m_guardianSecondName || "",
      guardianThirdName: student.m_guardianThirdName || "",
      guardianLastName: student.m_guardianLastName || "",
      guardianAddress: student.m_guardianAddress || "",
      guardianEmail: student.m_guardianEmail || "",
      studentCPR: student.cpr || "",
      studentAddress: student.address || "",
      studentEmail: student.email || "",
      // For masters, use the master application's allProgramsTextOption
      studentProgram: masterApplication.program || "",
      startDate: formattedStartDate, // use the formatted date here
      scholarshipPeriod,
      numberOfSemesters,
    };

    // Determine university name via the MasterAppliedUniversities table
    let universityName = "الجامعة";
    if (masterUniversity && masterUniversity.universityNameAr) {
      universityName = masterUniversity.universityNameAr;
    }

    // Build the items object with data for dynamic HTML generation
    const items = {
      date: new Intl.DateTimeFormat("ar-BH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date()),
      name: `${student.m_firstName} ${student.m_secondName} ${student.m_thirdName} ${student.m_lastName}`,
      cpr: student.cpr,
      address: student.address,
      email: student.email,
      guardianName: `${student.m_guardianFirstName} ${student.m_guardianSecondName} ${student.m_guardianThirdName} ${student.m_guardianLastName}`,
      guardianCPR: student.m_guardianCPR, // optionally, if available
      guardianAddress: student.m_guardianAddress || "",
      guardianEmail: student.m_guardianEmail || "",
      universityName,
      programName: masterApplication.program || "",
      startDate: formattedStartDate, // updated formatted date
      scholarshipPeriod,
      numberOfSemesters,
    };

    // Format additional values
    const semestersCount = numberOfSemesters || "٣";
    const scholarshipPeriodFormat = scholarshipPeriod || "٩";

    // Prepare dynamic data for the Handlebars template
    const templateData = {
      ...items,
      semestersCount,
      scholarshipPeriodFormat,
    };

    console.log("Template Data: ", templateData);

    // Fetch the HTML template from S3
    console.log("Fetching HTML template from S3...");
    const templateObject = await s3
      .getObject({
        Bucket: TEMPLATE_BUCKET,
        Key: TEMPLATE_KEY,
      })
      .promise();
    const templateHtml = templateObject.Body.toString("utf-8");
    console.log("Template fetched. Compiling with Handlebars...");

    // Compile the template using Handlebars and merge with dynamic data
    const template = Handlebars.compile(templateHtml);
    const finalHtml = template(templateData);
    console.log("Final HTML generated.");

    // Launch Puppeteer using @sparticuz/chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: "networkidle0" });
    // Generate PDF as a Buffer
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Upload the generated PDF to S3 and generate presigned URL
    const key = `contracts/master/contract-${
      masterApplication.id
    }-${Date.now()}.pdf`;

    const pdfKey = "public/" + key;
    await s3
      .putObject({
        Bucket: S3_BUCKET,
        Key: pdfKey,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      })
      .promise();

    // Generate a presigned URL for retrieving the PDF from S3 (expires in 5 minutes)
    const presignedUrl = s3.getSignedUrl("getObject", {
      Bucket: S3_BUCKET,
      Key: pdfKey,
      Expires: 300, // 300 seconds = 5 minutes
    });

    // Return the presigned URL and key to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Contract generated successfully",
        presignedUrl,
        key,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

/**
 * Checks if the user represented by the provided token is an admin.
 * @param {string} token - Access token from the request header.
 * @returns {Promise<boolean>}
 */
async function checkIsAdmin(token) {
  try {
    const cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
    const username = cognitoUser.Username;
    console.log("Admin username: ", username);
    const params = {
      TableName: ADMIN_TABLE,
      Key: { cpr: username },
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Item !== undefined;
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    return false;
  }
}

/**
 * Retrieves a master application record by the provided applicationID.
 * @param {string} applicationID
 * @returns {Promise<Object|null>}
 */
async function getMasterApplicationByID(applicationID) {
  const params = {
    TableName: MASTER_APPLICATION_TABLE,
    Key: { id: applicationID },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
}

/**
 * Retrieves a student record by the provided CPR.
 * @param {string} cpr
 * @returns {Promise<Object|null>}
 */
async function getStudentByCPR(cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: { cpr },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
}

/**
 * Retrieves a master university record by the provided universityID.
 * @param {string} universityID
 * @returns {Promise<Object|null>}
 */
async function getMasterUniversityByID(universityID) {
  const params = {
    TableName: MASTER_UNIVERSITY_TABLE,
    Key: { id: universityID },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
}
