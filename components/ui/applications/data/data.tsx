import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { SchoolType, Status } from "../../../../src/API";

export const statuses = [
  {
    value: Status.APPROVED,
    label: "Approved",
    icon: CheckCircledIcon,
  },
  {
    value: Status.ELIGIBLE,
    label: "Eligible",
    icon: CircleIcon,
  },
  {
    value: Status.REVIEW,
    label: "Review",
    icon: StopwatchIcon,
  },
  {
    value: Status.NOT_COMPLETED,
    label: "Not Completed",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: Status.WITHDRAWN,
    label: "Withdrawn",
    icon: CrossCircledIcon,
  },

  {
    value: Status.REJECTED,
    label: "Rejected",
    icon: CrossCircledIcon,
  },
];
export const schoolTypes = [
  {
    value: SchoolType.PUBLIC,
    label: "Public",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: SchoolType.PRIVATE,
    label: "Private",
    icon: CircleIcon,
  },
];
