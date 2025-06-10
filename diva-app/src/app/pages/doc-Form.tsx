"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  Zap,
  Brain,
  Send,
  Users,
  AlertCircle,
  Globe,
  Terminal,
  Lightbulb,
  BookOpen,
  Code,
  Loader2,
} from "lucide-react"

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
  icon: React.ReactNode
  showFor: Array<"dev-setup" | "user-guide">
}

interface DocFormProps {
  onGenerate: (output: string) => void
  documentType: "dev-setup" | "user-guide"
}

const fieldConfig: Record<keyof FormData, FieldConfigEntry> = {
  appName: {
    label: "App Name",
    placeholder: "Enter your application name",
    required: true,
    icon: <Sparkles className="h-4 w-4" />,
    showFor: ["dev-setup", "user-guide"],
  },
  description: {
    label: "Description",
    placeholder: "Brief description of your application",
    icon: <BookOpen className="h-4 w-4" />,
    showFor: ["dev-setup", "user-guide"],
  },
  targetUsers: {
    label: "Target Users",
    placeholder: "Who will use this application?",
    icon: <Users className="h-4 w-4" />,
    showFor: ["dev-setup", "user-guide"],
  },
  features: {
    label: "Key Features",
    placeholder: "List your main features",
    icon: <Zap className="h-4 w-4" />,
    showFor: ["dev-setup", "user-guide"],
  },
  techStack: {
    label: "Tech Stack",
    placeholder: "React, Next.js, TypeScript...",
    icon: <Code className="h-4 w-4" />,
    showFor: ["dev-setup"],
  },
  setupSteps: {
    label: "Setup Steps",
    placeholder: "Installation and setup instructions",
    icon: <Terminal className="h-4 w-4" />,
    showFor: ["dev-setup"],
  },
  usageExamples: {
    label: "Usage Examples",
    placeholder: "How to use your application",
    icon: <Lightbulb className="h-4 w-4" />,
    showFor: ["dev-setup", "user-guide"],
  },
  knownLimitations: {
    label: "Known Limitations",
    placeholder: "Current limitations or known issues",
    icon: <AlertCircle className="h-4 w-4" />,
    showFor: ["dev-setup", "user-guide"],
  },
  deployment: {
    label: "Deployment",
    placeholder: "How to deploy this application",
    icon: <Globe className="h-4 w-4" />,
    showFor: ["dev-setup"],
  },
  devNotes: {
    label: "Developer Notes",
    placeholder: "Additional notes for developers",
    icon: <Brain className="h-4 w-4" />,
    showFor: ["dev-setup"],
  },
}

export default function DocForm({ onGenerate, documentType }: DocFormProps) {
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
  const [loading, setLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["appName", "description"])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

const handleSubmit = async () => {
  if (!formData.appName.trim()) return;

  setLoading(true);
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("API Error");
    }

    const data = await response.json();

    if (data.output) {
      onGenerate(data.output);
    } else {
      throw new Error("No output received");
    }
  } catch (error) {
    console.error("Error generating documentation:", error);
    onGenerate("❌ Failed to generate documentation. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const generateOutput = (data: FormData, type: "dev-setup" | "user-guide"): string => {
    if (type === "dev-setup") {
      return `# ${data.appName} Developer Setup Guide

## Overview
${data.description || "No description provided."}

## Target Users
${data.targetUsers || "No target users specified."}

## Key Features
${data.features || "No features specified."}

## Tech Stack
${data.techStack || "No tech stack specified."}

## Setup Instructions
\`\`\`bash
${data.setupSteps || "# No setup steps provided"}
\`\`\`

## Usage Examples
${data.usageExamples || "No usage examples provided."}

## Known Limitations
${data.knownLimitations || "No known limitations specified."}

## Deployment
${data.deployment || "No deployment information provided."}

## Developer Notes
${data.devNotes || "No developer notes provided."}
`
    } else {
      return `# ${data.appName} User Guide

## Overview
${data.description || "No description provided."}

## Who is this for?
${data.targetUsers || "No target users specified."}

## Key Features
${data.features || "No features specified."}

## Getting Started
Follow these steps to get started with ${data.appName}:
1. Create an account
2. Set up your profile
3. Explore the dashboard

## Usage Examples
${data.usageExamples || "No usage examples provided."}

## Troubleshooting
${data.knownLimitations || "No troubleshooting information provided."}
`
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const relevantFields = Object.entries(fieldConfig).filter(([_, config]) => config.showFor.includes(documentType))

  const filledFields = relevantFields.filter(([key]) => formData[key as keyof FormData].trim() !== "").length

  const progress = Math.round((filledFields / relevantFields.length) * 100)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm text-[#727D73]">Completion Progress</Label>
          <span className="text-xs text-[#727D73]">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-100"/>
      </div>

      <Accordion type="multiple" value={expandedSections} className="space-y-4">
        {Object.entries(fieldConfig).map(([key, config]) => {
          if (!config.showFor.includes(documentType)) return null

          const fieldKey = key as keyof FormData
          return (
            <AccordionItem key={key} value={key} className="border border-gray-200 rounded-lg overflow-hidden">
              <AccordionTrigger
                className="px-4 py-3 hover:bg-gray-50 data-[state=open]:bg-gray-50"
                onClick={() => toggleSection(key)}
              >
                <div className="flex items-center gap-2 text-[#727D73]">
                  {config.icon}
                  <span>{config.label}</span>
                  {config.required && <span className="text-red-500">*</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                {key === "description" ||
                key === "features" ||
                key === "setupSteps" ||
                key === "usageExamples" ||
                key === "knownLimitations" ||
                key === "devNotes" ? (
                  <Textarea
                    name={key}
                    value={formData[fieldKey]}
                    onChange={handleChange}
                    placeholder={config.placeholder}
                    className="min-h-[100px] border-gray-200 focus:border-[#AAB99A] focus:ring-[#AAB99A]"
                  />
                ) : (
                  <Input
                    name={key}
                    value={formData[fieldKey]}
                    onChange={handleChange}
                    placeholder={config.placeholder}
                    className="border-gray-200 focus:border-[#AAB99A] focus:ring-[#AAB99A]"
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading || !formData.appName.trim()}
          className="bg-[#AAB99A] hover:bg-[#AAB99A]/90 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Generate Document
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
