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
  EMOJI_PURPLE: "800080", // Purple for GitHub setup emoji
  EMOJI_BLUE: "0000FF", // Blue for database config emoji
  EMOJI_YELLOW: "FFD700", // Yellow for external APIs emoji
  EMOJI_ORANGE: "FFA500", // Orange for running instructions emoji
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

export function createDocxFromMarkdown(
  markdown: string,
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

  // Process markdown content
  const lines = markdown.split("\n").filter((line) => line.trim() !== "")
  let currentSection = 0
  let inTable = false
  let tableRows: TableRow[] = []
  let inCodeBlock = false
  let codeBlockContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip markdown headers
    if (line.startsWith("#")) continue

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
    // Subsection headers (2.1, 3.1, etc.)
    else if (line.match(/^[1-4]\.[1-9]/)) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              bold: true,
              size: 26, // 13pt * 2
              font: "Arial",
              color: COLORS.SUBTITLE,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 120 },
        }),
      )
    }
    // Headers with colored emojis
    else if (line.includes("🟣") || line.includes("🔵") || line.includes("🟡") || line.includes("▶️")) {
      const textRuns: TextRun[] = []

      // Extract emoji and determine color
      let emoji = ""
      let emojiColor = ""

      if (line.includes("🟣")) {
        emoji = "🟣"
        emojiColor = COLORS.EMOJI_PURPLE
      } else if (line.includes("🔵")) {
        emoji = "🔵"
        emojiColor = COLORS.EMOJI_BLUE
      } else if (line.includes("🟡")) {
        emoji = "🟡"
        emojiColor = COLORS.EMOJI_YELLOW
      } else if (line.includes("▶️")) {
        emoji = "▶️"
        emojiColor = COLORS.EMOJI_ORANGE
      }

      // Add emoji with color
      if (emoji) {
        textRuns.push(
          new TextRun({
            text: emoji + " ",
            size: 24, // 12pt * 2
            font: "Arial",
            color: emojiColor,
          }),
        )

        // Add the rest of the text
        const text = line.replace(emoji, "").trim()

        // Check if it's a special header with ***
        if (text.startsWith("***") && text.endsWith("***")) {
          textRuns.push(
            new TextRun({
              text: text.replace(/^\*\*\*|\*\*\*$/g, ""),
              bold: true,
              italics: true,
              size: 24, // 12pt * 2
              font: "Arial",
            }),
          )
        } else {
          textRuns.push(
            new TextRun({
              text: text,
              bold: true,
              size: 24, // 12pt * 2
              font: "Arial",
            }),
          )
        }

        children.push(
          new Paragraph({
            children: textRuns,
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
            spacing: { before: 180, after: 120 },
          }),
        )

        continue
      }
    }
    // Headers with special formatting (***Header***)
    else if (line.includes("***")) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.replace(/^\*\*\*|\*\*\*$/g, ""),
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
    // Prerequisites with bullets (➢)
    else if (line.includes("➢")) {
      // Extract the content after the bullet
      const content = line.replace(/^[>*-]\s*/, "").replace("➢", "")

      // Split by bold markers
      const parts = content.split(/\*\*(.*?)\*\*/)

      const textRuns: TextRun[] = [
        new TextRun({
          text: "➢ ",
          size: 22, // 11pt * 2
          font: "Arial",
        }),
      ]

      // Process parts to handle bold and italics text
      for (let j = 0; j < parts.length; j++) {
        if (j % 2 === 0) {
          // Regular text
          if (parts[j].trim()) {
            // Check if this part contains italics text
            const italicsParts = parts[j].split(/\*(.*?)\*/)

            for (let k = 0; k < italicsParts.length; k++) {
              if (k % 2 === 0) {
                // Regular text
                if (italicsParts[k].trim()) {
                  textRuns.push(
                    new TextRun({
                      text: italicsParts[k],
                      size: 22, // 11pt * 2
                      font: "Arial",
                    }),
                  )
                }
              } else {
                // italics text
                textRuns.push(
                  new TextRun({
                    text: italicsParts[k],
                    italics: true,
                    size: 22, // 11pt * 2
                    font: "Arial",
                  }),
                )
              }
            }
          }
        } else {
          // Bold text
          textRuns.push(
            new TextRun({
              text: parts[j],
              bold: true,
              size: 22, // 11pt * 2
              font: "Arial",
            }),
          )
        }
      }

      children.push(
        new Paragraph({
          children: textRuns,
          alignment: AlignmentType.JUSTIFIED,
          spacing: {
            line: 360, // 1.5 line spacing
            after: 180,
            // left: 360, // Indent for bullet points
          },
        }),
      )
    }
    // Feature items with emojis (🌟, 🔧, etc.)
    else if (/^[🌟🔧💬🤖👤🔔📊📚📱🔄📲📷📍🚀👤⚙️📊🔍💬⚙️🌟🛠️💡]/u.test(line)) {
      const emoji = line.match(/^[🌟🔧💬🤖👤🔔📊📚📱🔄📲📷📍🚀👤⚙️📊🔍💬⚙️🌟🛠️💡]/u)?.[0] || ""
      const content = line.replace(/^[🌟🔧💬🤖👤🔔📊📚📱🔄📲📷📍🚀👤⚙️📊🔍💬⚙️🌟🛠️💡]/u, "").trim()

      // Split by bold markers
      const parts = content.split(/\*\*(.*?)\*\*/)

      const textRuns: TextRun[] = [
        new TextRun({
          text: emoji + " ",
          size: 22, // 11pt * 2
          font: "Arial",
          color: COLORS.EMOJI_ORANGE, // Use a vibrant color for emojis
        }),
      ]

      // Process parts to handle bold and italics text
      for (let j = 0; j < parts.length; j++) {
        if (j % 2 === 0) {
          // Regular text
          if (parts[j].trim()) {
            // Check if this part contains italics text
            const italicsParts = parts[j].split(/\*(.*?)\*/)

            for (let k = 0; k < italicsParts.length; k++) {
              if (k % 2 === 0) {
                // Regular text
                if (italicsParts[k].trim()) {
                  textRuns.push(
                    new TextRun({
                      text: italicsParts[k],
                      size: 22, // 11pt * 2
                      font: "Arial",
                    }),
                  )
                }
              } else {
                // italics text
                textRuns.push(
                  new TextRun({
                    text: italicsParts[k],
                    italics: true,
                    size: 22, // 11pt * 2
                    font: "Arial",
                  }),
                )
              }
            }
          }
        } else {
          // Bold text
          textRuns.push(
            new TextRun({
              text: parts[j],
              bold: true,
              size: 22, // 11pt * 2
              font: "Arial",
            }),
          )
        }
      }

      children.push(
        new Paragraph({
          children: textRuns,
          alignment: AlignmentType.JUSTIFIED,
          spacing: {
            line: 360, // 1.5 line spacing
            after: 180,
            // left: 360, // Indent for bullet points
          },
        }),
      )
    }
    // Table handling
    else if (line.includes("|")) {
      if (!inTable) {
        inTable = true
        tableRows = []
      }

      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell)

      if (cells.length >= 2) {
        const isHeader = line.includes("Category") || line.includes("Tool/Technology")

        const rowCells = cells.map((cell, index) => {
          // Check for italics text in parentheses
          const cellContent = []

          if (cell.includes("(") && cell.includes(")")) {
            const beforeParen = cell.substring(0, cell.indexOf("("))
            const inParen = cell.substring(cell.indexOf("("), cell.indexOf(")") + 1)
            const afterParen = cell.substring(cell.indexOf(")") + 1)

            if (beforeParen) {
              cellContent.push(
                new TextRun({
                  text: beforeParen,
                  bold: isHeader,
                  size: 22, // 11pt * 2
                  font: "Arial",
                  color: isHeader ? "FFFFFF" : "000000",
                }),
              )
            }

            if (inParen) {
              cellContent.push(
                new TextRun({
                  text: inParen,
                  bold: isHeader,
                  italics: !isHeader, // Only italics if not header
                  size: 22, // 11pt * 2
                  font: "Arial",
                  color: isHeader ? "FFFFFF" : "000000",
                }),
              )
            }

            if (afterParen) {
              cellContent.push(
                new TextRun({
                  text: afterParen,
                  bold: isHeader,
                  size: 22, // 11pt * 2
                  font: "Arial",
                  color: isHeader ? "FFFFFF" : "000000",
                }),
              )
            }
          } else {
            cellContent.push(
              new TextRun({
                text: cell,
                bold: isHeader,
                size: 22, // 11pt * 2
                font: "Arial",
                color: isHeader ? "FFFFFF" : "000000",
              }),
            )
          }

          return new TableCell({
            children: [
              new Paragraph({
                children: cellContent,
                alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
              }),
            ],
            width: { size: index === 0 ? 40 : 60, type: WidthType.PERCENTAGE },
            shading: isHeader ? { fill: COLORS.TABLE_HEADER } : undefined,
          })
        })

        tableRows.push(new TableRow({ children: rowCells }))
      }
    }
    // End of table or regular content
    else if (!line.startsWith("|") && inTable) {
      if (tableRows.length > 0) {
        const table = new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: tableBorders,
        })

        children.push(
          new Paragraph({
            children: [table as any],
            spacing: { before: 240, after: 360 },
          }),
        )

        inTable = false
        tableRows = []
      }
    }
    // Code blocks that aren't marked with \`\`\`
    else if (
      !inTable &&
      (line.startsWith("git ") ||
        line.startsWith("cd ") ||
        line.startsWith("npm ") ||
        line.startsWith("mvn ") ||
        line.startsWith("CREATE ") ||
        line.startsWith("spring."))
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
    else if (!inTable && (line.includes("http://") || line.includes("https://"))) {
      const urlMatch = line.match(/(https?:\/\/[^\s\]]+)/)
      if (urlMatch) {
        const beforeUrl = line.substring(0, urlMatch.index)
        const url = urlMatch[0].replace(/\)$/, "") // Remove trailing parenthesis if present
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
    // Regular paragraphs - 11 ARIAL font size
    else if (!inTable && line.length > 0 && !line.startsWith("---") && !line.includes("```")) {
      // Handle bold and italics text
      const parts = line.split(/\*\*(.*?)\*\*/)
      const textRuns: TextRun[] = []

      for (let j = 0; j < parts.length; j++) {
        if (j % 2 === 0) {
          // Regular text
          if (parts[j].trim()) {
            // Check if this part contains italics text
            const italicsParts = parts[j].split(/\*(.*?)\*/)

            for (let k = 0; k < italicsParts.length; k++) {
              if (k % 2 === 0) {
                // Regular text
                if (italicsParts[k].trim()) {
                  textRuns.push(
                    new TextRun({
                      text: italicsParts[k],
                      size: 22, // 11pt * 2
                      font: "Arial",
                    }),
                  )
                }
              } else {
                // italics text
                textRuns.push(
                  new TextRun({
                    text: italicsParts[k],
                    italics: true,
                    size: 22, // 11pt * 2
                    font: "Arial",
                  }),
                )
              }
            }
          }
        } else {
          // Bold text
          textRuns.push(
            new TextRun({
              text: parts[j],
              bold: true,
              size: 22, // 11pt * 2
              font: "Arial",
            }),
          )
        }
      }

      children.push(
        new Paragraph({
          children:
            textRuns.length > 0
              ? textRuns
              : [
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

  // Handle any remaining table
  if (inTable && tableRows.length > 0) {
    const table = new Table({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
    })

    children.push(
      new Paragraph({
        children: [table as any],
        spacing: { before: 240, after: 360 },
      }),
    )
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
