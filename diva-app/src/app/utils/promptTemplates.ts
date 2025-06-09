export type DocInput = {
  appName: string;
  description: string;
  targetUsers: string;
  features: string;
  techStack: string;
  setupSteps: string;
  usageExamples: string;
  knownLimitations?: string;
  deployment: string;
  devNotes?: string;
};

export const generateDocPrompt = (input: DocInput): string => {
  return `
You are a technical documentation expert. Based on the inputs below, generate TWO well-formatted Markdown documents:

---

App Name: ${input.appName}
One-line Description: ${input.description}
Target Users: ${input.targetUsers}
Features: ${input.features}
Tech Stack: ${input.techStack}
Setup Steps: ${input.setupSteps}
Usage Examples: ${input.usageExamples}
Known Limitations: ${input.knownLimitations || 'N/A'}
Deployment Method: ${input.deployment}
Developer Notes or Warnings: ${input.devNotes || 'N/A'}

---

## 📄 Generate two documents:

---

### 1. 🧑‍💻 Developer Setup Guide

Use the following structure:

1. **Overview**  
   A short summary of the app and its purpose.

2. **Tools & Technologies**  
   A Markdown table with 2 columns:  
   \`Category\` | \`Tool/Technology\`  
   Clearly group backend, frontend (web & mobile), database, and other tools.

3. **Prerequisites**  
   A bullet list of what needs to be installed (Java, Node, MySQL, Git, etc.), with a short explanation for each.

4. **What to Do: Step-by-Step Setup Guide**  
   Use clear emoji indicators and code blocks. Split this into:
   - 🔁 GitHub Repository setup
   - 🛢️ Database Configuration (MySQL)
   - ▶️ External API's like OpenAI API Integration, etc..
   - ▶️ Running the Backend
   - ▶️ Running the Web Frontend
   - ▶️ Running the Frontend (Mobile)

Use headings and subheadings for each section. Write clean, structured Markdown.

---

### 2. 👤 User Guide

Use the following structure:

1. **Overview**  
   Repeat the short description.

2. **Features**  
   A list or bullet points of main features.

3. **How to Use**  
   Explain how an end-user interacts with the app.

4. **Usage Examples**  
   Give short examples or use cases.

5. **Known Limitations**  
   (If provided)

6. **FAQ**  
   Include at least 3 relevant questions and answers based on context.

---

Keep the language clear, professional, and easy to follow for developers and non-technical users alike.
Output everything in **Markdown format**.
`;
};
