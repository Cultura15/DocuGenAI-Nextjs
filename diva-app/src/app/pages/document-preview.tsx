"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FileDown, Eye, Edit, Loader2, Copy, CheckCircle2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface DocumentPreviewProps {
  markdown: string
  formData: any
  documentType: "dev-setup" | "user-guide"
  onBackToForm: () => void
}

export default function DocumentPreview({ markdown, formData, documentType, onBackToForm }: DocumentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "markdown">("preview")
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleDownloadDocx = async () => {
    if (!markdown || !formData) {
      toast({
        title: "No Content",
        description: "Please generate content first before downloading.",
        variant: "destructive",
      })
      return
    }

    setDownloading(true)
    try {
      const response = await fetch("/api/convert-to-docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markdown,
          formData,
          documentType,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.appName.replace(/[^a-zA-Z0-9]/g, "_")}_${documentType}_${new Date().toISOString().split("T")[0]}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Document Downloaded!",
        description: "Your professional Word document has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error downloading document:", error)
      toast({
        title: "Download Failed",
        description: "There was an error downloading your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose prose-lg max-w-none"
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-[#1F4E79] mb-6 border-b-2 border-[#1F4E79] pb-2">{children}</h1>
          ),
          h2: ({ children }) => <h2 className="text-2xl font-bold text-[#1F4E79] mb-4 mt-8">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold text-[#2F5496] mb-3 mt-6">{children}</h3>,
          p: ({ children }) => <p className="text-gray-800 leading-relaxed mb-4 text-justify">{children}</p>,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-300">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#4472C4] text-white">{children}</thead>,
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="border border-gray-300 px-4 py-3">{children}</td>,
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return <code className="bg-gray-100 text-[#0066CC] px-2 py-1 rounded text-sm font-mono">{children}</code>
            }
            return (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                <code className="font-mono text-sm">{children}</code>
              </pre>
            )
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#AAB99A] pl-4 italic text-gray-700 mb-4">{children}</blockquote>
          ),
          ul: ({ children }) => <ul className="list-none space-y-2 mb-4 ml-4">{children}</ul>,
          li: ({ children }) => {
            const content = String(children)
            if (content.includes("➢")) {
              return (
                <li className="flex items-start gap-2">
                  <span className="text-[#1F4E79] font-bold">➢</span>
                  <span>{children}</span>
                </li>
              )
            }
            return (
              <li className="flex items-start gap-2">
                <span className="text-[#1F4E79]">•</span>
                <span>{children}</span>
              </li>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#727D73]">Document Preview</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onBackToForm}
                className="text-[#727D73] border-[#727D73] hover:bg-[#727D73]/10"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="text-[#727D73] border-[#727D73] hover:bg-[#727D73]/10"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Markdown
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownloadDocx}
                disabled={downloading || !markdown}
                className="bg-[#AAB99A] hover:bg-[#AAB99A]/90 text-white"
              >
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    Download as Word
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {markdown ? (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "markdown")}>
              <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-[#AAB99A] data-[state=active]:text-white"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="markdown"
                  className="data-[state=active]:bg-[#AAB99A] data-[state=active]:text-white"
                >
                  Markdown
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-0">
                <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-[600px] max-h-[800px] overflow-y-auto">
                  {renderMarkdown(markdown)}
                </div>
              </TabsContent>

              <TabsContent value="markdown" className="mt-0">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[600px] max-h-[800px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{markdown}</pre>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 italic mb-4">No content generated yet.</p>
                <p className="text-sm text-gray-500">
                  Fill out the form and click "Generate Preview" to see your document.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
