const AWS = require("aws-sdk");
const XLSX = require("xlsx");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const cognito = new AWS.CognitoIdentityServiceProvider();

const {
  ApplicationTable: APPLICATION_TABLE,
  StudentTable: STUDENT_TABLE,
  ParentInfoTable: PARENT_INFO_TABLE,
  UniversityTable: UNIVERSITY_TABLE,
  ProgramTable: PROGRAM_TABLE,
  AdminTable: ADMIN_TABLE,
  S3Bucket: S3_BUCKET,
} = {
  ApplicationTable: "Application-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  ParentInfoTable: "ParentInfo-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  UniversityTable: "University-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  ProgramTable: "Program-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  S3Bucket: "ncc1227bucket65406-staging",
};

/**
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
      Number.parseInt(event.queryStringParameters?.batch) ||
      new Date().getFullYear();
    let body;

    if (typeof event.body === "string") {
      body = JSON.parse(event.body);
    } else {
      body = event;
    }

    const selectedApplications = body.ids;
    if (selectedApplications && !Array.isArray(selectedApplications)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Invalid selected applications. Must be an array of application IDs",
        }),
      };
    }

    const status = event.queryStringParameters?.status || null;
    if (
      status &&
      ![
        "APPROVED",
        "WITHDRAWN",
        "REJECTED",
        "ELIGIBLE",
        "NOT_COMPLETED",
      ].includes(status)
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Invalid status. Must be one of: APPROVED, WITHDRAWN, REJECTED, ELIGIBLE, NOT_COMPLETED",
        }),
      };
    }
    const csv = await exportApplicationsCsv(
      APPLICATION_TABLE,
      batchValue,
      status,
      selectedApplications
    );

    return {
      statusCode: 200,
      //  Uncomment below to enable CORS requests
      //  headers: {
      //      "Access-Control-Allow-Origin": "*",
      //      "Access-Control-Allow-Headers": "*"
      //  },q23323
      body: JSON.stringify({
        url: csv,
      }),
    };
  } catch (error) {
    console.error("Error exporting applications", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error exporting applications" }),
    };
  }
};

function jsonToXlsx(jsonArray) {
  const worksheet = XLSX.utils.json_to_sheet(jsonArray);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
  const workbookBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });

  return workbookBuffer;
}

async function getStudent(tableName, cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: cpr,
    },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function getParentInfo(tableName, id) {
  const params = {
    TableName: PARENT_INFO_TABLE,
    Key: {
      id: id,
    },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function convertToJson(applications, students) {
  const jsonArray = [];
  for (const application of applications) {
    let student = students.find(
      (student) => student.cpr === application.studentCPR
    );
    const university = application.universityID
      ? await getUniversity(application.universityID)
      : { name: "NA" };
    const program = application.universityID
      ? await getProgram(application.programID)
      : { name: "NA" };
    const reason = processReason(application.reason);
    if (!student) {
      student = await getStudent(STUDENT_TABLE, application.studentCPR);
    }
    const graduationYear = student?.graduationDate
      ? new Date(student?.graduationDate).getFullYear()
      : application.batch;

    let parentInfo = null;
    if (student?.parentInfoID) {
      parentInfo = await getParentInfo(PARENT_INFO_TABLE, student.parentInfoID);
    }

    if (student) {
      jsonArray.push({
        "Submission Date": application.createdAt
          ? formatter.format(new Date(application.createdAt))
          : "-",
        "Submission Time": application.createdAt
          ? timeFormatter.format(new Date(application.createdAt))
          : "-",
        Id: application.id,
        "Student CPR": application.studentCPR,
        Name: student.fullName,
        Gender: student.gender,
        Nationality: student.nationalityCategory,
        Status: application.status,
        "Graduation Year": graduationYear,
        Field: student.specialization,
        "School Name": application.schoolName,
        "School Type": application.schoolType,
        GPA: application.gpa,
        "Verified GPA": application.verifiedGPA,
        Score: application.score,
        "Chosen University": university.name,
        "Chosen Program": program.name,
        "Preferred Program": application.allProgramsTextOption ?? "-",
        Reason: reason,
        "Family Income": application.familyIncome,
        "Is Family Income Verified": application.isFamilyIncomeVerified
          ? "Yes"
          : "",
        "Number Of Family Members": parentInfo?.numberOfFamilyMembers,
        "Number of Siblings": student.studentOrderAmongSiblings,
        "Student Date of Birth": student.dob
          ? formatter.format(new Date(student.dob))
          : "-",
        "Student Place of Birth": student.placeOfBirth,
        "Student Address": student.address,
        Phone: student.phone,
        Email: student.email,
        "Guardian Name": parentInfo?.guardianFirstName
          ? [
              parentInfo?.guardianFirstName,
              parentInfo?.guardianSecondName,
              parentInfo?.guardianThirdName,
              parentInfo?.guardianLastName,
            ]
              .filter(Boolean)
              .join(" ")
          : parentInfo?.guardianFullName || "-",
        "Guardian Relation": parentInfo?.relation || "-",
        "Guardian CPR": parentInfo?.guardianCPR || "-",
        "Guardian Address": parentInfo?.address || "-",
        "Guardian Primary Mobile Number": parentInfo?.primaryMobile || "-",
        "Guardian Secondary Mobile Number": parentInfo?.secondaryMobile || "-",
        "Guardian Email": parentInfo?.guardianEmail || "-",
        "Father Name": parentInfo?.fatherFullName || "-",
        "Father CPR": parentInfo?.fatherCPR || "-",
        "Mother Name": parentInfo?.motherFullName || "-",
        "Mother CPR": parentInfo?.motherCPR || "-",
        "Total Score": application.score,
        "Admin Points": application.adminPoints,
      });
    }
  }

  return jsonArray;
}

async function exportApplicationsCsv(
  tableName,
  batchValue,
  status,
  selectedApplications
) {
  const applications = selectedApplications
    ? await getSelectedApplications(tableName, selectedApplications)
    : await getApplications(tableName, batchValue, status);
  const students = await getStudents(batchValue);
  // sort applications by createdAt in ascending order
  applications.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const jsonArray = await convertToJson(applications, students);
  const xlsxBuffer = jsonToXlsx(jsonArray);
  const uploadUrl = await uploadToS3(xlsxBuffer, batchValue);
  return uploadUrl;
}

async function getApplications(tableName, batchValue, status) {
  const params = {
    TableName: APPLICATION_TABLE,
    IndexName: "byScore",
    KeyConditionExpression: "#batch = :batchValue AND score > :score",
    ExpressionAttributeNames: {
      "#batch": "batch",
    },
    ExpressionAttributeValues: {
      ":batchValue": batchValue,
      ":score": 0.0,
    },
    ScanIndexForward: false,
  };
  if (status) {
    params.FilterExpression += " AND #status = :status";
    params.ExpressionAttributeNames["#status"] = "status";
    params.ExpressionAttributeValues[":status"] = status;
  }

  let allApplications = [];

  do {
    const applications = await dynamoDB.query(params).promise();
    allApplications = allApplications.concat(applications.Items);

    // Check if there are more items to fetch
    params.ExclusiveStartKey = applications.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  return allApplications;
}

// async function convertToCsv(applications, students) {
//     let csv = 'id,Student CPR,Name,Gender,Nationality,Field,Phone,email,Graduation Year,Status,GPA,Score,School Name,School Type,Family Income,Chosen University,Chosen Program,Reason,Total Score,Number of Family Members\n';
//     for (const application of applications) {
//         const student = students.find(student => student.cpr === application.studentCPR);
//         const university = application.universityID? await getUniversity(application.universityID): {name: "NA"}
//         const program = application.universityID? await getProgram(application.programID): {name: "NA"}
//         const reason = processReason(application.reason);
//         if (student) {
//             csv += `${application.id},=""${application.studentCPR}"","${student?.fullName}",${student?.gender},${student?.nationalityCategory},"${student?.specialization}",${student?.phone},${student?.email},${application.batch},${application.status},${application.gpa},${application.score},"${application.schoolName}",${application.schoolType},${application.familyIncome},"${university?.name}","${program?.name}","${reason}",${application.score},${student.numberOfFamilyMembers}\n`;
//         }
//     }
//     console.log(csv);
//     return csv;
// }

function processReason(reason) {
  // take new line after every 90 characters, if there is a space. if not, move to the next space and take a new line
  if (!reason) return "";
  let processedReason = "";
  let line = "";
  let charCount = 0;

  for (let i = 0; i < reason.length; i++) {
    line += reason[i];
    charCount++;
    if (charCount >= 90) {
      if (reason[i] === " ") {
        processedReason += `${line}\n`;
        line = "";
        charCount = 0;
      } else if (reason[i + 1] === " " || i === reason.length - 1) {
        processedReason += `${line}\n`;
        line = "";
        charCount = 0;
      }
    }
  }

  processedReason += line;
  return processedReason;
}

async function uploadToS3(xlsxBuffer, batchValue) {
  console.log("Uploading to S3", batchValue);

  const path = "public/reports/";

  const params = {
    Bucket: S3_BUCKET,
    Key: `${path}Applications ${batchValue}.xlsx`,
    Body: xlsxBuffer,
    ContentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ContentDisposition: `attachment; filename="Bachelor Applications ${batchValue}-export-${
      new Date()?.toISOString().split("T")[0]
    }.xlsx"`,
  };
  await s3.upload(params).promise();

  // Return the URL of the uploaded file
  return s3.getSignedUrl("getObject", {
    Bucket: params.Bucket,
    Key: params.Key,
  });
}

async function getStudents(batchValue) {
  // const startDate = new Date();
  // startDate.setFullYear(batchValue);
  // startDate.setMonth(0); // September
  // startDate.setDate(1); // 1st
  // const endDate = new Date();
  // endDate.setMonth(11); // December
  // endDate.setDate(31); // 31st
  const params = {
    TableName: STUDENT_TABLE,
    // graduationDate is contained in the batch attribute
    FilterExpression: "#batch = :batchValue",
    ExpressionAttributeValues: {
      // ':startDate': startDate.toISOString(),
      // ':endDate': endDate.toISOString()
      ":batchValue": batchValue,
    },
    ExpressionAttributeNames: {
      "#batch": "batch",
    },
  };
  let allStudents = [];

  do {
    const students = await dynamoDB.scan(params).promise();
    allStudents = allStudents.concat(students.Items);

    // Check if there are more items to fetch
    params.ExclusiveStartKey = students.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  return allStudents;
}

async function getSelectedApplications(tableName, selectedApplications) {
  console.log("Selected applications:", selectedApplications);
  console.log(
    "Processed applications:",
    selectedApplications.map((id) => ({ id }))
  );
  const params = {
    // IndexName: 'byId',
    RequestItems: {
      [APPLICATION_TABLE]: {
        Keys: selectedApplications.map((id) => ({ id })),
      },
    },
  };

  try {
    const data = await dynamoDB.batchGet(params).promise();
    return data.Responses[APPLICATION_TABLE];
  } catch (err) {
    console.error("Error getting selected applications", err);
    return []; // or handle the error appropriately
  }
}

async function checkIsAdmin(token) {
  // get the username from the token using cognito
  try {
    const cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
    const username = cognitoUser.Username;

    const params = {
      TableName: ADMIN_TABLE,
      Key: {
        cpr: username,
      },
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Item !== undefined;
  } catch (error) {
    console.error("Error checking if user is admin", error);
    return false;
  }
}

async function getUniversity(universityId) {
  const params = {
    TableName: UNIVERSITY_TABLE,
    Key: {
      id: universityId,
    },
  };
  const university = await dynamoDB.get(params).promise();
  return university.Item;
}

async function getProgram(programId) {
  const params = {
    TableName: PROGRAM_TABLE,
    Key: {
      id: programId,
    },
  };
  const program = await dynamoDB.get(params).promise();
  return program.Item;
}

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Bahrain",
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Bahrain",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});
