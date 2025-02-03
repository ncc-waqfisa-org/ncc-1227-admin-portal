const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const {
  MasterUniversityTable: UNIVERSITY_TABLE,
  MasterStatisticsTable: STATISTICS_TABLE,
  MasterBatchTable: BATCH_TABLE,
} = {
  MasterUniversityTable:
    "MasterAppliedUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterStatisticsTable:
    "MasterStatistics-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterBatchTable: "MasterBatch-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};
//u0da
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  try {
    // Get current batch details
    const today = new Date();
    const batchValue = today.getFullYear();
    const batchDetails = await getBatchDetails(batchValue);

    if (!batchDetails) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Batch not found" }),
      };
    }

    // Check if today is the updateApplicationEndDate
    const updateApplicationEndDate = new Date(
      batchDetails.updateApplicationEndDate
    );
    if (today.toDateString() !== updateApplicationEndDate.toDateString()) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Today is not the update application end date",
        }),
      };
    }

    // Get all active universities
    const activeUniversities = await getActiveUniversities();

    // Update statistics table
    await updateStatistics(activeUniversities, batchValue);

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
  const { Item } = await dynamoDB.get(params).promise();
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
      ":isDeactivatedValue": false, // false means active
    },
  };

  let allUniversities = [];
  let lastEvaluatedKey = null;

  console.log(`all universities: `, allUniversities);

  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await dynamoDB.scan(params).promise();
    allUniversities = allUniversities.concat(result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return allUniversities.map((university) => university.universityName);
}

async function updateStatistics(universities, batchValue) {
  const params = {
    TableName: STATISTICS_TABLE,
    Key: {
      id: batchValue, // Specific ID for master statistics
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

  await dynamoDB.update(params).promise();
}
