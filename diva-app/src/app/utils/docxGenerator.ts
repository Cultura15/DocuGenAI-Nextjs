import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageBreak,
  type ITableBordersOptions,
} from "docx"

// Professional color scheme with exact colors from specification
const COLORS = {
  SECTION_TITLE: "1F4E79", // Dark blue for section titles (1 OVERVIEW)
  TEXT: "000000", // Black for regular text
  SUBTITLE: "2F5496", // Medium blue for subtitles
  CODE_BG: "000000", // Black background for code blocks
  CODE_TEXT: "00FF00", // Green text for code
  LINK: "0563C1", // Blue for hyperlinks
  TABLE_HEADER: "4472C4", // Blue for table headers
}

// Table borders exactly as specified
const tableBorders: ITableBordersOptions = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
}

export function createDocxDocument(
  content: string,
  appName: string,
  documentType: string,
  developers: string,
  companyName: string,
  projectManager: string,
  version: string,
): Document {
  const children: Paragraph[] = []

  // Create institutional header page with exact font sizes from specification
  const institutionName = companyName || "CEBU INSTITUTE OF TECHNOLOGY"
  const isUniversity =
    institutionName.toLowerCase().includes("university") || institutionName.toLowerCase().includes("institute")

  // Add institutional header - 17.5 ARIAL font size BOLD
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: institutionName.toUpperCase(),
          bold: true,
          size: 35, // 17.5pt * 2 for docx
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    }),
  )

  // Add UNIVERSITY - 17.5 ARIAL font size BOLD
  if (isUniversity) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "UNIVERSITY",
            bold: true,
            size: 35, // 17.5pt * 2
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
      }),
    )
  }

  // Add logo placeholder - would be replaced with actual logo in production
  // This is commented out as we don't have the actual image file
  /*
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.jpeg")
    if (fs.existsSync(logoPath)) {
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: fs.readFileSync(logoPath),
              transformation: {
                width: 147, // 1.53125in * 96
                height: 141, // 1.46875in * 96
              },
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
        }),
      )
    }
  } catch (error) {
    console.error("Error adding logo:", error)
  }
  */

  // Add document type - 14 ARIAL font size bold
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: documentType === "dev-setup" ? "Developer Setup Guide" : "User Guide",
          bold: true,
          size: 28, // 14pt * 2
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
  )

  // Add "for" - 11 ARIAL font size
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "for",
          size: 22, // 11pt * 2
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
  )

  // Add app name - 14 ARIAL font size
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: appName,
          size: 28, // 14pt * 2
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
    }),
  )

  // Add developers section - 13 ARIAL font size bold
  if (developers.trim()) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Developers",
            bold: true,
            size: 26, // 13pt * 2
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
    )

    // Add developer names - 12 ARIAL font size
    const devList = developers.split("\n").filter((dev) => dev.trim())
    devList.forEach((dev) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: dev.trim(),
              size: 24, // 12pt * 2
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
        }),
      )
    })
  }

  // Add project manager if provided
  if (projectManager.trim()) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Project Supervisor",
            bold: true,
            size: 26, // 13pt * 2
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 60 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: projectManager.trim(),
            size: 24, // 12pt * 2
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
    )
  }

  // Add date - 10.5 ARIAL font size
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: currentDate,
          size: 21, // 10.5pt * 2
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 240 },
    }),
  )

  // Add page break after title page
  children.push(new Paragraph({ children: [new PageBreak()] }))

  // Process the generated content
  const lines = content.split("\n").filter((line) => line.trim() !== "")
  let currentSection = 0
  let inCodeBlock = false
  let codeBlockContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip markdown headers and formatting
    if (line.startsWith("#") || line === "---") {
      continue
    }

    // Check if we're entering or exiting a code block
    if (line.startsWith("```") || line.endsWith("```")) {
      if (inCodeBlock) {
        // End of code block, add it to the document
        if (codeBlockContent.length > 0) {
          codeBlockContent.forEach((codeLine) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: codeLine,
                    size: 22, // 11pt * 2
                    font: "Courier New",
                    color: COLORS.CODE_TEXT,
                    shading: {
                      fill: COLORS.CODE_BG,
                    },
                  }),
                ],
                spacing: {
                  before: 0,
                  after: 0,
                },
              }),
            )
          })

          // Add spacing after code block
          children.push(
            new Paragraph({
              children: [],
              spacing: { after: 120 },
            }),
          )
        }

        codeBlockContent = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
      continue
    }

    // If we're in a code block, add the line to the code content
    if (inCodeBlock) {
      codeBlockContent.push(line)
      continue
    }

    // Main section headers (1 Overview, 2 Tools & Technologies, etc.) - 14 ARIAL font size bold color dark blue
    if (line.match(/^[1-4]\s+[A-Z]/)) {
      currentSection++

      // Add page break before new sections (except first)
      if (currentSection > 1) {
        children.push(new Paragraph({ children: [new PageBreak()] }))
      }

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              bold: true,
              size: 28, // 14pt * 2
              font: "Arial",
              color: COLORS.SECTION_TITLE,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 240 },
        }),
      )
    }
    // Subsection headers with special formatting
    else if (
      line.includes("GitHub Repository") ||
      line.includes("Database Configuration") ||
      line.includes("OpenAI API Integration")
    ) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              bold: true,
              italics: true,
              size: 24, // 12pt * 2
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { before: 180, after: 120 },
        }),
      )
    }
    // Running sections with arrow (▶)
    else if (
      line.includes("Running the Backend") ||
      line.includes("Running the Web Frontend") ||
      line.includes("Running the Frontend (Mobile)") ||
      line.includes("API Testing")
    ) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "▶ ",
              bold: true,
              size: 24, // 12pt * 2
              font: "Arial",
            }),
            new TextRun({
              text: line.replace("▶", "").trim(),
              bold: true,
              italics: true,
              size: 24, // 12pt * 2
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { before: 180, after: 120 },
        }),
      )
    }
    // Prerequisites with special bullets (➢) - 11 ARIAL font size
    else if (line.includes("➢")) {
      // Split the line to separate the tool name from description
      const parts = line.replace(/^[>*\s]*➢\s*/, "").split(/\s+(?=For|Required|Used|Helpful|Recommended)/)

      if (parts.length >= 2) {
        const toolName = parts[0]
        const description = parts.slice(1).join(" ")

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "➢ ",
                size: 22, // 11pt * 2
                font: "Arial",
              }),
              new TextRun({
                text: toolName + " ",
                bold: true,
                size: 22, // 11pt * 2
                font: "Arial",
              }),
              new TextRun({
                text: description,
                italics: true,
                size: 22, // 11pt * 2
                font: "Arial",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              line: 360, // 1.5 line spacing
              after: 120,
              // left: 360, // Indent for bullet points
            },
          }),
        )
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "➢ ",
                size: 22, // 11pt * 2
                font: "Arial",
              }),
              new TextRun({
                text: line.replace(/^[>*\s]*➢\s*/, ""),
                size: 22, // 11pt * 2
                font: "Arial",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              line: 360, // 1.5 line spacing
              after: 120,
              // left: 360, // Indent for bullet points
            },
          }),
        )
      }
    }
    // Handle table content for Tools & Technologies - 11 ARIAL font size
    else if (line.includes("|") && (line.includes("Category") || (i > 0 && lines[i - 1].includes("Category")))) {
      const tableRows: TableRow[] = []

      // Add header row
      if (line.includes("Category")) {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Category",
                        bold: true,
                        size: 22, // 11pt * 2
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                width: { size: 40, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Tool/Technology",
                        bold: true,
                        size: 22, // 11pt * 2
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                width: { size: 60, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
        )
      }

      // Process table rows
      let j = line.includes("Category") ? i + 1 : i
      for (; j < lines.length; j++) {
        const tableLine = lines[j].trim()
        if (tableLine.includes("|") && !tableLine.startsWith("#")) {
          const [category, technology] = tableLine.split("|").map((cell) => cell.trim())

          if (category && technology) {
            // Check if technology contains text in parentheses for italicsss
            const techParts = []
            const techRuns = []

            if (technology.includes("(") && technology.includes(")")) {
              const beforeParen = technology.substring(0, technology.indexOf("("))
              const inParen = technology.substring(technology.indexOf("("), technology.indexOf(")") + 1)
              const afterParen = technology.substring(technology.indexOf(")") + 1)

              if (beforeParen) {
                techRuns.push(
                  new TextRun({
                    text: beforeParen,
                    size: 22, // 11pt * 2
                    font: "Arial",
                  }),
                )
              }

              if (inParen) {
                techRuns.push(
                  new TextRun({
                    text: inParen,
                    italics: true,
                    size: 22, // 11pt * 2
                    font: "Arial",
                  }),
                )
              }

              if (afterParen) {
                techRuns.push(
                  new TextRun({
                    text: afterParen,
                    size: 22, // 11pt * 2
                    font: "Arial",
                  }),
                )
              }
            } else {
              techRuns.push(
                new TextRun({
                  text: technology,
                  size: 22, // 11pt * 2
                  font: "Arial",
                }),
              )
            }

            tableRows.push(
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: category,
                            size: 22, // 11pt * 2
                            font: "Arial",
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 60, after: 60 },
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: techRuns,
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 60, after: 60 },
                      }),
                    ],
                  }),
                ],
              }),
            )
          }
        } else {
          break
        }
      }

      if (tableRows.length > 0) {
        const table = new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: tableBorders,
        })

        children.push(
          new Paragraph({
            children: [table as any],
            spacing: { before: 120, after: 240 },
          }),
        )
      }

      i = j - 1
    }
    // Handle code blocks that aren't marked with \`\`\`
    else if (
      line.startsWith("git ") ||
      line.startsWith("cd ") ||
      line.startsWith("npm ") ||
      line.startsWith("mvn ") ||
      line.startsWith("CREATE ") ||
      line.startsWith("spring.")
    ) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 22, // 11pt * 2
              font: "Courier New",
              color: COLORS.CODE_TEXT,
              shading: {
                fill: COLORS.CODE_BG,
              },
            }),
          ],
          spacing: {
            before: 60,
            after: 60,
          },
        }),
      )
    }
    // URLs/Links
    else if (line.includes("http://") || line.includes("https://")) {
      const urlMatch = line.match(/(https?:\/\/[^\s]+)/)
      if (urlMatch) {
        const beforeUrl = line.substring(0, urlMatch.index)
        const url = urlMatch[0]
        const afterUrl = line.substring(urlMatch.index! + url.length)

        const textRuns: TextRun[] = []

        if (beforeUrl) {
          textRuns.push(
            new TextRun({
              text: beforeUrl,
              size: 22, // 11pt * 2
              font: "Arial",
            }),
          )
        }

        textRuns.push(
          new TextRun({
            text: url,
            size: 22, // 11pt * 2
            font: "Arial",
            color: COLORS.LINK,
            underline: {},
          }),
        )

        if (afterUrl) {
          textRuns.push(
            new TextRun({
              text: afterUrl,
              size: 22, // 11pt * 2
              font: "Arial",
            }),
          )
        }

        children.push(
          new Paragraph({
            children: textRuns,
            alignment: AlignmentType.LEFT,
            spacing: {
              line: 360, // 1.5 line spacing
              after: 120,
            },
          }),
        )
      }
    }
    // Ensure the following tools are installed:
    else if (line.includes("Ensure the following tools are installed:")) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              bold: true,
              size: 22, // 11pt * 2
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: {
            line: 360, // 1.5 line spacing
            after: 120,
          },
        }),
      )
    }
    // Regular paragraphs - 11 ARIAL font size
    else if (line.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 22, // 11pt * 2
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: {
            line: 360, // 1.5 line spacing
            after: 180,
          },
        }),
      )
    }
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: children,
      },
    ],
  })
}
