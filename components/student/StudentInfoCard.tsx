"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  MdEmail as Mail,
  MdPhone as Phone,
  MdCreditCard as CreditCard,
  MdPublic as Globe,
  MdCheckCircle as CheckCircle,
  MdCancel as XCircle,
} from "react-icons/md";
import ChangeStudentCpr from "./ChangeStudentCpr";
import { ApplicantType, Student } from "../../src/API";
import { getStudentName } from "../../src/Helpers";
import { useTranslation } from "react-i18next";
import { ApplicationsIcon } from "../icons";
import { useAuth } from "../../hooks/use-auth";

interface StudentInfoCardProps {
  student: Student;
  bachelorApplicationStatus: "Yes" | "No";
  masterApplicationStatus: "Yes" | "No";
}

export default function StudentInfoCard({
  student,
  bachelorApplicationStatus,
  masterApplicationStatus,
}: StudentInfoCardProps) {
  const { t } = useTranslation("applications");
  const { isSuperAdmin } = useAuth();

  const isMaster =
    student.m_applicantType?.includes(ApplicantType.MASTER) ?? false;
  const isBachelor =
    student.m_applicantType?.includes(ApplicantType.STUDENT) ?? false;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">
              {getStudentName(student)}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {t("applicantInformationAccountManagement")}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={
                bachelorApplicationStatus === "Yes" ? "default" : "secondary"
              }
            >
              {bachelorApplicationStatus === "Yes" ? (
                <CheckCircle className="w-4 h-4 me-1" />
              ) : (
                <XCircle className="w-4 h-4 me-1" />
              )}
              {t("bachelorApplication")}:{" "}
              {t(bachelorApplicationStatus.toLowerCase())}
            </Badge>

            <Badge
              variant={
                masterApplicationStatus === "Yes" ? "default" : "secondary"
              }
            >
              {masterApplicationStatus === "Yes" ? (
                <CheckCircle className="w-4 h-4 me-1" />
              ) : (
                <XCircle className="w-4 h-4 me-1" />
              )}
              {t("masterApplication")}:{" "}
              {t(masterApplicationStatus.toLowerCase())}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t("personalInformation")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("applicantCPR")}
              </Label>
              <div className="flex items-center gap-2">
                <span dir="ltr" className="font-mono text-lg">
                  {student.cpr}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {t("emailAddress")}
              </Label>
              <span dir="ltr" className="text-sm break-all">
                {student.email}
              </span>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {t("phoneNumber")}
              </Label>
              <span dir="ltr" className="text-sm">
                {student.phone}
              </span>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {t("nationality")}
              </Label>
              <span className="text-sm">
                {t(student.nationalityCategory ?? "-")}
              </span>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <ApplicationsIcon className="w-4 h-4" />
                {t("applicantType")}
              </Label>
              <span className="text-sm">
                {[isBachelor && t("bachelor"), isMaster && t("masters")]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Account Actions Section */}
        {isSuperAdmin && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("accountActions")}
              </h3>

              <div className="flex flex-col sm:flex-row gap-3">
                <ChangeStudentCpr student={student} />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
