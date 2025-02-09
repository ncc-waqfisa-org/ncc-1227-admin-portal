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

// Define table names using constants (ParentInfoTable added)
const {
  ApplicationTable: APPLICATION_TABLE,
  StudentTable: STUDENT_TABLE,
  UniversityTable: UNIVERSITY_TABLE,
  ProgramTable: PROGRAM_TABLE,
  AdminTable: ADMIN_TABLE,
  S3Bucket: S3_BUCKET,
  ParentInfoTable: PARENT_INFO_TABLE,
} = {
  ApplicationTable: "Application-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  UniversityTable: "University-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  ProgramTable: "Program-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  S3Bucket: "ncc1227bucket2e2e0-masterdev",
  ParentInfoTable: "ParentInfo-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

// Define constants for the HTML template location in S3
const TEMPLATE_BUCKET = "ncc1227bucket2e2e0-masterdev";
const TEMPLATE_KEY = "private/contract.html";

/**
 * Lambda handler for generating the contract PDF.
 */
exports.handler = async (event) => {
  try {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    // --- ADMIN CHECK (commented out for now) ---
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

    // Retrieve the application record from DynamoDB
    const application = await getApplicationByID(applicationID);
    if (!application) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Error: Application not found" }),
      };
    }

    // Fetch the student record using the student's CPR
    const student = await getStudentByCPR(application.studentCPR);
    if (!student) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Error: Student not found" }),
      };
    }

    // Parallelize the retrieval of parent info, program, and university records.
    const parentInfoPromise = getParentInfoByID(student.parentInfoID);
    const programPromise = application.programID
      ? getProgramByID(application.programID)
      : Promise.resolve(null);
    const universityPromise = application.universityID
      ? getUniversityByID(application.universityID)
      : Promise.resolve(null);
    const [parentinfo, program, university] = await Promise.all([
      parentInfoPromise,
      programPromise,
      universityPromise,
    ]);

    if (!parentinfo) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Error: ParentInfo not found" }),
      };
    }

    // Build the PDFFormat object using the student record and parent info
    const PDFFormat = {
      studentFirstName: student.firstName || "",
      studentSecondName: student.secondName || "",
      studentThirdName: student.thirdName || "",
      studentLastName: student.lastName || "",
      guardianFirstName: parentinfo.guardianFirstName || "",
      guardianSecondName: parentinfo.guardianSecondName || "",
      guardianThirdName: parentinfo.guardianThirdName || "",
      guardianLastName: parentinfo.guardianLastName || "",
      guardianAddress: parentinfo.address || "",
      guardianEmail: parentinfo.email || "",
      studentCPR: student.cpr || "",
      studentAddress: student.address || "",
      studentEmail: student.email || "",
      studentProgram: "", // To be determined below
      startDate,
      scholarshipPeriod,
      numberOfSemesters,
    };

    // Determine the student program value based on the application's programID
    if (program) {
      if (program.name === "All Programs") {
        PDFFormat.studentProgram = application.allProgramsTextOption || "";
      } else {
        PDFFormat.studentProgram = program.nameAr || "";
      }
    } else {
      PDFFormat.studentProgram = application.allProgramsTextOption || "";
    }
    console.log("PDFFormat:", JSON.stringify(PDFFormat));

    // Determine university name via the University table using the concurrently fetched record
    let universityName = "الجامعة";
    if (university && university.nameAr) {
      universityName = university.nameAr;
    }

    // Build the items object with data for dynamic HTML generation
    const items = {
      date: new Intl.DateTimeFormat("ar-BH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date()),
      name: `${student.firstName} ${student.secondName} ${student.thirdName} ${student.lastName}`,
      cpr: student.cpr,
      address: student.address,
      email: student.email,
      guardianName: `${parentinfo.guardianFirstName} ${parentinfo.guardianSecondName} ${parentinfo.guardianThirdName} ${parentinfo.guardianLastName}`,
      guardianCPR: parentinfo.guardianCPR || "",
      guardianAddress: parentinfo.address || "",
      guardianEmail: PDFFormat.guardianEmail,
      universityName,
      programName: PDFFormat.studentProgram || "",
      startDate,
      scholarshipPeriod,
      numberOfSemesters,
    };

    // Format additional values
    const semestersCount = PDFFormat.numberOfSemesters || "٨";
    const scholarshipPeriodFormat = PDFFormat.scholarshipPeriod || "٤ سنوات";

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

    // Upload the generated PDF to S3
    const key = `contracts/bacholar/contract-${
      application.id
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

    // Return the presigned URL to the frontend
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
 * Retrieves an application record by the provided applicationID.
 * @param {string} applicationID
 * @returns {Promise<Object|null>}
 */
async function getApplicationByID(applicationID) {
  const params = {
    TableName: APPLICATION_TABLE,
    Key: { id: applicationID },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
}

/**
 * Retrieves a program record by the provided programID.
 * @param {string} programID
 * @returns {Promise<Object|null>}
 */
async function getProgramByID(programID) {
  const params = {
    TableName: PROGRAM_TABLE,
    Key: { id: programID },
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
 * Retrieves a university record by the provided universityID.
 * @param {string} universityID
 * @returns {Promise<Object|null>}
 */
async function getUniversityByID(universityID) {
  const params = {
    TableName: UNIVERSITY_TABLE,
    Key: { id: universityID },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
}

/**
 * Retrieves parent information by the provided parentInfoID.
 * @param {string} parentInfoID
 * @returns {Promise<Object|null>}
 */
async function getParentInfoByID(parentInfoID) {
  const params = {
    TableName: PARENT_INFO_TABLE,
    Key: { id: parentInfoID },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
}
