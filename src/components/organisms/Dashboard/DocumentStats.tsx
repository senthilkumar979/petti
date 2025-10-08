"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { PieChart } from "lucide-react";
import { useRouter } from "next/navigation";

interface DocumentStat {
  category: string;
  count: number;
}

interface DocumentStatsProps {
  documentStats: DocumentStat[];
}

export default function DocumentStats({ documentStats }: DocumentStatsProps) {
  const router = useRouter();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
          Documents by Category
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/documents")}
        >
          View All
        </Button>
      </div>

      <div className="">
        {documentStats.length === 0 ? (
          <p className="text-gray-500 text-center py-4 col-span-full">
            No documents yet
          </p>
        ) : (
          documentStats.map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {stat.category}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {stat.count}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (stat.count /
                        Math.max(...documentStats.map((s) => s.count))) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
