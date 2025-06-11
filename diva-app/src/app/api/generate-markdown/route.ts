import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { generateDocPrompt, type DocInput } from "@/app/utils/promptTemplates"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()


    const data: DocInput = {
      appName: formData.get("appName") as string,
      description: formData.get("description") as string,
      companyName: formData.get("companyName") as string,
      logo: formData.get("logo") as File | null,
      backendTech: formData.get("backendTech") as string,
      frontendWebTech: formData.get("frontendWebTech") as string,
      frontendMobileTech: formData.get("frontendMobileTech") as string,
      database: formData.get("database") as string,
      buildTool: formData.get("buildTool") as string,
      versionControl: formData.get("versionControl") as string,
      containerizationTool: formData.get("containerizationTool") as string,
      aiIntegration: formData.get("aiIntegration") as string,
      testingTool: formData.get("testingTool") as string,
      ide: formData.get("ide") as string,
      githubInstructions: formData.get("githubInstructions") as string,
      databaseInstructions: formData.get("databaseInstructions") as string,
      externalApiInstructions: formData.get("externalApiInstructions") as string,
      backendInstructions: formData.get("backendInstructions") as string,
      frontendWebInstructions: formData.get("frontendWebInstructions") as string,
      frontendMobileInstructions: formData.get("frontendMobileInstructions") as string,
      apiTestingInstructions: formData.get("apiTestingInstructions") as string,
      developers: formData.get("developers") as string,
      projectManager: formData.get("projectManager") as string,
      documentType: formData.get("documentType") as "dev-setup" | "user-guide",
    }

    if (!data.appName?.trim()) {
      return NextResponse.json({ error: "Application Name is required" }, { status: 400 })
    }

   
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: generateDocPrompt(data),
      maxTokens: 3000,
      temperature: 0.7,
    })

    

    return NextResponse.json({
      markdown: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating markdown:", error)
    return NextResponse.json(
      {
        error: "Failed to generate markdown content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
