"use client";

import { useState } from "react";
import {
  MdWarning as AlertTriangle,
  MdMail as Mail,
  MdPhone as Phone,
  MdPerson as User,
  MdSecurity as Shield,
  MdAccessTime as Clock,
} from "react-icons/md";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Student } from "../../src/API";
import { getStudentName } from "../../src/Helpers";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/use-auth";
import { useRouter } from "next/router";

type Props = {
  student: Student;
};

export default function ChangeStudentCpr({ student }: Props) {
  const { t } = useTranslation("applications");
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { locale } = useRouter();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isCprChangeOpen, setIsCprChangeOpen] = useState(false);
  const [newCpr, setNewCpr] = useState("");
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWarningConfirm = () => {
    setIsWarningOpen(false);
    setIsCprChangeOpen(true);
    setConfirmationChecked(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      newCprNumber,
      oldCprNumber,
      locale,
    }: {
      newCprNumber: string;
      oldCprNumber: string;
      locale: string;
    }) =>
      fetch(`${process.env.NEXT_PUBLIC_LAMBDA_POST_CHANGE_CPR}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          newCprNumber,
          oldCprNumber,
          locale,
        }),
      }),
    onSuccess: async (res) => {
      if (res.ok) {
        const result = await res.json();
        toast.success(result.message || t("cprChangedSuccessfully"));
        setIsCprChangeOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.message || t("failedToChangeCpr"));
      }
    },
    onError: (error) => {
      toast.error(error.message || t("failedToChangeCpr"));
    },
    onMutate: () => {
      setIsProcessing(true);
    },
    onSettled: () => {
      setNewCpr("");
      setIsProcessing(false);
      setConfirmationChecked(false);
    },
  });

  const handleCprSubmit = async () => {
    if (!newCpr || !confirmationChecked) return;

    mutate({
      newCprNumber: newCpr,
      oldCprNumber: student.cpr,
      locale: locale || "en",
    });
  };

  const isValidCpr = (cpr: string) => {
    // Basic CPR validation
    const cprRegex = /^\d{9}$/;
    return cprRegex.test(cpr);
  };

  return (
    <div className="">
      <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Shield className="h-4 w-4" />
            {t("changeApplicantCPR")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("criticalWarning")}
            </DialogTitle>
            <DialogDescription className="text-base">
              {t("criticalWarningDescription")}
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive fill-destructive" />
            <AlertDescription className="text-destructive font-medium">
              <strong>{t("thisActionCannotBeUndone")}</strong>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">
                {t("consequencesOfChangingCpr")}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>{t("consequencesOfChangingCpr1")}</li>
                <li>{t("consequencesOfChangingCpr2")}</li>
                <li>{t("consequencesOfChangingCpr3")}</li>
                <li>{t("consequencesOfChangingCpr4")}</li>
                <li>{t("consequencesOfChangingCpr5")}</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsWarningOpen(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleWarningConfirm}>
              {t("iUnderstandProceed")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCprChangeOpen} onOpenChange={setIsCprChangeOpen}>
        <DialogContent className="sm:max-w-lg  ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("changeApplicantCPR")}
            </DialogTitle>
            <DialogDescription>
              {t("changeApplicantCprDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Student Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">
                {t("currentApplicantInformation")}
              </h4>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t("name")}:</span>
                  <span className="text-sm">{getStudentName(student)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t("currentCpr")}:
                  </span>
                  <span dir="ltr" className="text-sm font-mono">
                    {student.cpr || t("notProvided")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t("emailAddress")}:
                  </span>
                  <span dir="ltr" className="text-sm">
                    {student.email || t("notProvided")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t("phoneNumber")}:
                  </span>
                  <span dir="ltr" className="text-sm">
                    {student.phone || t("notProvided")}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* New CPR Input */}
            <div className="space-y-2">
              <Label htmlFor="newCpr">{t("newCpr")}</Label>
              <Input
                id="newCpr"
                placeholder="123456789"
                value={newCpr}
                onChange={(e) => setNewCpr(e.target.value)}
                className={
                  !isValidCpr(newCpr) && newCpr ? "border-destructive" : ""
                }
              />
              {newCpr && !isValidCpr(newCpr) && (
                <p className="text-sm text-destructive">
                  {t("pleaseEnterAValidCprFormat")}
                </p>
              )}
            </div>

            {/* Process Information */}
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>{t("changingCprNextSteps")}</strong>
                <ol className="mt-2 space-y-1 text-sm">
                  <li>{t("changingCprNextSteps1")}</li>
                  <li>{t("changingCprNextSteps2")}</li>
                  <li>{t("changingCprNextSteps3")}</li>
                </ol>
              </AlertDescription>
            </Alert>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="confirm"
                checked={confirmationChecked}
                onCheckedChange={(checked) =>
                  setConfirmationChecked(checked as boolean)
                }
              />
              <Label htmlFor="confirm" className="text-sm leading-5">
                {t("IconfirmCprChange")}
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCprChangeOpen(false)}
              disabled={isProcessing}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCprSubmit}
              disabled={
                !newCpr ||
                !isValidCpr(newCpr) ||
                !confirmationChecked ||
                isProcessing ||
                isPending
              }
            >
              {isProcessing || isPending
                ? t("processing")
                : t("changeApplicantCPR")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
