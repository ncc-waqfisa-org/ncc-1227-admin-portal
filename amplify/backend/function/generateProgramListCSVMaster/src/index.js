const AWS = require("aws-sdk");
const XLSX = require("xlsx");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const cognito = new AWS.CognitoIdentityServiceProvider();

const {
  MasterApplicationTable: APPLICATION_TABLE,
  StudentTable: STUDENT_TABLE,
  MasterAppliedUniversitiesTable: UNIVERSITIES_TABLE,
  AdminTable: ADMIN_TABLE,
  S3Bucket: S3_BUCKET,
} = {
  MasterApplicationTable:
    "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterAppliedUniversitiesTable:
    "MasterAppliedUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  S3Bucket: "ncc1227bucket65406-staging",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  try {
    // Verify admin access
    const token = event.headers?.authorization?.slice(7);
    const isAdmin = await checkIsAdmin(token);
    if (!isAdmin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Forbidden. You are not an admin" }),
      };
    }

    const batchValue =
      parseInt(event.queryStringParameters?.batch) || new Date().getFullYear();
    const s3Url = await generateProgramListCSV(batchValue);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: s3Url }),
    };
  } catch (error) {
    console.error("Error generating program list CSV:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error generating program list CSV" }),
    };
  }
};

async function generateProgramListCSV(batchValue) {
  // Get all applications for current batch
  const applications = await getApplications(batchValue);
  const jsonArray = await convertToJsonArray(applications);
  const xlsxBuffer = jsonToXlsx(jsonArray);
  return await uploadToS3(xlsxBuffer, batchValue);
}

async function getApplications(batchValue) {
  const params = {
    TableName: APPLICATION_TABLE,
    IndexName: "byMasterBatch",
    KeyConditionExpression: "#batch = :batchValue",
    ExpressionAttributeNames: {
      "#batch": "batch",
    },
    ExpressionAttributeValues: {
      ":batchValue": batchValue,
    },
  };

  let applications = [];
  let lastEvaluatedKey = null;

  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }
    const result = await dynamoDB.query(params).promise();
    applications = applications.concat(result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return applications;
}

async function convertToJsonArray(applications) {
  const jsonArray = [];

  for (const application of applications) {
    // Get student details
    const student = await getStudent(application.studentCPR);
    if (!student) continue;

    // Get university details
    const university = await getUniversity(application.universityID);

    // Construct student name
    const studentName = `${student.m_firstName || ""} ${
      student.m_secondName || ""
    } ${student.m_thirdName || ""} ${student.m_lastName || ""}`.trim();

    jsonArray.push({
      CPR: application.studentCPR,
      "Student Name": studentName,
      Gender: student.gender,
      Phone: student.phone,
      Email: student.email,
      Major: application.major,
      GPA: application.gpa,
      "Verified GPA": application.verifiedGPA ? "Yes" : "No",
      "TOEFL/IELTS Score": application.toeflIELTSScore,
      "Score Verified": application.isToeflIELTSScoreVerified ? "Yes" : "No",
      "Applied University": university?.universityName || "N/A",
      Program: application.program,
      "Application Status": application.status,
      Income: application.income,
      "Income Verified": application.isIncomeVerified ? "Yes" : "No",
      "Employment Status": student.m_isEmployed ? "Employed" : "Unemployed",
      "Place of Employment": student.m_placeOfEmployment || "N/A",
      "Total Score": application.score,
    });
  }

  return jsonArray;
}

async function getStudent(cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: { cpr },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function getUniversity(universityID) {
  const params = {
    TableName: UNIVERSITIES_TABLE,
    Key: { id: universityID },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

function jsonToXlsx(jsonArray) {
  const worksheet = XLSX.utils.json_to_sheet(jsonArray);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Master Programs List");
  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
}

async function uploadToS3(xlsxBuffer, batchValue) {
  const params = {
    Bucket: S3_BUCKET,
    Key: `MasterProgramsList_${batchValue}.xlsx`,
    Body: xlsxBuffer,
    ContentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
  await s3.upload(params).promise();
  return s3.getSignedUrl("getObject", {
    Bucket: params.Bucket,
    Key: params.Key,
    Expires: 3600, // URL expires in 1 hour
  });
}

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
