import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  Half2Icon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
  PlusCircledIcon,
  MinusCircledIcon,
  ExclamationTriangleIcon
} from "@radix-ui/react-icons";
import { ScholarshipStatus, SchoolType, Status } from "../../../../src/API";

export const statuses = [
  {
    value: Status.APPROVED,
    label: "Approved",
    arLabel: "تمت الموافقة",
    icon: CheckCircledIcon,
  },
  {
    value: Status.ELIGIBLE,
    label: "Eligible",
    arLabel: "مؤهل",
    icon: PlusCircledIcon,
  },
  {
    value: Status.REVIEW,
    label: "Review",
    arLabel: "مراجعة",
    icon: StopwatchIcon,
  },
  {
    value: Status.NOT_COMPLETED,
    label: "Not Completed",
    arLabel: "غير مكتمل",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: Status.NOT_COMPLETED_MARKED_BY_ADMIN,
    label: "Not Completed - Marked by Admin",
    arLabel: "لم يتم وضع علامة مكتملة بواسطة المشرف",
    icon: ExclamationTriangleIcon,
  },
  {
    value: Status.WITHDRAWN,
    label: "Withdrawn",
    arLabel: "تم الانسحاب",
    icon: MinusCircledIcon,
  },

  {
    value: Status.REJECTED,
    label: "Rejected",
    arLabel: "مرفوض",
    icon: CrossCircledIcon,
  },
];
export const scholarshipStatuses = [
  {
    value: ScholarshipStatus.APPROVED,
    label: "Approved",
    arLabel: "تمت الموافقة",
    icon: CheckCircledIcon,
  },
  {
    value: ScholarshipStatus.PENDING,
    label: "Pending",
    arLabel: "قيد الانتظار",
    icon: StopwatchIcon,
  },
  {
    value: ScholarshipStatus.WITHDRAWN,
    label: "Withdrawn",
    arLabel: "تم الانسحاب",
    icon: MinusCircledIcon,
  },

  {
    value: ScholarshipStatus.REJECTED,
    label: "Rejected",
    arLabel: "مرفوض",
    icon: CrossCircledIcon,
  },
];
export const schoolTypes = [
  {
    value: SchoolType.PUBLIC,
    label: "Public",
    arLabel: "حكومية",
    icon: CircleIcon,
  },
  {
    value: SchoolType.PRIVATE,
    label: "Private",
    arLabel: "خاصة",
    icon: Half2Icon,
  },
];
