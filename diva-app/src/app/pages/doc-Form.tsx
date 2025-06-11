"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Sparkles,
  Building,
  Upload,
  Code,
  Globe,
  Smartphone,
  Database,
  Settings,
  Github,
  Container,
  Brain,
  TestTube,
  Monitor,
  Send,
  Loader2,
  X,
  ImageIcon,
  AlertTriangle,
} from "lucide-react"
import type { QuestionnaireAnswers } from "./questionnaire"

interface FormData {
  // Basic Information
  appName: string
  description: string
  companyName: string
  logo: File | null

  // Tools & Technologies
  backendTech: string
  frontendWebTech: string
  frontendMobileTech: string
  database: string
  buildTool: string
  versionControl: string
  containerizationTool: string
  aiIntegration: string
  testingTool: string
  ide: string

  // Step by Step Instructions
  githubInstructions: string
  databaseInstructions: string
  externalApiInstructions: string
  backendInstructions: string
  frontendWebInstructions: string
  frontendMobileInstructions: string
  apiTestingInstructions: string

  // Team Information (simplified)
  developers: string
  projectManager: string
}

interface FieldConfigEntry {
  label: string
  placeholder: string
  required?: boolean
  icon: React.ReactNode
  category: "basic" | "tools" | "instructions"
  conditional?: keyof QuestionnaireAnswers
}

interface DocFormProps {
  documentType: "dev-setup" | "user-guide"
  questionnaireAnswers: QuestionnaireAnswers
  onMarkdownGenerated: (markdown: string, formData: FormData) => void
}

const fieldConfig: Record<keyof FormData, FieldConfigEntry> = {
  // Basic Information
  appName: {
    label: "Application Name",
    placeholder: "Enter your application name (e.g., TaskManager, CollaborAid)",
    required: true,
    icon: <Sparkles className="h-4 w-4" />,
    category: "basic",
  },
  description: {
    label: "Project Description",
    placeholder: "Brief description of your application's purpose and main functionality",
    required: true,
    icon: <Code className="h-4 w-4" />,
    category: "basic",
  },
  companyName: {
    label: "Institution/Company Name",
    placeholder: "Cebu Institute of Technology University, Google Inc., etc. (Optional)",
    icon: <Building className="h-4 w-4" />,
    category: "basic",
  },
  logo: {
    label: "Upload Logo",
    placeholder: "Upload your institution/company logo (Max 1MB, Optional)",
    icon: <Upload className="h-4 w-4" />,
    category: "basic",
  },

  // Tools & Technologies
  backendTech: {
    label: "Backend Technology",
    placeholder: "Node.js, Java Spring Boot, Python Django, etc.",
    required: true,
    icon: <Code className="h-4 w-4" />,
    category: "tools",
  },
  frontendWebTech: {
    label: "Frontend (Web) Technology",
    placeholder: "React, Vue.js, Angular, HTML/CSS/JS, etc.",
    required: true,
    icon: <Globe className="h-4 w-4" />,
    category: "tools",
  },
  frontendMobileTech: {
    label: "Frontend (Mobile) Technology",
    placeholder: "React Native, Flutter, Kotlin, Swift, etc.",
    icon: <Smartphone className="h-4 w-4" />,
    category: "tools",
    conditional: "includeMobileFrontend",
  },
  database: {
    label: "Database",
    placeholder: "MySQL, PostgreSQL, MongoDB, Firebase, etc.",
    required: true,
    icon: <Database className="h-4 w-4" />,
    category: "tools",
  },
  buildTool: {
    label: "Build Tool",
    placeholder: "Maven, Gradle, npm, Webpack, Vite, etc.",
    required: true,
    icon: <Settings className="h-4 w-4" />,
    category: "tools",
  },
  versionControl: {
    label: "Version Control",
    placeholder: "Git, GitHub, GitLab, Bitbucket, etc.",
    required: true,
    icon: <Github className="h-4 w-4" />,
    category: "tools",
  },
  containerizationTool: {
    label: "Containerization Tool",
    placeholder: "Docker, Kubernetes, Podman, etc.",
    icon: <Container className="h-4 w-4" />,
    category: "tools",
    conditional: "isContainerized",
  },
  aiIntegration: {
    label: "AI Integration",
    placeholder: "OpenAI API, Google AI, AWS AI services, etc.",
    icon: <Brain className="h-4 w-4" />,
    category: "tools",
    conditional: "consumesExternalApis",
  },
  testingTool: {
    label: "Testing Tool",
    placeholder: "Postman, Insomnia, Thunder Client, etc.",
    icon: <TestTube className="h-4 w-4" />,
    category: "tools",
    conditional: "includeApiTesting",
  },
  ide: {
    label: "IDE Used",
    placeholder: "VS Code, IntelliJ IDEA, Eclipse, etc.",
    required: true,
    icon: <Monitor className="h-4 w-4" />,
    category: "tools",
  },

  // Step by Step Instructions
  githubInstructions: {
    label: "GitHub Repository Instructions",
    placeholder: "How to clone, setup, and work with the repository",
    required: true,
    icon: <Github className="h-4 w-4" />,
    category: "instructions",
  },
  databaseInstructions: {
    label: "Database Configuration Instructions",
    placeholder: "How to setup and configure the database",
    required: true,
    icon: <Database className="h-4 w-4" />,
    category: "instructions",
  },
  externalApiInstructions: {
    label: "External APIs Instructions",
    placeholder: "How to configure and integrate external APIs",
    icon: <Brain className="h-4 w-4" />,
    category: "instructions",
    conditional: "consumesExternalApis",
  },
  backendInstructions: {
    label: "Running the Backend Instructions",
    placeholder: "Step-by-step instructions to run the backend",
    required: true,
    icon: <Code className="h-4 w-4" />,
    category: "instructions",
  },
  frontendWebInstructions: {
    label: "Running the Frontend (Web) Instructions",
    placeholder: "Step-by-step instructions to run the web frontend",
    required: true,
    icon: <Globe className="h-4 w-4" />,
    category: "instructions",
  },
  frontendMobileInstructions: {
    label: "Running the Frontend (Mobile) Instructions",
    placeholder: "Step-by-step instructions to run the mobile frontend",
    icon: <Smartphone className="h-4 w-4" />,
    category: "instructions",
    conditional: "includeMobileFrontend",
  },
  apiTestingInstructions: {
    label: "API Testing Instructions",
    placeholder: "How to test the APIs using testing tools",
    icon: <TestTube className="h-4 w-4" />,
    category: "instructions",
    conditional: "includeApiTesting",
  },

  // Team Information
  developers: {
    label: "Development Team",
    placeholder: "Enter developer names (one per line)",
    required: true,
    icon: <Monitor className="h-4 w-4" />,
    category: "basic",
  },
  projectManager: {
    label: "Project Manager/Supervisor",
    placeholder: "Project manager or supervisor name (Optional)",
    icon: <Monitor className="h-4 w-4" />,
    category: "basic",
  },
}

const categoryLabels = {
  basic: "Basic Information",
  tools: "Tools & Technologies",
  instructions: "Step-by-Step Instructions",
}

export default function DocForm({ documentType, questionnaireAnswers, onMarkdownGenerated }: DocFormProps) {
  const [formData, setFormData] = useState<FormData>({
    appName: "",
    description: "",
    companyName: "",
    logo: null,
    backendTech: "",
    frontendWebTech: "",
    frontendMobileTech: "",
    database: "",
    buildTool: "",
    versionControl: "Git",
    containerizationTool: "",
    aiIntegration: "",
    testingTool: "",
    ide: "",
    githubInstructions: "",
    databaseInstructions: "",
    externalApiInstructions: "",
    backendInstructions: "",
    frontendWebInstructions: "",
    frontendMobileInstructions: "",
    apiTestingInstructions: "",
    developers: "",
    projectManager: "",
  })
  const [loading, setLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["basic"])
  const [logoSizeWarning, setLogoSizeWarning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        // 1MB limit
        setLogoSizeWarning(true)
        toast({
          title: "File Too Large",
          description: "Please select a logo file smaller than 1MB.",
          variant: "destructive",
        })
        return
      }
      setLogoSizeWarning(false)
      setFormData({ ...formData, logo: file })
    }
  }

  const removeFile = () => {
    setFormData({ ...formData, logo: null })
    setLogoSizeWarning(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!formData.appName.trim()) {
      toast({
        title: "App Name Required",
        description: "Please enter an application name to generate the document.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const formDataToSend = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "logo" && value instanceof File) {
          formDataToSend.append(key, value)
        } else if (typeof value === "string") {
          formDataToSend.append(key, value)
        }
      })

      formDataToSend.append("documentType", documentType)
      formDataToSend.append("questionnaireAnswers", JSON.stringify(questionnaireAnswers))

      const response = await fetch("/api/generate-markdown", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      onMarkdownGenerated(result.markdown, formData)

      toast({
        title: "Content Generated!",
        description: "Your document content has been generated. Review it in the preview tab.",
      })
    } catch (error) {
      console.error("Error generating markdown:", error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  // Filter fields based on questionnaire answers
  const getVisibleFields = () => {
    return Object.entries(fieldConfig).filter(([key, config]) => {
      if (documentType !== "dev-setup") return false
      if (!config.conditional) return true
      return questionnaireAnswers[config.conditional]
    })
  }

  const visibleFields = getVisibleFields()
  const filledFields = visibleFields.filter(([key]) => {
    const value = formData[key as keyof FormData]
    if (key === "logo") return value !== null
    return typeof value === "string" && value.trim() !== ""
  }).length
  const progress = Math.round((filledFields / visibleFields.length) * 100)

  const fieldsByCategory = visibleFields.reduce(
    (acc, [key, config]) => {
      if (!acc[config.category]) {
        acc[config.category] = []
      }
      acc[config.category].push([key, config])
      return acc
    },
    {} as Record<string, Array<[string, FieldConfigEntry]>>,
  )

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#AAB99A]/10 to-[#727D73]/10 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold text-[#727D73]">Form Completion Progress</Label>
            <span className="text-xs font-medium text-[#727D73]">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-3 bg-gray-100" />
          <p className="text-xs text-[#727D73]/80">
            Fill out the required information. Our AI will enhance your input to create professional content.
          </p>
        </div>
      </div>

      <Accordion type="multiple" value={expandedSections} className="space-y-4">
        {Object.entries(fieldsByCategory).map(([category, fields]) => (
          <AccordionItem key={category} value={category} className="border border-gray-200 rounded-lg overflow-hidden">
            <AccordionTrigger
              className="px-4 py-3 hover:bg-gray-50 data-[state=open]:bg-gray-50"
              onClick={() => toggleSection(category)}
            >
              <div className="flex items-center gap-2 text-[#727D73]">
                <span className="font-semibold">{categoryLabels[category as keyof typeof categoryLabels]}</span>
                <span className="text-xs bg-[#AAB99A]/20 px-2 py-1 rounded">
                  {
                    fields.filter(([key]) => {
                      const value = formData[key as keyof FormData]
                      if (key === "logo") return value !== null
                      return typeof value === "string" && value.trim() !== ""
                    }).length
                  }
                  /{fields.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
              {fields.map(([key, config]) => {
                const fieldKey = key as keyof FormData
                return (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-medium text-[#727D73] flex items-center gap-2">
                      {config.icon}
                      {config.label}
                      {config.required && <span className="text-red-500">*</span>}
                    </Label>

                    {key === "logo" ? (
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="logo-upload"
                        />
                        {logoSizeWarning && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-700">
                              File size exceeds 1MB limit. Please choose a smaller file.
                            </span>
                          </div>
                        )}
                        {formData.logo ? (
                          <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <ImageIcon className="h-4 w-4 text-[#727D73]" />
                            <span className="text-sm text-[#727D73] flex-1">{formData.logo.name}</span>
                            <span className="text-xs text-[#727D73]/70">
                              {(formData.logo.size / 1024).toFixed(1)} KB
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-dashed border-2 border-gray-300 hover:border-[#AAB99A] py-8"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="h-6 w-6 text-[#727D73]" />
                              <span className="text-sm text-[#727D73]">Click to upload logo</span>
                              <span className="text-xs text-[#727D73]/70">Max 1MB • PNG, JPG, JPEG</span>
                            </div>
                          </Button>
                        )}
                      </div>
                    ) : key === "description" ||
                      key === "githubInstructions" ||
                      key === "databaseInstructions" ||
                      key === "externalApiInstructions" ||
                      key === "backendInstructions" ||
                      key === "frontendWebInstructions" ||
                      key === "frontendMobileInstructions" ||
                      key === "apiTestingInstructions" ||
                      key === "developers" ? (
                      <Textarea
                        id={key}
                        name={key}
                        value={formData[fieldKey] as string}
                        onChange={handleChange}
                        placeholder={config.placeholder}
                        className="min-h-[100px] border-gray-200 focus:border-[#AAB99A] focus:ring-[#AAB99A]"
                      />
                    ) : (
                      <Input
                        id={key}
                        name={key}
                        value={formData[fieldKey] as string}
                        onChange={handleChange}
                        placeholder={config.placeholder}
                        className="border-gray-200 focus:border-[#AAB99A] focus:ring-[#AAB99A]"
                      />
                    )}
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading || !formData.appName.trim()}
          className="bg-[#AAB99A] hover:bg-[#AAB99A]/90 text-white px-8 py-3 text-lg font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Generate Preview
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
