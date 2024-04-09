import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  Half2Icon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
  PlusCircledIcon,
  MinusCircledIcon,
} from "@radix-ui/react-icons";
import { SchoolType, Status } from "../../../../src/API";

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
