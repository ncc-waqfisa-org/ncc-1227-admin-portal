export function createStudentInfoChangeSnapshot(
  oldData: any,
  newData: any
): string {
  const changes = [];

  if (newData.cprDoc !== oldData.cprDocFile) {
    changes.push(
      `CPR Document from "${oldData.cprDocFile}" to "${newData.cprDoc}"`
    );
  }
  if (newData.fullName !== oldData.fullName) {
    changes.push(
      `Full Name from "${oldData.fullName}" to "${newData.fullName}"`
    );
  }
  if (newData.phone !== oldData.phone) {
    changes.push(`Phone from "${oldData.phone}" to "${newData.phone}"`);
  }
  if (newData.gender !== oldData.gender) {
    changes.push(`Gender from "${oldData.gender}" to "${newData.gender}"`);
  }
  if (newData.schoolName !== oldData.schoolName) {
    changes.push(
      `School Name from "${oldData.schoolName}" to "${newData.schoolName}"`
    );
  }
  if (newData.schoolType !== oldData.schoolType) {
    changes.push(
      `School Type from "${oldData.schoolType}" to "${newData.schoolType}"`
    );
  }
  if (newData.specialization !== oldData.specialization) {
    changes.push(
      `Specialization from "${oldData.specialization}" to "${newData.specialization}"`
    );
  }
  if (newData.placeOfBirth !== oldData.placeOfBirth) {
    changes.push(
      `Place of Birth from "${oldData.placeOfBirth}" to "${newData.placeOfBirth}"`
    );
  }
  if (newData.familyIncome !== oldData.familyIncome) {
    changes.push(
      `Family Income from "${oldData.familyIncome}" to "${newData.familyIncome}"`
    );
  }
  if (
    JSON.stringify(newData.familyIncomeProofDocs) !==
    JSON.stringify(oldData.familyIncomeProofDocs)
  ) {
    changes.push(
      `Family Income Proof Docs from "${oldData.familyIncomeProofDocs}" to "${newData.familyIncomeProofDocs}"`
    );
  }
  if (newData.nationality !== oldData.nationality) {
    changes.push(
      `Nationality from "${oldData.nationality}" to "${newData.nationality}"`
    );
  }
  if (newData.nationalityCategory !== oldData.nationalityCategory) {
    changes.push(
      `Nationality Category from "${oldData.nationalityCategory}" to "${newData.nationalityCategory}"`
    );
  }
  if (newData.studentOrderAmongSiblings !== oldData.studentOrderAmongSiblings) {
    changes.push(
      `Student Order Among Siblings from "${oldData.studentOrderAmongSiblings}" to "${newData.studentOrderAmongSiblings}"`
    );
  }
  if (newData.preferredLanguage !== oldData.preferredLanguage) {
    changes.push(
      `Preferred Language from "${oldData.preferredLanguage}" to "${newData.preferredLanguage}"`
    );
  }
  if (newData.graduationDate !== oldData.graduationDate) {
    changes.push(
      `Graduation Date from "${oldData.graduationDate}" to "${newData.graduationDate}"`
    );
  }
  if (newData.address !== oldData.address) {
    changes.push(`Address from "${oldData.address}" to "${newData.address}"`);
  }

  return changes.join(", ");
}
