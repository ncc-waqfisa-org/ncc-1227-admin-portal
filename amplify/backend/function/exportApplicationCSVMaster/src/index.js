"use strict";

const AWS = require("aws-sdk");
const XLSX = require("xlsx");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const cognito = new AWS.CognitoIdentityServiceProvider();

const {
  ApplicationTable: APPLICATION_TABLE,
  StudentTable: STUDENT_TABLE,
  MASTER_APPLIED_UNIVERSITIES: MASTER_APPLIED_UNIVERSITIES,
  BahrainUniversity: BAHRAIN_UNIVERSITY_TABLE,
  AdminTable: ADMIN_TABLE,
  S3Bucket: S3_BUCKET,
} = {
  ApplicationTable: "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  BahrainUniversity: "BahrainUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MASTER_APPLIED_UNIVERSITIES:
    "MasterAppliedUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  S3Bucket: "ncc1227bucket65406-staging",
};

/**
 * Lambda function handler for exporting master applications as CSV with modified columns.
 *
 * This function:
 * - Verifies that the caller is an admin.
 * - Retrieves the master applications (optionally filtering by a provided list of IDs and/or status).
 * - Fetches associated student records.
 * - Converts the data to an Excel (xlsx) file.
 * - Uploads the file to S3 and returns a signed URL.
 *
 * Specific changes for master records:
 * - Removes "Number Of Family Members".
 * - Renames "Is Family Income Verified" to "isIncomeVerified" using application.isIncomeVerified.
 * - Uses application.program (text) for "Chosen Program".
 * - Replaces the "Field" column with "Major" from application.major.
 * - Converts application.gpa to a 100 scale.
 * - Uses student.m_university for "University Name" (instead of schoolName).
 * - Omits "School Type".
 * - Retrieves "Chosen University" from the MASTER_APPLIED_UNIVERSITIES table.
 *
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  try {
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

    let body;
    if (typeof event.body === "string") {
      body = JSON.parse(event.body);
    } else {
      body = event;
    }
    const selectedApplications = body.ids;
    const status = event.queryStringParameters?.status || null;

    const s3Url = await exportApplicationsCsvMaster(
      APPLICATION_TABLE,
      batchValue,
      status,
      selectedApplications
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ url: s3Url }),
    };
  } catch (error) {
    console.error("Error exporting master applications", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error exporting master applications" }),
    };
  }
};

function jsonToXlsx(jsonArray) {
  const worksheet = XLSX.utils.json_to_sheet(jsonArray);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Master Applications");
  const workbookBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });
  return workbookBuffer;
}

async function exportApplicationsCsvMaster(
  tableName,
  batchValue,
  status,
  selectedApplications
) {
  const applications = selectedApplications
    ? await getSelectedApplications(tableName, selectedApplications)
    : await getApplications(tableName, batchValue, status);
  const students = await getStudents(batchValue);
  const jsonArray = await convertToJsonMaster(applications, students);
  const xlsxBuffer = jsonToXlsx(jsonArray);
  const uploadUrl = await uploadToS3(xlsxBuffer, batchValue);
  return uploadUrl;
}

async function convertToJsonMaster(applications, students) {
  const jsonArray = [];
  for (let application of applications) {
    let student = students.find((stu) => stu.cpr === application.studentCPR);
    if (!student) {
      student = await getStudent(STUDENT_TABLE, application.studentCPR);
    }
    const graduationYear = student?.graduationDate
      ? new Date(student.graduationDate).getFullYear()
      : application.batch;

    const chosenUniversity = application.universityID
      ? await getMasterUniversity(application.universityID)
      : { name: "NA" };

    const reason = processReason(application.reason);

    jsonArray.push({
      Id: application.id,
      "Student CPR": application.studentCPR,
      Name:
        student.m_firstName +
        " " +
        student.m_secondName +
        " " +
        student.m_thirdName +
        " " +
        student.m_lastName,
      Gender: student.gender,
      Nationality: student.nationalityCategory,
      Major: application.major, // Replaces 'Field'
      Phone: student.phone,
      Email: student.email,
      "Graduation Year": graduationYear,
      Status: application.status,
      GPA: application.gpa,
      "Verified GPA": application.verifiedGPA,
      Score: application.score,
      "University Name": await getUniversityNameById(student.m_universityID), // we need to get the university name I think this only contains the relashionship.
      Income: application.income,
      "Chosen University": chosenUniversity.universityName,
      "Chosen Program": application.program, // Taken directly from master application
      Reason: reason,
      "Total Score": application.score,
      "Number of Family members": student.m_numberOfFamilyMembers,
      isIncomeVerified: application.isIncomeVerified ? "Yes" : "",
    });
  }
  return jsonArray;
}

async function getApplications(tableName, batchValue, status) {
  const params = {
    TableName: tableName,
    IndexName: "byMasterScore",
    KeyConditionExpression: "#batch = :batchValue AND score > :score",
    ExpressionAttributeNames: { "#batch": "batch" },
    ExpressionAttributeValues: { ":batchValue": batchValue, ":score": 0.0 },
  };
  if (status) {
    params.FilterExpression = "#status = :status";
    params.ExpressionAttributeNames["#status"] = "status";
    params.ExpressionAttributeValues[":status"] = status;
  }
  let allApplications = [];
  do {
    const data = await dynamoDB.query(params).promise();
    allApplications = allApplications.concat(data.Items);
    params.ExclusiveStartKey = data.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);
  return allApplications;
}

async function getStudents(batchValue) {
  const params = {
    TableName: STUDENT_TABLE,
    FilterExpression: "#batch = :batchValue",
    ExpressionAttributeValues: { ":batchValue": batchValue },
    ExpressionAttributeNames: { "#batch": "batch" },
  };
  let allStudents = [];
  do {
    const data = await dynamoDB.scan(params).promise();
    allStudents = allStudents.concat(data.Items);
    params.ExclusiveStartKey = data.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);
  return allStudents;
}

async function getSelectedApplications(tableName, selectedApplications) {
  const params = {
    RequestItems: {
      [tableName]: {
        Keys: selectedApplications.map((id) => ({ id })),
      },
    },
  };
  try {
    const data = await dynamoDB.batchGet(params).promise();
    return data.Responses[tableName];
  } catch (error) {
    console.error("Error getting selected master applications", error);
    return [];
  }
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
    console.error("Error checking if user is admin", error);
    return false;
  }
}

async function getStudent(tableName, cpr) {
  const params = {
    TableName: tableName,
    Key: { cpr: cpr },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function getMasterUniversity(universityId) {
  const params = {
    TableName: MASTER_APPLIED_UNIVERSITIES,
    Key: { id: universityId },
  };
  const data = await dynamoDB.get(params).promise();
  return data.Item || { name: "NA" };
}

function processReason(reason) {
  if (!reason) return "";
  let processedReason = "";
  let line = "";
  let charCount = 0;
  for (let i = 0; i < reason.length; i++) {
    line += reason[i];
    charCount++;
    if (charCount >= 90) {
      if (reason[i] === " ") {
        processedReason += line + "\n";
        line = "";
        charCount = 0;
      } else if (reason[i + 1] === " " || i === reason.length - 1) {
        processedReason += line + "\n";
        line = "";
        charCount = 0;
      }
    }
  }
  processedReason += line;
  return processedReason;
}

async function uploadToS3(xlsxBuffer, batchValue) {
  const params = {
    Bucket: S3_BUCKET,
    Key: `MasterApplications ${batchValue}.xlsx`,
    Body: xlsxBuffer,
    ContentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
  await s3.upload(params).promise();
  return s3.getSignedUrl("getObject", {
    Bucket: params.Bucket,
    Key: params.Key,
  });
}

// function convertGpa(gpa) {
//   if (!gpa) return "";
//   // Assuming a 4.0 scale: multiply by 25 to get a score out of 100.
//   return (parseFloat(gpa) * 25).toFixed(2);
// }

/**
 * Retrieves the university name from the BahrainUniversity table using the university ID.
 * @param {string} universityId - The ID of the university to retrieve.
 * @returns {Promise<string>} - The name of the university.
 */
async function getUniversityNameById(universityId) {
  const params = {
    TableName: BAHRAIN_UNIVERSITY_TABLE,
    Key: {
      id: universityId,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    console.log("Fetch DynamoDB result: ", result);
    if (result.Item) {
      console.log(
        "The university name fetched from the table: ",
        result.Item.universityName
      );
      return result.Item.universityName; // Use the correct attribute name
    } else {
      throw new Error(`University with ID ${universityId} not found.`);
    }
  } catch (error) {
    console.error("Error retrieving university name:", error);
    throw error;
  }
}
