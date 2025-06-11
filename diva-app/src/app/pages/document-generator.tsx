"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Code, BookOpen } from "lucide-react"
import DocForm from "./doc-Form"
import DocumentPreview from "./document-preview"
import Questionnaire, { type QuestionnaireAnswers } from "./questionnaire"

type DocumentType = "dev-setup" | "user-guide"

export default function DocumentGenerator() {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null)
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers | null>(null)
  const [generatedMarkdown, setGeneratedMarkdown] = useState("")
  const [formData, setFormData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form")

  const handleDocumentTypeSelect = (type: DocumentType) => {
    setDocumentType(type)
    setQuestionnaireAnswers(null)
    setGeneratedMarkdown("")
    setFormData(null)
    setActiveTab("form")
  }

  const handleQuestionnaireComplete = (answers: QuestionnaireAnswers) => {
    setQuestionnaireAnswers(answers)
  }

  const handleMarkdownGenerated = (markdown: string, data: any) => {
    setGeneratedMarkdown(markdown)
    setFormData(data)
    setActiveTab("preview")
  }

  const resetToStart = () => {
    setDocumentType(null)
    setQuestionnaireAnswers(null)
    setGeneratedMarkdown("")
    setFormData(null)
    setActiveTab("form")
  }

  return (
    <div className="space-y-8">
      {!documentType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card
            className="border-2 border-transparent hover:border-[#AAB99A] transition-all cursor-pointer bg-white hover:shadow-lg"
            onClick={() => handleDocumentTypeSelect("dev-setup")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#727D73]">
                <Code className="h-5 w-5" />
                Dev Setup Guide
              </CardTitle>
              <CardDescription>Create comprehensive setup instructions for developers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#727D73]/80">
                Generate detailed technical documentation including installation steps, environment setup, and
                development workflows with customizable sections.
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-transparent hover:border-[#AAB99A] transition-all cursor-pointer bg-white hover:shadow-lg"
            onClick={() => handleDocumentTypeSelect("user-guide")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#727D73]">
                <BookOpen className="h-5 w-5" />
                User Guide
              </CardTitle>
              <CardDescription>Create user-friendly documentation for end users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#727D73]/80">
                Generate clear instructions for users including features overview, getting started steps, and common
                workflows.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : !questionnaireAnswers ? (
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#727D73]">
              {documentType === "dev-setup" ? "Developer Setup Guide" : "User Guide"}
            </h2>
            <Button
              variant="outline"
              onClick={resetToStart}
              className="text-[#727D73] border-[#727D73] hover:bg-[#727D73]/10"
            >
              Change Document Type
            </Button>
          </div>

          <Questionnaire documentType={documentType} onComplete={handleQuestionnaireComplete} />
        </div>
      ) : (
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#727D73]">
              {documentType === "dev-setup" ? "Developer Setup Guide" : "User Guide"}
            </h2>
            <Button
              variant="outline"
              onClick={resetToStart}
              className="text-[#727D73] border-[#727D73] hover:bg-[#727D73]/10"
            >
              Start Over
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "form" | "preview")} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger value="form" className="data-[state=active]:bg-[#AAB99A] data-[state=active]:text-white">
                Form
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-[#AAB99A] data-[state=active]:text-white">
                Preview & Download
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="mt-0">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#727D73]">
                    {documentType === "dev-setup" ? "Developer Setup Guide Form" : "User Guide Form"}
                  </CardTitle>
                  <CardDescription>Fill in the details to generate your document</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocForm
                    documentType={documentType}
                    questionnaireAnswers={questionnaireAnswers}
                    onMarkdownGenerated={handleMarkdownGenerated}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <DocumentPreview
                markdown={generatedMarkdown}
                formData={formData}
                documentType={documentType}
                onBackToForm={() => setActiveTab("form")}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
