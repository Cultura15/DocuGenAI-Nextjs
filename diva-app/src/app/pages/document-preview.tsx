"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2 } from "lucide-react"

interface DocumentPreviewProps {
  content: string
}

export default function DocumentPreview({ content }: DocumentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "markdown">("preview")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }


  const renderMarkdown = (markdown: string) => {
    if (!markdown) return <div className="text-gray-400 italic">No content generated yet</div>

    const lines = markdown.split("\n")
    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          if (line.startsWith("# ")) {
            return (
              <h1 key={index} className="text-2xl font-bold text-[#727D73]">
                {line.substring(2)}
              </h1>
            )
          } else if (line.startsWith("## ")) {
            return (
              <h2 key={index} className="text-xl font-semibold text-[#727D73] mt-6">
                {line.substring(3)}
              </h2>
            )
          } else if (line.startsWith("```")) {
            return (
              <pre key={index} className="bg-[#F0F0D7] p-4 rounded-lg text-[#727D73] font-mono text-sm mt-2 mb-2">
                {line.substring(3)}
              </pre>
            )
          } else if (line.trim() === "") {
            return <div key={index} className="h-2"></div>
          } else {
            return (
              <p key={index} className="text-[#727D73]/80">
                {line}
              </p>
            )
          }
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {content ? (
        <>
          <div className="flex justify-between items-center">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "preview" | "markdown")}
              className="w-full max-w-xs"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-[#AAB99A] data-[state=active]:text-white"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="markdown"
                  className="data-[state=active]:bg-[#AAB99A] data-[state=active]:text-white"
                >
                  Markdown
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
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
                  Copy
                </>
              )}
            </Button>
          </div>

          <TabsContent value="preview" className="mt-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[400px]">
              {renderMarkdown(content)}
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="mt-0">
            <div className="bg-[#F0F0D7]/50 border border-gray-200 rounded-lg p-6 min-h-[400px] font-mono text-sm whitespace-pre-wrap text-[#727D73]">
              {content || "No content generated yet"}
            </div>
          </TabsContent>
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-400 italic">No content generated yet. Fill the form and click "Generate Document".</p>
        </div>
      )}
    </div>
  )
}
