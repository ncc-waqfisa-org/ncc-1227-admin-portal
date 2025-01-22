const AWS = require("aws-sdk");
const csv = require("csv-parser");
const cognito = new AWS.CognitoIdentityServiceProvider();
const lambda = new AWS.Lambda();

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const {
  ApplicationTable: APPLICATION_TABLE,
  AdminTable: ADMIN_TABLE,
  StudentTable: STUDENT_TABLE,
  BulkFunction: BULK_FUNCTION,
} = {
  ApplicationTable: "Application-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  BulkFunction: "bulkAutoReject-masterdev",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const token = event.headers?.authorization?.slice(7);
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized!" }),
    };
  }

  const isAdmin = await checkIsAdmin(token);
  if (!isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden. You are not an admin" }),
    };
  }

  const csvData = event.body;
  if (!csvData) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing required parameters, csv" }),
    };
  }

  const batchValue =
    parseInt(event.queryStringParameters?.batch) || new Date().getFullYear();
  const applications = await getApplications(batchValue);
  const dataStream = processCsv(csvData, applications);

  try {
    await bulkUpdateApplications(APPLICATION_TABLE, batchValue, dataStream);

    // invoke the autoReject lambda function
    const params = {
      FunctionName: BULK_FUNCTION,
      InvocationType: "Event",
      Payload: JSON.stringify({ batch: batchValue }),
    };
    await lambda.invoke(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Applications updated" }),
    };
  } catch (error) {
    console.error("Error updating applications", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating applications" }),
    };
  }
};

async function bulkUpdateApplications(tableName, batchValue, dataStream) {
  const updatePromises = dataStream.map(async (row) => {
    let score = calculateScore(row.familyIncome, row.verifiedGPA);

    const params = {
      TableName: tableName,
      Key: {
        id: row.id,
      },
      UpdateExpression: "SET verifiedGPA = :gpa, score = :score",
      ExpressionAttributeValues: {
        ":gpa": parseFloat(row.verifiedGPA),
        ":score": score,
      },
    };

    return dynamoDB.update(params).promise();
  });

  return Promise.all(updatePromises);
}

function processCsv(csvData, applications) {
  const dataStream = csvData
    .split("\n")
    .slice(1)
    .map((row) => {
      const columns = row.split(",");
      return {
        id: columns[0],
        verifiedGPA: columns[1],
        familyIncome: columns[2],
      };
    })
    .filter((row) => row.id && row.verifiedGPA && !isNaN(row.verifiedGPA));

  return dataStream;
}

async function checkIsAdmin(token) {
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

function calculateScore(familyIncome, gpa, adminPoints = 0) {
  let score = gpa * 0.7 + adminPoints;
  if (familyIncome === "LESS_THAN_1500") {
    score += 20;
  } else if (familyIncome === "MORE_THAN_1500") {
    score += 10;
  }
  return Math.round(score * 100) / 100;
}

async function getStudent(cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: cpr,
    },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function getApplications(batch) {
  const params = {
    TableName: APPLICATION_TABLE,
    KeyConditionExpression: "#batch = :batchValue",
    ScanIndexForward: false,
    IndexName: "byBatch",
    ExpressionAttributeNames: {
      "#batch": "batch",
    },
    ExpressionAttributeValues: {
      ":batchValue": batch,
    },
  };

  let allApplications = [];
  do {
    const applications = await dynamoDB.query(params).promise();
    allApplications = allApplications.concat(applications.Items);
    params.ExclusiveStartKey = applications.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  return allApplications;
}
