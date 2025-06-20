"use client"

import { FormSkeleton } from "./form-skeleton"
import { Plus, Info, FileText, Check, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FormPageContentProps {
  pageTitle: string
  pageId: string
  pageIcon: "info" | "document" | "check"
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
}

export function FormPageContent({ pageTitle, pageId, pageIcon }: FormPageContentProps) {
  const config = pageConfigs[pageIcon] || pageConfigs.document
  const IconComponent = config.icon

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg bg-${config.color}-100`}>
              <IconComponent className={`w-5 h-5 text-${config.color}-600`} />
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
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <FormSkeleton />
          </CardContent>
        </Card>

        {/* Quick Add Fields */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {config.fields.map((fieldName, index) => (
            <Card
              key={index}
              className="p-3 border-dashed border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            >
              <div className="text-center text-gray-500">
                <Plus className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs">{fieldName}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Field Button */}
        <div className="flex justify-center">
          <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Field
          </Button>
        </div>
      </div>
    </div>
  )
}
