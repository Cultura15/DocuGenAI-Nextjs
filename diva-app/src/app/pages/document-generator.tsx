"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileDown, Eye, Code, BookOpen } from "lucide-react"
import DocForm from "./doc-Form"
import DocumentPreview from "./document-preview"

type DocumentType = "dev-setup" | "user-guide"

export default function DocumentGenerator() {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null)
  const [output, setOutput] = useState("")
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form")

  const handleDocumentGenerated = (content: string) => {
    setOutput(content)
    setActiveTab("preview")
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentType === "dev-setup" ? "Developer-Setup-Guide" : "User-Guide"}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {!documentType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="border-2 border-transparent hover:border-[#AAB99A] transition-all cursor-pointer bg-white"
            onClick={() => setDocumentType("dev-setup")}
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
                Generate detailed technical documentation including installation steps, environment setup, architecture
                overview, and development workflows.
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-transparent hover:border-[#AAB99A] transition-all cursor-pointer bg-white"
            onClick={() => setDocumentType("user-guide")}
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
                Generate clear instructions for users including features overview, getting started steps, common
                workflows, and troubleshooting tips.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#727D73]">
              {documentType === "dev-setup" ? "Developer Setup Guide" : "User Guide"}
            </h2>
            <Button
              variant="outline"
              onClick={() => setDocumentType(null)}
              className="text-[#727D73] border-[#727D73] hover:bg-[#727D73]/10"
            >
              Change Document Type
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "form" | "preview")} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger value="form" className="data-[state=active]:bg-[#AAB99A] data-[state=active]:text-white">
                Form
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-[#AAB99A] data-[state=active]:text-white">
                Preview
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
                  <DocForm onGenerate={handleDocumentGenerated} documentType={documentType} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#727D73]">Document Preview</CardTitle>
                  <CardDescription>Preview your generated document</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentPreview content={output} />
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("form")}
                    className="text-[#727D73] border-[#727D73] hover:bg-[#727D73]/10"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-[#AAB99A] hover:bg-[#AAB99A]/90 text-white"
                    disabled={!output}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download as .docx
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
