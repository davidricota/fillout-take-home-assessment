"use client";

import { FormSkeleton } from "./form-skeleton";
import { Plus, Info, FileText, Check, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FormPageContentProps {
  pageTitle: string;
  pageId: string;
  pageIcon: "info" | "document" | "check";
}

const pageConfigs = {
  info: {
    description: "Collect basic information from users",
    fields: ["Full Name", "Email Address", "Phone Number"],
    color: "orange",
    icon: Info,
  },
  document: {
    description: "Gather detailed information and documents",
    fields: ["Upload Document", "Additional Details", "Comments"],
    color: "blue",
    icon: FileText,
  },
  check: {
    description: "Final confirmation and review",
    fields: ["Terms & Conditions", "Final Review", "Submit"],
    color: "green",
    icon: Check,
  },
};

export function FormPageContent({
  pageTitle,
  pageId,
  pageIcon,
}: FormPageContentProps) {
  const config = pageConfigs[pageIcon] || pageConfigs.document;
  const IconComponent = config.icon;

  return (
    <div className="container flex min-h-full max-w-2xl flex-col justify-center py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div className={`rounded-lg p-2 bg-${config.color}-100`}>
            <IconComponent className={`h-5 w-5 text-${config.color}-600`} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        </div>
        <p className="text-gray-600">{config.description}</p>
      </div>

      {/* Form Builder Area */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Form Fields</h3>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <FormSkeleton />
        </CardContent>
      </Card>

      {/* Quick Add Fields */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {config.fields.map((fieldName, index) => (
          <Card
            key={index}
            className="cursor-pointer border-2 border-dashed border-gray-200 p-3 transition-colors hover:border-gray-300"
          >
            <div className="text-center text-gray-500">
              <Plus className="mx-auto mb-1 h-5 w-5" />
              <p className="text-xs">{fieldName}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Field Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="bg-white text-gray-700 hover:bg-gray-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Field
        </Button>
      </div>
    </div>
  );
}
