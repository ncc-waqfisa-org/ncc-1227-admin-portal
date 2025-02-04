const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Master-specific table names
const {
  MasterApplicationTable: APPLICATION_TABLE,
  MasterAppliedUniversities: UNIVERSITY_TABLE,
  StudentTable: STUDENT_TABLE,
  MasterStatisticsTable: STATISTICS_TABLE,
} = {
  MasterApplicationTable:
    "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterAppliedUniversities:
    "MasterAppliedUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterStatisticsTable:
    "MasterStatistics-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

const tableName = APPLICATION_TABLE;
const batchValue = new Date().getFullYear();

exports.handler = async (event) => {
  console.log(`EVENT RECEIVED: ${JSON.stringify(event)}`);

  try {
    console.log("Starting master statistics update...");
    await updateStatistics(tableName, batchValue);
    console.log("Master statistics successfully updated.");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Master statistics updated" }),
    };
  } catch (error) {
    console.error("Error updating master statistics", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating master statistics" }),
    };
  }
};

async function updateStatistics(tableName, batchValue) {
  // First check if statistics for this batch already exists
  const existingStats = await dynamoDB
    .get({
      TableName: STATISTICS_TABLE,
      Key: {
        id: batchValue,
      },
    })
    .promise();

  const applications = await getAllApplications(tableName, batchValue);
  const students = await getAllStudents(batchValue);

  // Create statistics object without the id field
  const statistics = {
    batch: batchValue,
    totalApplications: applications.length,
    scoreHistogram: getScoreDistribution(applications),
    gpaHistogram: getGPADistribution(applications),
    totalApplicationsPerStatus: getStatusDistribution(applications),
    totalApplicationsPerUniversity: await getUniversityDistribution(
      applications
    ),
    topUniversities: await getUniversityDistribution(applications),
    familyIncome: await getFamilyIncomeDistribution(applications, students),
    updatedAt: new Date().toISOString(),
  };

  if (existingStats.Item) {
    console.log(`Updating existing statistics for batch ${batchValue}`);
    let updateExpression = "set ";
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    // Exclude id from the update operation
    Object.entries(statistics).forEach(([key, value]) => {
      updateExpression += `#${key} = :${key},`;
      expressionAttributeValues[`:${key}`] = value;
      expressionAttributeNames[`#${key}`] = key;
    });

    await dynamoDB
      .update({
        TableName: STATISTICS_TABLE,
        Key: { id: batchValue },
        UpdateExpression: updateExpression.slice(0, -1), // remove trailing comma
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
      })
      .promise();
  } else {
    console.log(`Creating new statistics for batch ${batchValue}`);
    // Include id only when creating new item
    await dynamoDB
      .put({
        TableName: STATISTICS_TABLE,
        Item: {
          id: batchValue,
          ...statistics,
        },
      })
      .promise();
  }

  console.log("Master statistics table successfully updated.");
}

async function getAllApplications(tableName, batchValue) {
  console.log(`Fetching all applications for batch ${batchValue}...`);

  const params = {
    TableName: tableName,
    FilterExpression: "#batch = :batchValue",
    ExpressionAttributeNames: { "#batch": "batch" },
    ExpressionAttributeValues: { ":batchValue": batchValue },
  };

  let allApplications = [];
  let lastEvaluatedKey = null;

  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await dynamoDB.scan(params).promise();
    allApplications = allApplications.concat(result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;

    console.log(
      `Fetched ${
        result.Items.length
      } applications, lastEvaluatedKey: ${JSON.stringify(lastEvaluatedKey)}`
    );
  } while (lastEvaluatedKey);

  console.log(`Total applications fetched: ${allApplications.length}`);
  return allApplications;
}

async function getAllStudents(batchValue) {
  console.log(`Fetching all master students...`);

  const params = {
    TableName: STUDENT_TABLE,
    FilterExpression: "attribute_exists(m_firstName)",
  };

  let allStudents = [];
  let lastEvaluatedKey = null;

  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await dynamoDB.scan(params).promise();
    allStudents = allStudents.concat(result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;

    console.log(
      `Fetched ${
        result.Items.length
      } students, lastEvaluatedKey: ${JSON.stringify(lastEvaluatedKey)}`
    );
  } while (lastEvaluatedKey);

  console.log(`Total students fetched: ${allStudents.length}`);
  return allStudents;
}

function getGenderDistribution(items, genderField) {
  const distribution = { male: 0, female: 0 };
  items.forEach((item) => {
    const gender = item[genderField]
      ? item[genderField].toUpperCase()
      : "UNKNOWN";
    if (gender === "MALE") distribution.male++;
    else if (gender === "FEMALE") distribution.female++;
  });

  console.log(`Gender distribution: ${JSON.stringify(distribution)}`);
  return distribution;
}

async function getUniversityDistribution(applications) {
  // Get all universities first
  const universities = {};
  for (const app of applications) {
    const universityID = app.universityID;
    if (!universities[universityID]) {
      const params = {
        TableName: UNIVERSITY_TABLE,
        Key: {
          id: universityID,
        },
      };
      const result = await dynamoDB.get(params).promise();
      if (result.Item) {
        universities[universityID] = result.Item.universityName;
      }
    }
  }

  // Count applications per university
  const distribution = {};
  applications.forEach((app) => {
    const universityName = universities[app.universityID] || "UNKNOWN";
    distribution[universityName] = (distribution[universityName] || 0) + 1;
  });

  console.log(`University distribution: ${JSON.stringify(distribution)}`);
  return JSON.stringify(distribution);
}

async function getFamilyIncomeDistribution(applications, students) {
  const distribution = {
    above1500: { female: 0, male: 0 },
    below1500: { female: 0, male: 0 },
    above1500Today: { female: 0, male: 0 },
    below1500Today: { female: 0, male: 0 },
  };

  for (const app of applications) {
    let student = students.find((s) => s.cpr === app.studentCPR);
    if (!student) {
      student = await getStudent(STUDENT_TABLE, app.studentCPR);
    }

    if (student) {
      const isToday =
        new Date(app.createdAt).toDateString() === new Date().toDateString();
      const gender = student.gender?.toLowerCase() || "male";
      const income = student.m_income || "LESS_THAN_1500";

      if (income === "MORE_THAN_1500") {
        distribution.above1500[gender]++;
        if (isToday) distribution.above1500Today[gender]++;
      } else {
        distribution.below1500[gender]++;
        if (isToday) distribution.below1500Today[gender]++;
      }
    }
  }

  console.log(`Family income distribution: ${JSON.stringify(distribution)}`);
  return JSON.stringify(distribution);
}

function getScoreDistribution(applications) {
  const distribution = {};
  applications.forEach((app) => {
    const score = app.score || 0;
    let bucket = Math.floor(score / 5) * 5;
    const key = `${bucket}-${bucket + 5}`;
    distribution[key] = (distribution[key] || 0) + 1;
  });

  console.log(`Score histogram: ${JSON.stringify(distribution)}`);
  return JSON.stringify(distribution);
}

function getGPADistribution(applications) {
  const distribution = {};
  applications.forEach((app) => {
    const gpa = app.gpa || 0;
    let bucket = Math.floor(gpa / 5) * 5;
    if (bucket === 100) bucket = 95;
    const key = `${bucket}-${bucket + 5}`;
    distribution[key] = (distribution[key] || 0) + 1;
  });

  console.log(`GPA histogram: ${JSON.stringify(distribution)}`);
  return JSON.stringify(distribution);
}

function getStatusDistribution(applications) {
  const distribution = {};
  applications.forEach((app) => {
    const status = app.status || "UNKNOWN";
    distribution[status] = (distribution[status] || 0) + 1;
  });

  console.log(`Status distribution: ${JSON.stringify(distribution)}`);
  return JSON.stringify(distribution);
}
