/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const s3 = new AWS.S3();
const pdfKit = require("pdfkit");

const {
  MasterApplicationTable: MASTER_APPLICATION_TABLE,
  StudentTable: STUDENT_TABLE,
  MasterAppliedUniversitiesTable: MASTER_UNIVERSITY_TABLE,
  BahrainUniversitiesTable: BAHRAIN_UNIVERSITY_TABLE,
  AdminTable: ADMIN_TABLE,
  S3Bucket: S3_BUCKET,
} = {
  MasterApplicationTable:
    "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterAppliedUniversitiesTable:
    "MasterAppliedUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  BahrainUniversitiesTable:
    "BahrainUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  S3Bucket: "ncc1227bucket65406-staging",
};

const arabicLocal = {
  BAHRAINI: "بحريني",
  NON_BAHRAINI: "غير بحريني",
  LESS_THAN_1500: "أقل من ألف وخمسمائة دينار بحريني",
  MORE_THAN_1500: "أكثر من ألف وخمسمائة دينار بحريني",
  REJECTED: "مرفوض",
  APPROVED: "مقبول",
  NOT_COMPLETED: "غير مكتمل",
  ELIGIBLE: "مؤهل",
  AWAITING_VERIFICATION: "في انتظار التحقق",
  SCIENCE: "علوم",
  TECHNOLOGY: "تكنولوجيا",
  ENGINEERING: "هندسة",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const isAdmin = await checkIsAdmin(event.headers?.authorization?.slice(7));
  if (!isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden. You are not an admin" }),
    };
  }

  const applicationId = event.queryStringParameters?.applicationId;
  const lang = event.queryStringParameters?.lang || "en";

  if (!applicationId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing applicationId" }),
    };
  }

  try {
    const masterApplication = await getMasterApplication(applicationId);
    if (!masterApplication) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Application not found" }),
      };
    }

    const student = await getStudent(masterApplication.studentCPR);
    const university = masterApplication.universityID
      ? await getMasterUniversity(masterApplication.universityID)
      : null;
    const graduatedUniversity = student.m_universityID
      ? await getBahrainUniversity(student.m_universityID)
      : null;

    let pdfBuffer;
    if (lang === "ar") {
      pdfBuffer = await generateArabicPdf(
        masterApplication,
        university,
        graduatedUniversity,
        student
      );
    } else {
      pdfBuffer = await generatePdf(
        masterApplication,
        university,
        graduatedUniversity,
        student
      );
    }

    const pdfUrl = await uploadToS3(pdfBuffer);
    return {
      statusCode: 200,
      body: JSON.stringify({ url: pdfUrl }),
    };
  } catch (error) {
    console.error("Error exporting application", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error exporting application" }),
    };
  }
};
async function generatePdf(
  masterApplication,
  university,
  graduatedUniversity,
  student
) {
  const logoUrl =
    "https://amplify-ncc-staging-65406-deployment.s3.amazonaws.com/waqfisa_logo.png";
  const imageBuffer = await fetchImage(logoUrl);
  const labelFontSize = 12;
  const valueFontSize = 10;

  const doc = new pdfKit();
  doc.lineGap(2);
  const pdfBuffer = [];
  doc.on("data", (chunk) => pdfBuffer.push(chunk));

  const pdfPromise = new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(pdfBuffer)));
    doc.on("error", reject);
  });

  // Add logo and header
  doc.image(imageBuffer, 240, 20, { width: 120 });
  doc.moveTo(25, 80).lineTo(600, 80).stroke();
  doc
    .font("./fonts/Almarai.ttf")
    .fontSize(8)
    .text(new Date().toLocaleDateString(), 20, 85);

  // Certificate text
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(valueFontSize)
    .text(
      "This is to certify that the following student has applied for the Waqf Isa scholarship master program. The application details are as follows:"
    );

  // Application Status and Batch
  doc.text("Status: ", { continued: true });
  doc.text(masterApplication.status);
  doc.text("Batch: ", { continued: true });
  doc.text(masterApplication.batch.toString());
  doc.text(" ");

  // Student Details
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(labelFontSize)
    .text("Student Details:");

  // Basic Information
  doc
    .font("./fonts/Almarai.ttf")
    .fontSize(valueFontSize)
    .text("Name: ", { continued: true });
  doc.text(
    `${student.m_lastName} ${student.m_thirdName} ${student.m_secondName} ${student.m_firstName}`
  );

  doc.text("CPR: ", { continued: true });
  doc.text(student.cpr);
  doc.text("Nationality: ", { continued: true });
  doc.text(masterApplication.nationalityCategory);
  doc.text("GPA: ", { continued: true });
  doc.text(masterApplication.gpa);
  doc.text("Verified GPA: ", { continued: true });
  doc.text(
    masterApplication.verifiedGPA
      ? masterApplication.verifiedGPA
      : "Awaiting verification"
  );

  // Contact Information
  doc.text("Email: ", { continued: true });
  doc.text(student.email);
  doc.text("Phone: ", { continued: true });
  doc.text(student.phone);
  doc.text("Address: ", { continued: true });
  doc.text(student.address, { features: ["rtla"] });

  // Education Details
  doc.text("Graduated University: ", { continued: true });
  doc.text(graduatedUniversity?.universityNameAr || "-", {
    features: ["rtla"],
  });
  doc.text("Graduation Year: ", { continued: true });
  doc.text(student.m_graduationYear?.toString() || "-");

  // Employment Details
  doc.text("Employment Status: ", { continued: true });
  doc.text(student.m_isEmployed ? "Employed" : "Not Employed");
  if (student.m_isEmployed) {
    doc.text("Place of Employment: ", { continued: true });
    doc.text(student.m_placeOfEmployment || "-");
    doc.text("Income: ", { continued: true });
    doc.text(masterApplication.income);
  }

  // TOEFL/IELTS Score
  doc.text("TOEFL/IELTS Score: ", { continued: true });
  doc.text(
    masterApplication.toeflIELTSScore
      ? masterApplication.toeflIELTSScore.toString()
      : "-"
  );
  doc.text("Score Verified: ", { continued: true });
  doc.text(masterApplication.isToeflIELTSScoreVerified ? "Yes" : "No");

  // Major
  doc.text("Major: ", { continued: true });
  doc.text(masterApplication.major || "-");

  doc.text(" ");

  // Guardian Details
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(labelFontSize)
    .text("Guardian Details:");
  doc.font("./fonts/Almarai.ttf").fontSize(valueFontSize);

  doc.text("Name: ", { continued: true });
  doc.text(
    `${student.m_guardianLastName} ${student.m_guardianThirdName} ${student.m_guardianSecondName} ${student.m_guardianFirstName}`
  );
  doc.text("CPR: ", { continued: true });
  doc.text(student.m_guardianCPR || "-");
  doc.text("Address: ", { continued: true });
  doc.text(student.m_guardianAddress || "-");
  doc.text("Email: ", { continued: true });
  doc.text(student.m_guardianEmail || "-");

  // Add income field here if student is not employed
  if (!student.m_isEmployed) {
    doc.text("Income: ", { continued: true });
    doc.text(masterApplication.income);
  }

  // Desired Program and University
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(labelFontSize)
    .text("Desired Program and University:");
  doc.font("./fonts/Almarai.ttf").fontSize(valueFontSize);
  doc.text("Program: ", { continued: true });
  doc.text(masterApplication.program || "-");
  doc.text("University: ", { continued: true });
  doc.text(university?.universityName || "-");

  // Application ID
  doc.text(" ");
  doc.text("Application ID: ", { continued: true });
  doc.text(masterApplication.id);

  // Footer with signature and comments section
  doc.text(" ");
  doc.text(" ");
  doc.lineJoin("round").moveTo(20, 590).rect(20, 590, 580, 115).stroke();
  doc.moveTo(400, 590).lineTo(400, 705).stroke();
  doc.text("Comments", 30, 600);
  doc.text("Signatures", 420, 600);
  doc.moveTo(415, 650).lineTo(585, 650).stroke();
  doc.moveTo(415, 690).lineTo(585, 690).stroke();

  // Copyright footer
  doc
    .font("./fonts/Almarai.ttf")
    .fontSize(8)
    .text(
      "This document is generated by Waqf Isa system. All rights reserved " +
        new Date().getFullYear(),
      20,
      710
    );

  doc.end();
  return await pdfPromise;
}

async function generateArabicPdf(
  masterApplication,
  university,
  graduatedUniversity,
  student
) {
  const logoUrl =
    "https://amplify-ncc-staging-65406-deployment.s3.amazonaws.com/waqfisa_logo.png";
  const imageBuffer = await fetchImage(logoUrl);
  const labelFontSize = 12;
  const valueFontSize = 11;

  const doc = new pdfKit();
  doc.lineGap(4);
  const pdfBuffer = [];
  doc.on("data", (chunk) => pdfBuffer.push(chunk));

  const pdfPromise = new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(pdfBuffer)));
    doc.on("error", reject);
  });

  // Add logo and header
  doc.image(imageBuffer, 240, 20, { width: 120 });
  doc.moveTo(20, 80).lineTo(600, 80).stroke();
  doc
    .font("./fonts/Almarai.ttf")
    .fontSize(10)
    .text(new Date().toLocaleDateString(), 20, 95, { features: ["rtla"] });
  doc.text(" ");

  // Certificate text
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(valueFontSize)
    .text(
      "نشهد بأن الطالب التالي قد تقدم لبرنامج بعث وقف عيسى للدراسات العليا. تفاصيل الطلب كالتالي:",
      { features: ["rtla"], align: "right" }
    );

  // Application Status and Batch
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("الحالة: ", { align: "right", features: ["rtla"], underline: true })
    .font("./fonts/Almarai.ttf")
    .text(arabicLocal[masterApplication.status], { align: "right" });
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("الدفعة: ", { align: "right", features: ["rtla"], underline: true })
    .font("./fonts/Almarai.ttf")
    .text(masterApplication.batch.toString(), { align: "right" });
  doc.text(" ");

  // Student Details Section
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(labelFontSize)
    .text("تفاصيل الطالب:", { features: ["rtla"], align: "right" });

  // Basic Information
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(valueFontSize)
    .text("الاسم:", { align: "right", features: ["rtla"], underline: true })
    .font("./fonts/Almarai.ttf")
    .text(
      `${student.m_firstName} ${student.m_secondName} ${student.m_thirdName} ${student.m_lastName}`,
      { align: "right", features: ["rtla"] }
    );

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("رقم البطاقة الذكية: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(student.cpr, { align: "right" });

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("الجنسية: ", { align: "right", features: ["rtla"], underline: true })
    .font("./fonts/Almarai.ttf")
    .text(arabicLocal[masterApplication.nationalityCategory], {
      align: "right",
    });

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("المعدل التراكمي: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(masterApplication.gpa, { align: "right" });

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("المعدل المتحقق منه: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(
      masterApplication.verifiedGPA
        ? masterApplication.verifiedGPA
        : "في انتظار التحقق",
      { align: "right" }
    );

  // Education Details
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("الجامعة المتخرج منها: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(graduatedUniversity?.universityNameAr || "-", {
      align: "right",
      features: ["rtla"],
    });

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("سنة التخرج: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(student.m_graduationYear?.toString() || "-", { align: "right" });

  // Employment Details
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("حالة التوظيف: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(student.m_isEmployed ? "موظف" : "غير موظف", { align: "right" });

  if (student.m_isEmployed) {
    doc
      .font("./fonts/Almarai-Bold.ttf")
      .text("مكان العمل: ", {
        align: "right",
        features: ["rtla"],
        underline: true,
      })
      .font("./fonts/Almarai.ttf")
      .text(student.m_placeOfEmployment || "-", { align: "right" });

    doc
      .font("./fonts/Almarai-Bold.ttf")
      .text("الدخل: ", { align: "right", features: ["rtla"], underline: true })
      .font("./fonts/Almarai.ttf")
      .text(arabicLocal[masterApplication.income], { align: "right" });
  }

  // Contact Information
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("البريد الإلكتروني: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(student.email, { align: "right" });

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("رقم الهاتف: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(student.phone, { align: "right" });

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("العنوان: ", { align: "right", features: ["rtla"], underline: true })
    .font("./fonts/Almarai.ttf")
    .text(student.address, { align: "right", features: ["rtla"] });

  // Test Scores
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("درجة التوفل/الآيلتس: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(masterApplication.toeflIELTSScore?.toString() || "-", {
      align: "right",
    });

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("تم التحقق من الدرجة: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(masterApplication.isToeflIELTSScoreVerified ? "نعم" : "لا", {
      align: "right",
    });

  doc.text(" ");

  // Guardian Details Section
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(labelFontSize)
    .text("تفاصيل ولي الأمر:", { features: ["rtla"], align: "right" });

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(valueFontSize)
    .text("الاسم: ", { align: "right", features: ["rtla"], underline: true })
    .font("./fonts/Almarai.ttf")
    .text(
      `${student.m_guardianFirstName} ${student.m_guardianSecondName} ${student.m_guardianThirdName} ${student.m_guardianLastName}`,
      { align: "right", features: ["rtla"] }
    );

  doc
    .font("./fonts/Almarai-Bold.ttf")
    .text("رقم البطاقة الذكية: ", {
      align: "right",
      features: ["rtla"],
      underline: true,
    })
    .font("./fonts/Almarai.ttf")
    .text(student.m_guardianCPR || "-", { align: "right" });

  // Add income field if student is not employed
  if (!student.m_isEmployed) {
    doc
      .font("./fonts/Almarai-Bold.ttf")
      .text("الدخل: ", { align: "right", features: ["rtla"], underline: true })
      .font("./fonts/Almarai.ttf")
      .text(arabicLocal[masterApplication.income], { align: "right" });
  }

  doc.text(" ");

  // Desired Program and University Section
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(labelFontSize)
    .text("البرنامج والجامعة المطلوبة:", {
      features: ["rtla"],
      align: "right",
    });

  if (university) {
    doc
      .font("./fonts/Almarai.ttf")
      .fontSize(valueFontSize)
      .text(
        `${masterApplication.program || "-"} - ${university.universityNameAr}`,
        {
          align: "right",
          features: ["rtla"],
        }
      );
  } else {
    doc
      .font("./fonts/Almarai.ttf")
      .fontSize(valueFontSize)
      .text("غير متوفر", { align: "right", features: ["rtla"] });
  }

  doc.text(" ");
  doc
    .font("./fonts/Almarai-Bold.ttf")
    .fontSize(valueFontSize)
    .text("الرقم: ", { align: "right", features: ["rtla"], underline: true })
    .font("./fonts/Almarai.ttf")
    .text(masterApplication.id, { align: "right" });

  doc.text(" ");
  doc.text(" ");

  // Footer with signature and comments section
  doc.lineJoin("round").moveTo(20, 590).rect(20, 590, 580, 115).stroke();
  doc.moveTo(400, 590).lineTo(400, 705).stroke();
  doc.text("التعليقات", 330, 600);
  doc.text("التواقيع", 480, 600);
  doc.moveTo(415, 630).lineTo(585, 630).stroke();
  doc.moveTo(415, 670).lineTo(585, 670).stroke();

  // Copyright footer
  doc
    .font("./fonts/Almarai.ttf")
    .fontSize(8)
    .text(
      "هذا المستند تم إنشاؤه بواسطة نظام وقف عيسى. جميع الحقوق محفوظة " +
        new Date().getFullYear(),
      20,
      710,
      { features: ["rtla"], align: "right" }
    );

  doc.end();
  return await pdfPromise;
}

// Helper functions
async function getMasterApplication(applicationId) {
  const params = {
    TableName: MASTER_APPLICATION_TABLE,
    Key: { id: applicationId },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function getStudent(cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: { cpr },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function getMasterUniversity(universityId) {
  const params = {
    TableName: MASTER_UNIVERSITY_TABLE,
    Key: { id: universityId },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function getBahrainUniversity(universityId) {
  const params = {
    TableName: BAHRAIN_UNIVERSITY_TABLE,
    Key: { id: universityId },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function uploadToS3(pdfBuffer) {
  const params = {
    Bucket: S3_BUCKET,
    Key: `applications/master-application-${Date.now()}.pdf`,
    Body: pdfBuffer,
    ContentType: "application/pdf",
  };
  await s3.upload(params).promise();
  return s3.getSignedUrl("getObject", {
    Bucket: params.Bucket,
    Key: params.Key,
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
    console.error("Error checking if user is admin", error);
    return false;
  }
}

async function fetchImage(url) {
  const response = await fetch(url);
  return response.arrayBuffer();
}
