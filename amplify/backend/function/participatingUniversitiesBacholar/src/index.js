const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const {
  UniversityTable: UNIVERSITY_TABLE,
  StatisticsTable: STATISTICS_TABLE,
  BatchTable: BATCH_TABLE,
} = {
  UniversityTable: "University-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StatisticsTable: "Statistics-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  BatchTable: "Batch-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  try {
    // Step 1: Get current date and derive batch value using the current year.
    const today = new Date();
    const batchValue = today.getFullYear();
    console.log(
      `Step 1: Current date is ${today.toDateString()}. Batch value determined as ${batchValue}`
    );

    // Step 2: Retrieve batch details for the current batch.
    console.log(
      `Step 2: Retrieving batch details for batch value ${batchValue}`
    );
    const batchDetails = await getBatchDetails(batchValue);
    if (!batchDetails) {
      console.log(`Batch details not found for batch value ${batchValue}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Batch not found" }),
      };
    }
    console.log(`Batch details retrieved: ${JSON.stringify(batchDetails)}`);

    // Step 3: Validate that today matches the updateApplicationEndDate.
    const updateApplicationEndDate = new Date(
      batchDetails.updateApplicationEndDate
    );
    console.log(
      `Step 3: Validating update application end date. Today: ${today.toDateString()}, Update End Date: ${updateApplicationEndDate.toDateString()}`
    );
    if (today.toDateString() !== updateApplicationEndDate.toDateString()) {
      console.log(
        `Today (${today.toDateString()}) is not the update application end date (${updateApplicationEndDate.toDateString()}). Exiting process.`
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Today is not the update application end date",
        }),
      };
    }

    // Step 4: Fetch active universities from the university table.
    console.log(`Step 4: Fetching active universities from University table`);
    const activeUniversities = await getActiveUniversities();
    console.log(
      `Fetched ${
        activeUniversities.length
      } active universities: ${JSON.stringify(activeUniversities)}`
    );

    // Step 5: Update the statistics table with the active universities.
    console.log(`Step 5: Updating statistics table for batch ${batchValue}`);
    await updateStatistics(activeUniversities, batchValue);
    console.log(
      `Statistics table updated successfully for batch ${batchValue}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Participating universities updated successfully",
      }),
    };
  } catch (error) {
    console.error("Error updating participating universities:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

async function getBatchDetails(batchValue) {
  const params = {
    TableName: BATCH_TABLE,
    Key: {
      batch: batchValue,
    },
  };
  console.log(`Fetching batch details with params: ${JSON.stringify(params)}`);
  const { Item } = await dynamoDB.get(params).promise();
  console.log(`Retrieved batch details: ${JSON.stringify(Item)}`);
  return Item;
}

async function getActiveUniversities() {
  const params = {
    TableName: UNIVERSITY_TABLE,
    FilterExpression: "#isDeactivated = :isDeactivatedValue",
    ExpressionAttributeNames: {
      "#isDeactivated": "isDeactivated",
    },
    ExpressionAttributeValues: {
      ":isDeactivatedValue": false, // this will return actives ones only
    },
  };

  console.log(
    `Scanning active universities with params: ${JSON.stringify(params)}`
  );
  let allUniversities = [];
  let lastEvaluatedKey = null;

  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await dynamoDB.scan(params).promise();
    console.log(`Scan result: ${JSON.stringify(result)}`);
    allUniversities = allUniversities.concat(result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  const universityNames = allUniversities.map((university) => university.name);
  console.log(`Extracted university names: ${JSON.stringify(universityNames)}`);
  return universityNames;
}

async function updateStatistics(universities, batchValue) {
  const params = {
    TableName: STATISTICS_TABLE,
    Key: {
      id: batchValue,
    },
    UpdateExpression:
      "SET #participatingUniversities = :universities, #batch = :batch",
    ExpressionAttributeNames: {
      "#participatingUniversities": "participatingUniversities",
      "#batch": "batch",
    },
    ExpressionAttributeValues: {
      ":universities": universities,
      ":batch": batchValue,
    },
  };

  console.log(
    `Updating statistics table with params: ${JSON.stringify(params)}`
  );
  await dynamoDB.update(params).promise();
  console.log(`Statistics updated for batch ${batchValue}`);
}
