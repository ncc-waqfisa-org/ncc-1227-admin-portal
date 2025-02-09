export type MasterSignUpData = {
  // Should be set in the backend
  // batch: number | null; //current year
  // preferredLanguage: "ENGLISH";

  // Personal data
  cpr: string;
  cpr_doc: string;

  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  address: string;
  email: string | null;
  phone: string | null;
  gender: string | undefined;
  place_of_birth?: string | null;
  nationality: string | undefined;
  number_of_family_member: number;

  // Graduated from
  graduation_year: string;
  universityID: string | undefined;
  old_program: string;

  // Employment info
  isEmployed: boolean;
  place_of_employment: string | null;

  // Personal income or guardian income based on employment
  income: Income | undefined;
  income_doc: string;

  // Guardian data
  guardian_cpr: string;
  guardian_full_name: string;
  guardian_cpr_doc: string;

  guardian_email?: string;
  guardian_address?: string;

  // Should be added from backend
  // applicant_type: ApplicantType[];
  password: string;
};

export type MasterSignUpFormSchema = {
  // Should be set in the backend
  // batch: number | null; //current year
  // preferredLanguage: "ENGLISH";

  // Personal data
  cpr: string;
  cpr_doc?: File;

  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  address: string;
  email: string | null;
  phone: string | null;
  gender: string | undefined;
  place_of_birth?: string | null;
  nationality: string | undefined;
  number_of_family_member: number;

  // Graduated from
  graduation_year: string;
  universityID: string | undefined;
  old_program: string;

  // Employment info
  isEmployed: boolean;
  place_of_employment: string | null;

  // Personal income or guardian income based on employment
  income: Income | undefined;
  income_doc?: File;

  // Guardian data
  guardian_cpr: string;
  guardian_full_name: string;
  guardian_cpr_doc?: File;

  guardian_email?: string;
  guardian_address?: string;

  password: string;
  confirm_password: string;

  // Terms
  accepted: boolean;
};

export type MasterUpdateData = {
  // Personal data

  cpr_doc?: string;

  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  address: string;
  dob: string;

  phone: string;
  gender: string;
  place_of_birth: string;
  nationality: string;
  number_of_family_member: number;

  // Graduated from
  graduation_year: string;
  universityID: string;
  old_program: string;

  // Employment info
  isEmployed: boolean;
  place_of_employment: string | null;

  // Personal income or guardian income based on employment
  income: Income;
  income_doc?: string;

  // Guardian data
  guardian_cpr: string;
  // guardian_full_name: string;
  guardianFirstName: string;
  guardianSecondName: string;
  guardianThirdName: string;
  guardianLastName: string;
  guardian_cpr_doc?: string;
  guardian_email?: string;
  guardian_address?: string;
};

export type MasterUpdateFormSchema = {
  // Personal data

  cpr_doc?: File;

  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  address: string;
  dob: string;

  phone: string;
  gender: string;
  place_of_birth: string;
  nationality: string;
  number_of_family_member: number;

  // Graduated from
  graduation_year: string;
  universityID: string;
  old_program: string;

  // Employment info
  isEmployed: boolean;
  place_of_employment: string | null;

  // Personal income or guardian income based on employment
  income: Income;
  income_doc?: File;

  // Guardian data
  guardian_cpr: string;
  // guardian_full_name: string;
  guardianFirstName: string;
  guardianSecondName: string;
  guardianThirdName: string;
  guardianLastName: string;
  guardianEmail: string;
  guardianAddress: string;
  guardian_cpr_doc?: File;
};

export type MasterEnrollData = {
  // Personal data

  // prefill with student fullName splitted
  first_name: string;
  second_name: string;
  last_name: string;

  // Graduated from

  graduation_year: string;

  universityID: string | undefined;

  old_program: string;

  // Employment info

  isEmployed: boolean;

  place_of_employment: string | null;

  // Personal income or guardian income based on employment

  income: Income | undefined;

  income_doc: string;

  // Guardian data

  guardian_cpr: string;

  guardian_full_name: string;

  guardian_cpr_doc: string;

  guardian_email?: string;
  guardian_address?: string;
};
export type MasterEnrollFormSchema = {
  // Personal data

  // prefill with student fullName splitted
  first_name: string;
  second_name: string;
  last_name: string;

  // Graduated from

  graduation_year: string;

  universityID: string | undefined;

  old_program: string;

  // Employment info

  isEmployed: boolean;

  place_of_employment: string | null;

  // Personal income or guardian income based on employment

  income: Income | undefined;

  income_doc?: File;

  // Guardian data

  guardian_cpr: string;

  guardian_full_name: string;

  guardian_cpr_doc?: File;

  guardian_email?: string;
  guardian_address?: string;

  // Terms
  accepted: boolean;
};

export enum ApplicantType {
  BACHELOR = "BACHELOR",
  MASTERS = "MASTERS",
}

export enum Income {
  LESS_THAN_1500 = "LESS_THAN_1500",
  MORE_THAN_1500 = "MORE_THAN_1500",
}

//   // Applying to
//   master_universityID: string;
//   master_program: string;
//   master_major: string;
