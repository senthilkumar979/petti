import { DocumentType } from "@/components/atoms/DocumentIcon";

export const PREDEFINED_DOCUMENT_TYPES: Array<{
  type: DocumentType;
  name: string;
  description: string;
}> = [
  {
    type: "passport",
    name: "Passport",
    description: "International travel document",
  },
  {
    type: "national-id",
    name: "National ID",
    description: "Government issued identification",
  },
  {
    type: "driving-license",
    name: "Driving License",
    description: "Vehicle operation permit",
  },
  {
    type: "voter-id",
    name: "Voter ID",
    description: "Voter identification",
  },
  {
    type: "birth-certificate",
    name: "Birth Certificate",
    description: "Official birth record",
  },
  {
    type: "degree-certificate",
    name: "Degree Certificate",
    description: "Educational qualification",
  },
  {
    type: "insurance-card",
    name: "Insurance Card",
    description: "Health insurance coverage",
  },
];
