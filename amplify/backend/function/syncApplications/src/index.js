const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const { ApplicationTable: APPLICATION_TABLE } = {
  ApplicationTable: "Application-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  try {
    // const requestBody = JSON.parse(event.body);
    const requestBody = event.Records[0];
    console.log(requestBody);
    console.log(requestBody.eventName);
    if (requestBody.eventName !== "MODIFY") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No changes detected. Skipping update",
        }),
      };
    }

    const student = requestBody.dynamodb.NewImage;
    const oldStudent = requestBody.dynamodb.OldImage;
    console.log("New Student Record", student);
    console.log("Old Student Record", oldStudent);

    // Get all unapproved applications for the student
    const applications = await getApplications(student.cpr.S);

    console.log("Applications to update:", applications);

    for (const application of applications) {
      console.log("Processing application:", application);

      if (application) {
        await updateApplication(application, oldStudent, student);
      }
    }
    console.log("Lambda executed successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Application updated successfully",
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify("Error" + error),
    };
  }
};

async function updateApplication(application, oldStudent, student) {
  // update studentName, nationalityCategory, familyIncome

  const params = {
    TableName: APPLICATION_TABLE,
    Key: {
      id: application.id,
    },
    UpdateExpression: "SET ",
    ExpressionAttributeValues: {},
  };

  if (student.fullName.S !== oldStudent.fullName.S) {
    params.UpdateExpression += "studentName = :studentName, ";
    params.ExpressionAttributeValues[":studentName"] = student.fullName.S;
  }

  if (student.nationalityCategory.S !== oldStudent.nationalityCategory.S) {
    params.UpdateExpression += "nationalityCategory = :nationalityCategory, ";
    params.ExpressionAttributeValues[":nationalityCategory"] =
      student.nationalityCategory.S;
  }

  if (student.familyIncome.S !== oldStudent.familyIncome.S) {
    const score = calculateScore(
      student.familyIncome.S,
      application.verifiedGPA,
      application.gpa,
      application.adminPoints
    );
    console.log(
      "Score:",
      score,
      student.familyIncome.S,
      application.verifiedGPA,
      application.gpa,
      application.adminPoints
    );
    params.UpdateExpression += "familyIncome = :familyIncome, score = :score, ";
    params.ExpressionAttributeValues[":familyIncome"] = student.familyIncome.S;
    params.ExpressionAttributeValues[":score"] = score;
  }

  console.log(params.UpdateExpression);
  if (params.UpdateExpression === "SET ") {
    return;
  }

  params.UpdateExpression = params.UpdateExpression.slice(0, -2); // Remove the last comma
  await dynamoDB.update(params).promise();
}

/**
 * Get all applications for a student by their CPR
 * 
 * @param {*} studentCPR 
 * @returns 
 */
async function getApplications(studentCPR) {
  const params = {
    TableName: APPLICATION_TABLE,
    IndexName: "byCPR",
    KeyConditionExpression: "studentCPR = :studentCPR",
    FilterExpression: "isFamilyIncomeVerified <> :trueValue",
    ExpressionAttributeValues: {
      ":studentCPR": studentCPR,
      ":trueValue": true,
    },
  };

  const application = await dynamoDB.query(params).promise();
  return application.Items;
}

function calculateScore(familyIncome, verifiedGPA, gpa, adminPoints) {
  let score = verifiedGPA ? verifiedGPA * 0.7 : gpa * 0.7;
  if (
    familyIncome === "LESS_THAN_1500" ||
    familyIncome === "BETWEEN_500_AND_700" ||
    familyIncome === "BETWEEN_700_AND_1000" ||
    familyIncome === "LESS_THAN_500"
  ) {
    score += 20;
  } else if (familyIncome === "MORE_THAN_1500") {
    score += 10;
  }

  score += adminPoints ? parseInt(adminPoints) : 0;
  return Math.round(score * 100) / 100;
}
