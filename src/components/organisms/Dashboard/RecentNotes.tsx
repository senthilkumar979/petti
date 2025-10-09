"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { stripHtml } from "../../../modules/Notes/noteUtils";
import { RecentNotesProps } from "./types";

export default function RecentNotes({ recentNotes }: RecentNotesProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-yellow-600" />
          Recent Notes
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/notes")}
        >
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {recentNotes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent notes</p>
        ) : (
          recentNotes.map((note) => (
            <div
              key={note.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {note.heading}
                </p>
                <p className="text-sm text-gray-600 break-words">
                  {stripHtml(note.content?.slice(0, 200) ?? "")}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-gray-500">
                  {formatDate(note.lastUpdatedDate)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
