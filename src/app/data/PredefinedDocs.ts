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
    type: "work-permit",
    name: "Work Permit",
    description: "Employment authorization",
  },
  {
    type: "visa",
    name: "Visa",
    description: "Entry permission for foreign countries",
  },
  {
    type: "insurance-card",
    name: "Insurance Card",
    description: "Health insurance coverage",
  },
  {
    type: "medical-certificate",
    name: "Medical Certificate",
    description: "Health status document",
  },
  {
    type: "tax-document",
    name: "Tax Document",
    description: "Tax-related paperwork",
  },
  {
    type: "bank-statement",
    name: "Bank Statement",
    description: "Financial account summary",
  },
  {
    type: "contract",
    name: "Contract",
    description: "Legal agreement document",
  },
  { type: "invoice", name: "Invoice", description: "Payment request document" },
  { type: "receipt", name: "Receipt", description: "Payment confirmation" },
];
