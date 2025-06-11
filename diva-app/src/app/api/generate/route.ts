// import { type NextRequest, NextResponse } from "next/server"
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"
// import { Packer } from "docx"
// import { generateDocPrompt, validateDocInput, type DocInput } from "@/app/utils/promptTemplates"
// import { createDocxDocument } from "@/app/utils/docxGenerator"

// export async function POST(req: NextRequest) {
//   try {
//     const data: DocInput = await req.json()
    
//     // Validate input data
//     const validationErrors = validateDocInput(data)
//     if (validationErrors.length > 0) {
//       return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 })
//     }

//     // Generate content using AI SDK with enhanced parameters
//     const { text } = await generateText({
//       model: openai("gpt-3.5-turbo"),
//       prompt: generateDocPrompt(data),
//       maxTokens: 4000,
//       temperature: 0.7, // Balanced creativity and consistency
//     })

//     // Create professional DOCX document
//     const doc = createDocxDocument(
//       text,
//       data.appName,
//       data.documentType,
//       data.developers,
//       data.companyName,
//       data.projectManager,
//       data.version,
//     )

//     // Generate buffer
//     const buffer = await Packer.toBuffer(doc)

//     // Create professional filename
//     const timestamp = new Date().toISOString().split("T")[0]
//     const filename = `${data.appName.replace(/[^a-zA-Z0-9]/g, "_")}_${data.documentType}_${timestamp}.docx`

//     // Return the document
//     return new NextResponse(buffer, {
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         "Content-Disposition": `attachment; filename="${filename}"`,
//         "Cache-Control": "no-cache",
//       },
//     })
//   } catch (error) {
//     console.error("Error generating document:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to generate document",
//         details: error instanceof Error ? error.message : "Unknown error",
//         timestamp: new Date().toISOString(),
//       },
//       { status: 500 },
//     )
//   }
// }
