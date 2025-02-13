const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Master-specific table names
const {
  MasterApplicationTable: APPLICATION_TABLE,
  MasterAppliedUniversities: UNIVERSITY_TABLE,
  StudentTable: STUDENT_TABLE,
  MasterStatisticsTable: STATISTICS_TABLE,
  BahrainUniversities: BAHRAIN_UNIVERSITIES_TABLE,
} = {
  MasterApplicationTable:
    "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterAppliedUniversities:
    "MasterAppliedUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterStatisticsTable:
    "MasterStatistics-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  BahrainUniversities:
    "BahrainUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
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
      Key: { id: batchValue },
    })
    .promise();

  const applications = await getAllApplications(tableName, batchValue);
  const students = await getAllStudents(batchValue);

  // Run asynchronous statistics calculations in parallel using Promise.all.
  const [
    totalApplicationsPerUniversity,
    topUniversities,
    familyIncome,
    applicationPerGenderHistogram,
    registerAccountsPerGender,
    majorsPerGenderHistogram,
    incomePerEmploymentStatus,
    gpaHistogram,
  ] = await Promise.all([
    getUniversityDistribution(applications),
    getTopUniversities(applications),
    getFamilyIncomeDistribution(applications, students),
    getApplicationsPerGender(applications),
    getRegisterAccountsPerGender(applications),
    getMajorsGenderHistogram(applications),
    getIncomePerEmploymentStatus(applications),
    getGpaHistogram(applications),
  ]);

  // Create statistics object without the id field.
  // For MasterStatistics, we include additional fields as defined in the schema.
  const statistics = {
    batch: batchValue,
    totalApplications: applications.length,
    scoreHistogram: getScoreDistribution(applications),
    gpaHistogram,
    totalApplicationsPerStatus: getStatusDistribution(applications),
    totalApplicationsPerUniversity,
    topUniversities,
    familyIncome,
    applicationPerGenderHistogram,
    registerAccountsPerGender,
    majorsPerGenderHistogram,
    incomePerEmploymentStatus,
    updatedAt: new Date().toISOString(),
  };

  if (existingStats.Item) {
    console.log(`Updating existing statistics for batch ${batchValue}`);
    // Calculate new version and timestamp for update
    const newVersion = (existingStats.Item._version || 0) + 1;
    const epochTime = Date.now();

    let updateExpression = "set ";
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    // Exclude id (and createdAt, which should not be updated) from the update
    Object.entries(statistics).forEach(([key, value]) => {
      updateExpression += `#${key} = :${key}, `;
      expressionAttributeValues[`:${key}`] = value;
      expressionAttributeNames[`#${key}`] = key;
    });

    // Manually add the _version and _lastChangedAt fields
    updateExpression +=
      "#_version = :_version, #_lastChangedAt = :_lastChangedAt";
    expressionAttributeValues[":_version"] = newVersion;
    expressionAttributeValues[":_lastChangedAt"] = epochTime;
    expressionAttributeNames["#_version"] = "_version";
    expressionAttributeNames["#_lastChangedAt"] = "_lastChangedAt";

    await dynamoDB
      .update({
        TableName: STATISTICS_TABLE,
        Key: { id: batchValue },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
      })
      .promise();
  } else {
    console.log(`Creating new statistics for batch ${batchValue}`);
    const timestamp = new Date().toISOString();
    const epochTime = Date.now();

    // Include id along with the manual fields when creating a new item
    await dynamoDB
      .put({
        TableName: STATISTICS_TABLE,
        Item: {
          id: batchValue,
          createdAt: timestamp, // AWSDateTime (non-nullable)
          updatedAt: statistics.updatedAt,
          _version: 1, // initial version
          _lastChangedAt: epochTime, // AWSTimestamp (non-nullable)
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

/**
 * Calculates the distribution of applications per university.
 * Instead of using the raw universityID as the key, this function queries the MasterAppliedUniversities table
 * (referred by the constant UNIVERSITY_TABLE) and retrieves the corresponding "universityName".
 *
 * The output is a mapping where the keys are the university names and the values are the counts of applications.
 * For example:
 * {
 *   "University of British": 5,
 *   "University of Bahrain": 15,
 *   "University of something": 52
 * }
 */
async function getUniversityDistribution(applications) {
  // Create a mapping of universityIDs to their corresponding universityName.
  const universityNameMap = {};
  for (const app of applications) {
    const universityID = app.universityID;
    // Avoid multiple lookups for the same universityID.
    if (!universityNameMap.hasOwnProperty(universityID)) {
      const params = {
        TableName: UNIVERSITY_TABLE, // This is actually the MasterAppliedUniversities table.
        Key: { id: universityID },
        ProjectionExpression: "universityName", // Only retrieve the universityName field.
      };
      const result = await dynamoDB.get(params).promise();
      universityNameMap[universityID] =
        result.Item && result.Item.universityName
          ? result.Item.universityName
          : "UNKNOWN";
    }
  }

  // Build the distribution mapping with university names as keys.
  const distribution = {};
  applications.forEach((app) => {
    const universityName = universityNameMap[app.universityID];
    distribution[universityName] = (distribution[universityName] || 0) + 1;
  });

  console.log(`University distribution: ${JSON.stringify(distribution)}`);
  return distribution;
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
      student = await getStudent(app.studentCPR);
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
  // Return the object directly.
  return distribution;
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
  // Return the object directly.
  return distribution;
}

function getStatusDistribution(applications) {
  const distribution = {};
  applications.forEach((app) => {
    const status = app.status || "UNKNOWN";
    distribution[status] = (distribution[status] || 0) + 1;
  });

  console.log(`Status distribution: ${JSON.stringify(distribution)}`);
  // Return the object directly.
  return distribution;
}
/**
 * Calculates the gender distribution for the provided applications.
 * For each application, it retrieves the corresponding student (via the getStudent function)
 * and increments counts for 'male' or 'female' based on the student's gender.
 * Additionally, if the application was created today (or within the last 24 hours),
 * it increments the "today" gender counters.
 *
 * Expected return format:
 * {
 *   "male": [number],
 *   "female": [number],
 *   "total": [number],      // male + female
 *   "todayMale": [number],
 *   "todayFemale": [number],
 *   "todayTotal": [number]  // todayMale + todayFemale
 * }
 */
async function getApplicationsPerGender(applications) {
  const distribution = {
    male: 0,
    female: 0,
    todayMale: 0,
    todayFemale: 0,
  };

  // Get today's date string for comparison.
  const todayString = new Date().toDateString();

  for (const app of applications) {
    // Retrieve the student record using the studentCPR from the application.
    const student = await getStudent(app.studentCPR);
    if (!student || !student.gender) continue;
    const gender = student.gender.toUpperCase();

    if (gender === "MALE") {
      distribution.male += 1;
    } else if (gender === "FEMALE") {
      distribution.female += 1;
    }

    // Check the application's creation date.
    const createdDate = app.createdAt ? app.createdAt : "";
    if (createdDate === todayString) {
      if (gender === "MALE") {
        distribution.todayMale += 1;
      } else if (gender === "FEMALE") {
        distribution.todayFemale += 1;
      }
    }
  }

  const total = distribution.male + distribution.female;
  const todayTotal = distribution.todayMale + distribution.todayFemale;

  return {
    male: distribution.male,
    female: distribution.female,
    total,
    todayMale: distribution.todayMale,
    todayFemale: distribution.todayFemale,
    todayTotal,
  };
}

/**
 * Retrieves registered MASTER accounts statistics by gender from the Student table.
 *
 * This function scans the Student table to fetch only the students whose
 * "m_masterType" attribute meets one of the following conditions:
 *   - It is exactly "MASTER"
 *   - Or it is a collection (e.g. a list or set) that contains "MASTER"
 *
 * For each student record returned, the function computes gender-based counts using the student's "gender" field.
 * It also evaluates the "createdAt" attribute to determine if the registration occurred within the last 24 hours,
 * contributing to the "today" counts.
 *
 * Expected return format:
 * {
 *   "male": number,        // Total master accounts that are male
 *   "female": number,      // Total master accounts that are female
 *   "total": number,       // male + female
 *   "todayFemale": number, // Today-registered master accounts that are female
 *   "todayTotal": number   // Today-registered master accounts (male + female)
 * }
 */
async function getRegisterAccountsPerGender() {
  console.log("Starting getRegisterAccountsPerGender function");

  let male = 0;
  let female = 0;
  let todayMale = 0;
  let todayFemale = 0;

  // 24 hours in milliseconds
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  console.log(`Current timestamp: ${now}`);

  // Scan the Student table to retrieve only students with an "m_masterType" that contains "MASTER"
  const params = {
    TableName: STUDENT_TABLE, // Assumes STUDENT_TABLE is defined in your environment
    FilterExpression: "contains(m_applicantType, :master)",
    ExpressionAttributeValues: {
      ":master": "MASTER",
    },
    ProjectionExpression: "studentCPR, gender, createdAt, m_masterType",
  };

  console.log("Scanning Student table with params:", JSON.stringify(params));

  // Retrieve all matching student records via pagination
  let allStudents = [];
  let lastEvaluatedKey = null;
  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
      console.log(
        "LastEvaluatedKey found. Fetching next page with key:",
        JSON.stringify(lastEvaluatedKey)
      );
    }
    const result = await dynamoDB.scan(params).promise();
    if (result && result.Items && result.Items.length > 0) {
      console.log(`Fetched ${result.Items.length} students`);
      allStudents = allStudents.concat(result.Items);
    } else {
      console.log("No items found in this page.");
    }
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  console.log(`Total students fetched: ${allStudents.length}`);

  // Aggregate gender counts and today's counts based on the student registration time (createdAt)
  console.log("Starting aggregation of gender counts");
  for (const student of allStudents) {
    if (!student.gender) {
      console.log(
        `Skipping student ${JSON.stringify(student)} due to missing gender`
      );
      continue;
    }
    const gender = student.gender.toUpperCase();
    console.log(
      `Processing student with studentCPR: ${student.cpr} and gender: ${gender}`
    );

    console.log(`The student ${student}`);

    if (gender === "MALE") {
      male++;
      if (student.createdAt) {
        const createdTime = new Date(student.createdAt).getTime();
        if (now - createdTime <= TWENTY_FOUR_HOURS) {
          todayMale++;
          console.log(
            `Student ${student.cpr} registered within 24h (MALE count increased)`
          );
        }
      }
    } else if (gender === "FEMALE") {
      female++;
      if (student.createdAt) {
        const createdTime = new Date(student.createdAt).getTime();
        if (now - createdTime <= TWENTY_FOUR_HOURS) {
          todayFemale++;
          console.log(
            `Student ${student.studentCPR} registered within 24h (FEMALE count increased)`
          );
        }
      }
    } else {
      console.log(
        `Student ${student.studentCPR} has unknown gender: ${student.gender}`
      );
    }
  }

  const total = male + female;
  const todayTotal = todayMale + todayFemale;

  console.log(
    `Aggregation complete. Totals: male=${male}, female=${female}, total=${total}`
  );
  console.log(
    `Today's counts: todayMale=${todayMale}, todayFemale=${todayFemale}, todayTotal=${todayTotal}`
  );

  return {
    male,
    female,
    total,
    todayFemale,
    todayTotal,
  };
}

/**
 * Calculates the majors per gender histogram based on the provided applications.
 * For each application, it fetches the corresponding student (using the getStudent function)
 * and determines the student's gender, then groups the counts by the application's "major" field.
 * It aggregates the following counts for each major:
 *   - male, female, and total (male + female)
 *   - todayMale, todayFemale, and todayTotal (if the application was created within the last 24 hours)
 *
 * Expected return format:
 * {
 *   "Technology": {
 *     "male": number,
 *     "female": number,
 *     "total": number,
 *     "todayMale": number,
 *     "todayFemale": number,
 *     "todayTotal": number
 *   },
 *   "Science": { ... },
 *   "Engineering": { ... }
 * }
 */
async function getMajorsGenderHistogram(applications) {
  const histogram = {};
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();

  for (const app of applications) {
    // Retrieve the student record using the studentCPR from the application.
    const student = await getStudent(app.studentCPR);
    if (!student || !student.gender) continue;

    // Determine student gender.
    const gender = student.gender.toUpperCase(); // "MALE" or "FEMALE"

    // Determine the application's major.
    // Assume that the application has a "major" field matching the enum (SCIENCE, TECHNOLOGY, ENGINEERING).
    if (!app.major) continue;
    // Format the major string: e.g., convert "TECHNOLOGY" to "Technology"
    const formattedMajor =
      app.major.charAt(0).toUpperCase() + app.major.slice(1).toLowerCase();

    // Initialize the histogram entry for this major if it doesn't exist.
    if (!histogram[formattedMajor]) {
      histogram[formattedMajor] = {
        male: 0,
        female: 0,
        total: 0,
        todayMale: 0,
        todayFemale: 0,
        todayTotal: 0,
      };
    }

    // Increment general counters based on gender.
    if (gender === "MALE") {
      histogram[formattedMajor].male++;
    } else if (gender === "FEMALE") {
      histogram[formattedMajor].female++;
    }
    histogram[formattedMajor].total++;

    // Determine if this application was created within the last 24 hours.
    // Use app.createdAt if available, otherwise fallback to app.dateTime.
    const createdAt = app.createdAt || app.dateTime;
    if (createdAt) {
      const createdTime = new Date(createdAt).getTime();
      if (now - createdTime <= ONE_DAY_MS) {
        if (gender === "MALE") {
          histogram[formattedMajor].todayMale++;
        } else if (gender === "FEMALE") {
          histogram[formattedMajor].todayFemale++;
        }
        histogram[formattedMajor].todayTotal++;
      }
    }
  }

  return histogram;
}

/**
 * Generates a histogram of income per employment status based on the provided applications.
 * For each application, it fetches the corresponding student using the studentCPR.
 * Then, it checks the student's m_isEmployed flag:
 *   - If true, the student is counted under "Employed".
 *   - If false, under "Unemployed".
 * It then uses the student's m_income field (which can be either "LESS_THAN_1500" or "MORE_THAN_1500")
 * to further group the counts. For each income tier, the function records:
 *   - male, female, and total counts,
 *   - todayMale and todayFemale counts (if the application’s createdAt date is today).
 *
 * The generated histogram will have the following schema:
 *
 * {
 *   "Employed": {
 *     "LESS_THAN_1500": {
 *       "male": number,
 *       "female": number,
 *       "total": number,
 *       "todayMale": number,
 *       "todayFemale": number
 *     },
 *     "MORE_THAN_1500": {
 *       "male": number,
 *       "female": number,
 *       "total": number,
 *       "todayMale": number,
 *       "todayFemale": number
 *     },
 *     "total": number // sum of totals from both income types
 *   },
 *   "Unemployed": {
 *     "LESS_THAN_1500": {
 *       "male": number,
 *       "female": number,
 *       "total": number,
 *       "todayMale": number,
 *       "todayFemale": number
 *     },
 *     "MORE_THAN_1500": {
 *       "male": number,
 *       "female": number,
 *       "total": number,
 *       "todayMale": number,
 *       "todayFemale": number
 *     },
 *     "total": number // sum of totals from both income types
 *   }
 * }
 */
async function getIncomePerEmploymentStatus(applications) {
  const histogram = {
    Employed: {
      LESS_THAN_1500: {
        male: 0,
        female: 0,
        total: 0,
        todayMale: 0,
        todayFemale: 0,
      },
      MORE_THAN_1500: {
        male: 0,
        female: 0,
        total: 0,
        todayMale: 0,
        todayFemale: 0,
      },
      total: 0,
    },
    Unemployed: {
      LESS_THAN_1500: {
        male: 0,
        female: 0,
        total: 0,
        todayMale: 0,
        todayFemale: 0,
      },
      MORE_THAN_1500: {
        male: 0,
        female: 0,
        total: 0,
        todayMale: 0,
        todayFemale: 0,
      },
      total: 0,
    },
  };

  // Iterate through each application to build the histogram.
  for (const app of applications) {
    // Retrieve the student record using the studentCPR from the application.
    const student = await getStudent(app.studentCPR);
    if (!student) continue;

    // Determine employment status.
    // If student.m_isEmployed is true, count under "Employed"; otherwise, "Unemployed".
    const employmentGroup = student.m_isEmployed ? "Employed" : "Unemployed";

    // Determine the income tier.
    // Expecting student.m_income to be either "LESS_THAN_1500" or "MORE_THAN_1500".
    const incomeTier = student.m_income;

    // Normalize gender (expecting student.gender to be provided; default to "male").
    const gender = student.gender ? student.gender.toLowerCase() : "male";

    // Determine if the application was created today.
    let isToday = false;
    if (app.createdAt) {
      isToday =
        new Date(app.createdAt).toDateString() === new Date().toDateString();
    }

    // Update the counts for the specific income tier.
    const groupData = histogram[employmentGroup][incomeTier];
    if (groupData) {
      if (gender === "male") {
        groupData.male++;
        if (isToday) groupData.todayMale++;
      } else if (gender === "female") {
        groupData.female++;
        if (isToday) groupData.todayFemale++;
      }
      groupData.total++;
    }

    // Also update the overall total for the employment group.
    histogram[employmentGroup].total++;
  }

  return histogram;
}
/**
 * Creates a GPA histogram for the provided applications.
 * For each application, it uses the GPA field (expected to be between 3.0 and 4.0)
 * to determine the appropriate bucket. The GPA buckets are:
 *   "3.0-3.2", "3.2-3.4", "3.4-3.6", "3.6-3.8", "3.8-4.0"
 *
 * For each application, it retrieves the related student using the studentCPR via getStudent.
 * Then, based on the student's gender, it increments the bucket's "male" or "female" counter,
 * as well as the overall "total" counter.
 *
 * Additionally, if the application was created today (using the createdAt attribute if available,
 * otherwise the dateTime attribute), it increments the appropriate "todayMale" or "todayFemale" counter.
 *
 * Expected return format:
 * {
 *   "3.0-3.2": {
 *     "male": number,
 *     "female": number,
 *     "total": number,
 *     "todayMale": number,
 *     "todayFemale": number
 *   },
 *   "3.2-3.4": { ... },
 *   "3.4-3.6": { ... },
 *   "3.6-3.8": { ... },
 *   "3.8-4.0": { ... }
 * }
 */
async function getGpaHistogram(applications) {
  // Predefine the GPA buckets.
  const buckets = ["3.0-3.2", "3.2-3.4", "3.4-3.6", "3.6-3.8", "3.8-4.0"];
  const histogram = {};
  for (const bucket of buckets) {
    histogram[bucket] = {
      male: 0,
      female: 0,
      total: 0,
      todayMale: 0,
      todayFemale: 0,
    };
  }

  // Get today's date string for comparison.
  const todayString = new Date().toDateString();

  for (const app of applications) {
    // Ensure GPA exists.
    const gpa = parseFloat(app.gpa);

    // Only process GPA values between 3.0 and 4.0.
    if (gpa < 3.0 || gpa > 4.0) continue;

    // Determine the appropriate bucket index.
    let index = Math.floor((gpa - 3.0) / 0.2);
    if (index >= buckets.length) {
      index = buckets.length - 1; // If gpa === 4.0, assign it to the last bucket.
    }
    const bucketKey = buckets[index];

    // Retrieve the student record using the studentCPR from the application.
    const student = await getStudent(app.studentCPR);
    if (!student || !student.gender) continue;

    const gender = student.gender.toUpperCase(); // Expecting "MALE" or "FEMALE"

    // Increment the bucket counters by gender.
    if (gender === "MALE") {
      histogram[bucketKey].male++;
    } else if (gender === "FEMALE") {
      histogram[bucketKey].female++;
    }
    histogram[bucketKey].total++;

    // Determine if the application was created today using app.createdAt or app.dateTime.
    const createdAt = app.createdAt || app.dateTime;
    if (createdAt) {
      const appDateString = new Date(createdAt).toDateString();
      if (appDateString === todayString) {
        if (gender === "MALE") {
          histogram[bucketKey].todayMale++;
        } else if (gender === "FEMALE") {
          histogram[bucketKey].todayFemale++;
        }
      }
    }
  }

  return histogram;
}

async function getGPADistribution(applications) {
  const distribution = {};
  applications.forEach((app) => {
    const gpa = app.gpa || 0;
    let bucket = Math.floor(gpa / 5) * 5;
    if (bucket === 100) bucket = 95;
    const key = `${bucket}-${bucket + 5}`;
    distribution[key] = (distribution[key] || 0) + 1;
  });

  console.log(`GPA histogram: ${JSON.stringify(distribution)}`);
  // Return the object directly.
  return distribution;
}

async function getStudent(studentCPR) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: studentCPR,
    },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

/**
 * Retrieves the top universities sorted by the number of applications.
 * This function uses the result from getUniversityDistribution (which returns an object where
 * each key is a university name and the value is the count of applications) and then sorts
 * the entries in descending order by count.
 *
 * Expected output structure:
 * {
 *   "University of Bahrain": 20,
 *   "University of Arianaib": 10,
 *   //
 * }
 */
/**
 * Retrieves the top 5 universities sorted by the number of applications.
 * This function uses the result from getUniversityDistribution (which returns an object where
 * each key is a university name and the value is the count of applications) and then sorts
 * the entries in descending order by count. Only the top 5 results are returned.
 *
 * Expected output structure:
 * {
 *   "University of Bahrain": 20,
 *   "University of Arianaib": 10,
 *   // ... up to 5 entries
 * }
 */
async function getTopUniversities(applications) {
  // Get the distribution of applications per university.
  const distribution = await getUniversityDistribution(applications);

  // Convert the distribution object to an array of [universityName, count] pairs,
  // then sort the array in descending order based on the count.
  const sortedEntries = Object.entries(distribution).sort(
    (a, b) => b[1] - a[1]
  );

  // Slice the first 5 entries.
  const topFiveEntries = sortedEntries.slice(0, 5);

  // Convert the sorted entries back into an object.
  const sortedResult = {};
  for (const [universityName, count] of topFiveEntries) {
    sortedResult[universityName] = count;
  }

  return sortedResult;
}
