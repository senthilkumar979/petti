"use client";

import { Button } from "@/components/atoms/Button";
import { DocumentIcon } from "@/components/atoms/DocumentIcon";
import { Document } from "@/types/database";
import { CheckCircle, Edit, Grid, Table, Trash2, Upload } from "lucide-react";
import { PREDEFINED_DOCUMENT_TYPES } from "../../app/data/PredefinedDocs";

interface PreDefinedDocumentsListProps {
  documents: Document[];
  viewStyle: "grid" | "table";
  onViewStyleChange: (style: "grid" | "table") => void;
  onPreDefinedUpload: (docType: string) => void;
  onEditDocument: (document: Document) => void;
  onDeleteDocument: (document: Document) => void;
}

export const PreDefinedDocumentsList: React.FC<
  PreDefinedDocumentsListProps
> = ({
  documents,
  viewStyle,
  onViewStyleChange,
  onPreDefinedUpload,
  onEditDocument,
  onDeleteDocument,
}) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Pre-defined Documents
      </h2>
      <p className="text-gray-600 mb-6">
        Common document types that you can upload and manage
      </p>

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => onViewStyleChange("grid")}
          className={viewStyle === "grid" ? "bg-gray-200" : ""}
          leftIcon={<Grid className="h-4 w-4" />}
        >
          Grid
        </Button>
        <Button
          variant="outline"
          onClick={() => onViewStyleChange("table")}
          className={viewStyle === "table" ? "bg-gray-200" : ""}
          leftIcon={<Table className="h-4 w-4" />}
        >
          Table
        </Button>
      </div>

      {viewStyle === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {PREDEFINED_DOCUMENT_TYPES.map((docType) => {
            const existingDoc = documents.find(
              (doc) =>
                doc.isPreDefined &&
                doc.name.toLowerCase() === docType.name.toLowerCase()
            );

            return (
              <div
                key={docType.type}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer flex justify-between items-center"
                onClick={() => onPreDefinedUpload(docType.name)}
              >
                <div className="flex space-x-3 mb-3 justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <DocumentIcon
                      type={docType.type}
                      size="md"
                      className=" text-blue-600"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {docType.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {docType.description}
                      </p>
                    </div>
                  </div>
                  {existingDoc ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">
                        <CheckCircle className="h-4 w-4 mr-1" /> Uploaded
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditDocument(existingDoc);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDocument(existingDoc);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Upload className="h-4 w-4" />}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {PREDEFINED_DOCUMENT_TYPES.map((docType) => {
                const existingDoc = documents.find(
                  (doc) =>
                    doc.isPreDefined &&
                    doc.name.toLowerCase() === docType.name.toLowerCase()
                );

                return (
                  <tr
                    key={docType.type}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onPreDefinedUpload(docType.name)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DocumentIcon
                          type={docType.type}
                          size="sm"
                          className="text-blue-600 mr-3"
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {docType.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {docType.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {existingDoc ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" /> Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          <span className="inline-flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Not Uploaded
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {existingDoc ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditDocument(existingDoc);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDocument(existingDoc);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Upload className="h-4 w-4" />}
                        >
                          Upload
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PreDefinedDocumentsList;
