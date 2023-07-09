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
    icon: CheckCircledIcon,
  },
  {
    value: Status.ELIGIBLE,
    label: "Eligible",
    icon: PlusCircledIcon,
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
    icon: MinusCircledIcon,
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
    icon: CircleIcon,
  },
  {
    value: SchoolType.PRIVATE,
    label: "Private",
    icon: Half2Icon,
  },
];
