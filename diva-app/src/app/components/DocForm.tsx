"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Send, Copy, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface FormData {
  appName: string
  description: string
  targetUsers: string
  features: string
  techStack: string
  setupSteps: string
  usageExamples: string
  knownLimitations: string
  deployment: string
  devNotes: string
}

interface FieldConfigEntry {
  label: string
  placeholder: string
  required?: boolean 
}

const fieldConfig: Record<keyof FormData, FieldConfigEntry> = {
  appName: { label: "App Name", placeholder: "Enter your application name", required: true },
  description: { label: "Description", placeholder: "Brief description of your application" },
  targetUsers: { label: "Target Users", placeholder: "Who will use this application?" },
  features: { label: "Key Features", placeholder: "List your main features" },
  techStack: { label: "Tech Stack", placeholder: "React, Next.js, TypeScript..." },
  setupSteps: { label: "Setup Steps", placeholder: "Installation and setup instructions" },
  usageExamples: { label: "Usage Examples", placeholder: "How to use your application" },
  knownLimitations: { label: "Known Limitations", placeholder: "Current limitations or known issues" },
  deployment: { label: "Deployment", placeholder: "How to deploy this application" },
  devNotes: { label: "Developer Notes", placeholder: "Additional notes for developers" },
}

export default function DocGenerator() {
  const [formData, setFormData] = useState<FormData>({
    appName: "",
    description: "",
    targetUsers: "",
    features: "",
    techStack: "",
    setupSteps: "",
    usageExamples: "",
    knownLimitations: "",
    deployment: "",
    devNotes: "",
  })

  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["appName", "description"])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.appName.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setOutput(data.output)
    } catch (error) {
      console.error("Error generating documentation:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const filledFields = Object.values(formData).filter((value) => value.trim() !== "").length
  const progress = Math.round((filledFields / Object.keys(formData).length) * 100)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Diva</h1>
              <p className="text-xs text-zinc-400">Documentation AI Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Input Panel */}
        <div className="w-full md:w-1/2 border-r border-zinc-800 overflow-y-auto">
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Project Information</h2>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400">{progress}%</span>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(fieldConfig).map(([key, config]) => {
                const isExpanded = expandedSections.includes(key)
                return (
                  <div key={key} className="border border-zinc-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(key)}
                      className="w-full flex items-center justify-between p-3 text-left bg-zinc-900 hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{config.label}</span>
                        {config.required && <span className="text-rose-500 text-xs">*</span>}
                        {formData[key as keyof FormData].trim() !== "" && (
                          <span className="text-xs px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded">Filled</span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-3 bg-black border-t border-zinc-800">
                        {key === "appName" ? (
                          <Input
                            name={key}
                            value={formData[key as keyof FormData]}
                            onChange={handleChange}
                            placeholder={config.placeholder}
                            className="bg-zinc-900 border-zinc-700 text-white"
                          />
                        ) : (
                          <Textarea
                            name={key}
                            value={formData[key as keyof FormData]}
                            onChange={handleChange}
                            placeholder={config.placeholder}
                            rows={3}
                            className="bg-zinc-900 border-zinc-700 text-white resize-none"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.appName.trim()}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating Documentation...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Generate Documentation</span>
                    <Send className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h2 className="text-lg font-medium text-white">Generated Documentation</h2>
            {output && (
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="text-zinc-300 border-zinc-700 hover:bg-zinc-800"
              >
                {copied ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Copied</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </div>
                )}
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-zinc-950">
            {output ? (
              <div className="bg-black rounded-lg border border-zinc-800 p-4">
                <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="text-zinc-300 font-medium mb-2">No documentation yet</h3>
                <p className="text-sm text-zinc-500 max-w-md">
                  Fill out the form with your project details and click generate to create comprehensive documentation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
