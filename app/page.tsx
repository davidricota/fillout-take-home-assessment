"use client";

import { FormBuilderNavbar } from "@/components/form-builder-navbar";
import { FormPageContent } from "@/components/form-page-content";
import { useFormBuilderContext } from "@/contexts/form-builder-context";

export default function Home() {
  const { pages, activePageId } = useFormBuilderContext();

  const activePage = pages.find((page) => page.id === activePageId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Main Content Area */}
      <FormPageContent
        pageTitle={activePage?.name || "Form Page"}
        pageId={activePageId}
        pageIcon={activePage?.icon || "document"}
      />

      {/* Bottom Navigation */}
      <div className="w-full border-t border-gray-200 bg-white fixed bottom-0">
        <div className="container mx-auto">
          <FormBuilderNavbar />
        </div>
      </div>
    </div>
  );
}
