import { type NextRequest, NextResponse } from "next/server"
import { Packer } from "docx"
import { createDocxFromMarkdown } from "@/app/utils/markdownToDocx"

export async function POST(req: NextRequest) {
  try {
    const { markdown, formData, documentType } = await req.json()

    if (!markdown || !formData) {
      return NextResponse.json({ error: "Markdown content and form data are required" }, { status: 400 })
    }


    const doc = createDocxFromMarkdown(
      markdown,
      formData.appName,
      documentType,
      formData.developers,
      formData.companyName,
      formData.projectManager,
      formData.version,
    )


    const buffer = await Packer.toBuffer(doc)

  
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `${formData.appName.replace(/[^a-zA-Z0-9]/g, "_")}_${documentType}_${timestamp}.docx`

    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error converting to DOCX:", error)
    return NextResponse.json(
      {
        error: "Failed to convert to DOCX",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
