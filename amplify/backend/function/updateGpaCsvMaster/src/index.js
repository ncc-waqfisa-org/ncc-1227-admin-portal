const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const { ApplicationTable: APPLICATION_TABLE, AdminTable: ADMIN_TABLE } = {
  ApplicationTable: "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const token = event.headers?.authorization?.slice(7);
  console.log("Authorization token extracted:", token);

  if (!token) {
    console.log("Missing authorization token");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized!" }),
    };
  }

  const isAdmin = await checkIsAdmin(token);
  console.log("Is user admin:", isAdmin);

  if (!isAdmin) {
    console.log("User is not an admin");
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden. You are not an admin" }),
    };
  }

  const csvData = event.body;
  if (!csvData) {
    console.log("Missing CSV data in request body");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing required parameters, csv" }),
    };
  }

  console.log("csvData from body event: ", csvData);

  const batchValue =
    parseInt(event.queryStringParameters?.batch) || new Date().getFullYear();
  console.log("Batch value:", batchValue);

  const applications = await getApplications(batchValue);
  console.log("Applications retrieved:", applications);

  const dataStream = processCsv(csvData, applications);
  console.log("Processed CSV data:", dataStream);

  try {
    await bulkUpdateApplications(APPLICATION_TABLE, batchValue, dataStream);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Applications updated" }),
    };
  } catch (error) {
    console.error("Error updating applications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating applications" }),
    };
  }
};

async function bulkUpdateApplications(tableName, batchValue, dataStream) {
  console.log("Starting bulk update...");
  const updatePromises = dataStream.map(async (row) => {
    console.log("Processing row:", row);
    let score = calculateScore(row.Income, row.verifiedGPA);
    console.log("Calculated score:", score);

    const params = {
      TableName: APPLICATION_TABLE,
      Key: {
        id: row.id,
      },
      UpdateExpression: "SET verifiedGPA = :gpa, score = :score",
      ExpressionAttributeValues: {
        ":gpa": parseFloat(row.verifiedGPA),
        ":score": score,
      },
    };
    console.log("Update params:", params);

    return dynamoDB.update(params).promise();
  });

  return Promise.all(updatePromises);
}

function processCsv(csvData, applications) {
  let csvString = Buffer.from(csvData, "base64").toString("utf-8");
  const rows = csvString.split(/\r?\n/).slice(1);

  const dataStream = rows
    .map((row) => {
      const columns = row.split(",");
      let cpr = columns[0]?.replace(/[^0-9]/g, "");
      console.log("CPR:", cpr);

      if (cpr.length < 9) {
        cpr = "0".repeat(9 - cpr.length) + cpr;
      }

      return {
        id: applications.find((application) => application.studentCPR === cpr)
          ?.id,
        cpr: cpr,
        verifiedGPA: columns[1],
        familyIncome: applications.find(
          (application) => application.studentCPR === cpr
        )?.familyIncome,
        adminPoints:
          applications.find((application) => application.studentCPR === cpr)
            ?.adminPoints ?? 0,
      };
    })
    .filter(
      (row) =>
        row.id &&
        row.verifiedGPA &&
        !isNaN(row.verifiedGPA) &&
        row.cpr.length === 9
    );

  return dataStream;
}

async function checkIsAdmin(token) {
  try {
    console.log("Checking if user is admin...");
    const cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
    const username = cognitoUser.Username;
    console.log("Cognito username:", username);

    const params = {
      TableName: ADMIN_TABLE,
      Key: {
        cpr: username,
      },
    };
    console.log("Admin table query params:", params);

    const { Item } = await dynamoDB.get(params).promise();
    console.log("Admin table query result:", Item);

    return Item !== undefined;
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    return false;
  }
}

function calculateScore(Income, gpa, adminPoints = 0) {
  console.log("Calculating score with Income:", Income, "GPA:", gpa);
  const gpa100 = gpa * 25;

  let score = gpa100 * 0.7 + adminPoints;
  if (Income === "LESS_THAN_1500") {
    score += 20;
  } else if (Income === "MORE_THAN_1500") {
    score += 10;
  }
  const roundedScore = Math.round(score * 100) / 100;
  console.log("Calculated score:", roundedScore);
  return roundedScore;
}

// get the master batch application
async function getApplications(batch) {
  console.log("Fetching applications for batch:", batch);
  const params = {
    TableName: APPLICATION_TABLE,
    KeyConditionExpression: "#batch = :batchValue",
    ScanIndexForward: false,
    IndexName: "byMasterBatch",
    ExpressionAttributeNames: {
      "#batch": "batch",
    },
    ExpressionAttributeValues: {
      ":batchValue": batch,
    },
  };

  let allApplications = [];
  do {
    console.log("Querying DynamoDB with params:", params);
    const applications = await dynamoDB.query(params).promise();
    console.log("Applications batch result:", applications.Items);
    allApplications = allApplications.concat(applications.Items);
    params.ExclusiveStartKey = applications.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  console.log("All applications retrieved:", allApplications);
  return allApplications;
}
