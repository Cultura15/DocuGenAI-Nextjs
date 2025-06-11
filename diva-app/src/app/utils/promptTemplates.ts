export type DocInput = {
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

  // Team Information
  developers: string
  projectManager: string

  documentType: "dev-setup" | "user-guide"
}

export const generateDevSetupPrompt = (input: DocInput): string => {
  return `
You are an expert technical documentation specialist with 10+ years of experience. Create a comprehensive, professional Developer Setup Guide that meets enterprise standards.

## INPUT ANALYSIS & ENHANCEMENT INSTRUCTIONS:
Even if the user provides minimal information, you MUST expand it into detailed, professional content. Use your expertise to:
- Infer standard prerequisites for the mentioned technologies
- Add comprehensive setup steps based on the tech stack
- Include industry best practices and common configurations
- Provide detailed explanations that demonstrate technical expertise
- Add appropriate emojis as specified in the formatting requirements

## PROJECT INFORMATION:
Application Name: ${input.appName}
Institution/Company: ${input.companyName || "Professional Organization"}
Description: ${input.description || "Advanced software application"}
Development Team: ${input.developers || "Development Team"}
Project Manager: ${input.projectManager || "Project Supervisor"}

## DOCUMENT STRUCTURE REQUIREMENTS:

### 1 OVERVIEW
Write a comprehensive 250-300 word overview that includes:
- Professional welcome statement for developers
- Detailed explanation of the application's purpose and scope
- Technical architecture overview
- Development environment requirements
- What developers will accomplish by following this guide
- Professional context and importance of the project

### 2 TOOLS & TECHNOLOGIES
Create a comprehensive technology breakdown. Based on the tech stack provided, intelligently categorize and expand:

REQUIRED FORMAT (expand based on technologies mentioned):
Category | Tool/Technology
Backend | ${input.backendTech || "Not specified"}
Frontend (Web) | ${input.frontendWebTech || "Not specified"}
${input.frontendMobileTech ? `Frontend (Mobile) | ${input.frontendMobileTech}` : ""}
Database | ${input.database || "Not specified"}
Build Tool | ${input.buildTool || "Not specified"}
Version Control | ${input.versionControl || "Git"}
${input.containerizationTool ? `Containerization | ${input.containerizationTool}` : ""}
${input.aiIntegration ? `AI Integration | ${input.aiIntegration}` : ""}
${input.testingTool ? `Testing Tool | ${input.testingTool}` : ""}
IDE | ${input.ide || "Not specified"}

### 3 PREREQUISITES
Based on the technology stack, provide comprehensive prerequisites. For each tool, include:
- Exact version requirements
- Professional explanation of why it's needed
- Installation complexity level

EXAMPLE FORMAT:
➢ **Node.js v18+ (LTS)** *Required for running the React frontend and build tools. Provides the JavaScript runtime environment and npm package manager essential for modern web development.*

➢ **Java 17+ (JDK)** *Enterprise-grade Java Development Kit required for Spring Boot backend development. Includes compiler, runtime, and development tools necessary for building robust server-side applications.*

[Continue with ALL relevant prerequisites based on tech stack]

### 4 STEP-BY-STEP SETUP GUIDE

#### 🟣 ***GitHub Repository Setup***
${
  input.githubInstructions ||
  `
1. Clone the repository using Git:
\`\`\`
git clone https://github.com/organization/${input.appName.toLowerCase().replace(/\s+/g, "-")}.git
cd ${input.appName.toLowerCase().replace(/\s+/g, "-")}
\`\`\`

2. Switch to the development branch:
\`\`\`
git checkout develop
\`\`\`

3. Install Git hooks for code quality:
\`\`\`
npm install husky --save-dev
npx husky install
\`\`\`

4. Configure your Git user information:
\`\`\`
git config user.name "Your Name"
git config user.email "your.email@example.com"
\`\`\`
`
}

#### 🔵 ***Database Configuration***
${
  input.databaseInstructions ||
  `
1. Install ${input.database || "the database"} on your local machine:
   - Download from the official website
   - Follow the installation wizard
   - Set up a secure password

2. Create a new database for the project:
\`\`\`
CREATE DATABASE ${input.appName.toLowerCase().replace(/\s+/g, "_")}_db;
\`\`\`

3. Create a database user with appropriate permissions:
\`\`\`
CREATE USER '${input.appName.toLowerCase().replace(/\s+/g, "_")}_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ${input.appName.toLowerCase().replace(/\s+/g, "_")}_db.* TO '${input.appName
    .toLowerCase()
    .replace(/\s+/g, "_")}_user'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

4. Configure the database connection in the application:
   - Locate the configuration file in the project
   - Update the connection string with your credentials
   - Ensure the connection is secured properly
`
}

${
  input.externalApiInstructions
    ? `#### 🟡 ***External APIs Configuration***
${input.externalApiInstructions}`
    : input.aiIntegration
      ? `#### 🟡 ***External APIs Configuration***
1. Sign up for an account on the ${input.aiIntegration} platform:
   - Navigate to the official website
   - Complete the registration process
   - Verify your email address

2. Create a new API key:
   - Go to the developer dashboard
   - Navigate to API keys section
   - Generate a new key with appropriate permissions
   - Copy the key to a secure location

3. Configure the API key in the application:
\`\`\`
# Add to your .env file (do not commit this file)
AI_API_KEY=your_api_key_here
AI_API_ENDPOINT=https://api.example.com/v1
\`\`\`

4. Test the API connection:
\`\`\`
curl -H "Authorization: Bearer your_api_key_here" https://api.example.com/v1/test
\`\`\`
`
      : ""
}

#### ▶️ ***Running the Backend***
${
  input.backendInstructions ||
  `
1. Navigate to the backend directory:
\`\`\`
cd backend
\`\`\`

2. Install dependencies:
${
  input.backendTech?.toLowerCase().includes("node") || input.backendTech?.toLowerCase().includes("javascript")
    ? `\`\`\`
npm install
\`\`\``
    : input.backendTech?.toLowerCase().includes("java") || input.backendTech?.toLowerCase().includes("spring")
      ? `\`\`\`
./mvnw clean install
\`\`\``
      : input.backendTech?.toLowerCase().includes("python") || input.backendTech?.toLowerCase().includes("django")
        ? `\`\`\`
pip install -r requirements.txt
\`\`\``
        : `\`\`\`
# Install dependencies using the appropriate package manager
\`\`\``
}

3. Set up environment variables:
\`\`\`
cp .env.example .env
# Edit .env file with your local configuration
\`\`\`

4. Run database migrations:
${
  input.backendTech?.toLowerCase().includes("node") || input.backendTech?.toLowerCase().includes("javascript")
    ? `\`\`\`
npm run migrate
\`\`\``
    : input.backendTech?.toLowerCase().includes("java") || input.backendTech?.toLowerCase().includes("spring")
      ? `\`\`\`
./mvnw flyway:migrate
\`\`\``
      : input.backendTech?.toLowerCase().includes("python") || input.backendTech?.toLowerCase().includes("django")
        ? `\`\`\`
python manage.py migrate
\`\`\``
        : `\`\`\`
# Run migrations using the appropriate command
\`\`\``
}

5. Start the development server:
${
  input.backendTech?.toLowerCase().includes("node") || input.backendTech?.toLowerCase().includes("javascript")
    ? `\`\`\`
npm run dev
\`\`\``
    : input.backendTech?.toLowerCase().includes("java") || input.backendTech?.toLowerCase().includes("spring")
      ? `\`\`\`
./mvnw spring-boot:run
\`\`\``
      : input.backendTech?.toLowerCase().includes("python") || input.backendTech?.toLowerCase().includes("django")
        ? `\`\`\`
python manage.py runserver
\`\`\``
        : `\`\`\`
# Start the server using the appropriate command
\`\`\``
}

6. Verify the backend is running:
   - Open your browser and navigate to http://localhost:8080/api/health
   - You should see a JSON response indicating the service is up
`
}

#### ▶️ ***Running the Frontend (Web)***
${
  input.frontendWebInstructions ||
  `
1. Navigate to the frontend directory:
\`\`\`
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`
npm install
\`\`\`

3. Set up environment variables:
\`\`\`
cp .env.example .env.local
# Edit .env.local with your local configuration
\`\`\`

4. Start the development server:
\`\`\`
npm run dev
\`\`\`

5. Access the application:
   - Open your browser and navigate to http://localhost:3000
   - You should see the application running

6. Login with default credentials:
   - Username: admin
   - Password: password123
   - Remember to change these credentials in a production environment
`
}

${
  input.frontendMobileInstructions
    ? `#### ▶️ ***Running the Frontend (Mobile)***
${input.frontendMobileInstructions}`
    : input.frontendMobileTech
      ? `#### ▶️ ***Running the Frontend (Mobile)***
1. Navigate to the mobile directory:
\`\`\`
cd mobile
\`\`\`

2. Install dependencies:
\`\`\`
npm install
\`\`\`

3. Set up environment variables:
\`\`\`
cp .env.example .env
# Edit .env with your local configuration
\`\`\`

4. Start the development server:
${
  input.frontendMobileTech?.toLowerCase().includes("react native")
    ? `\`\`\`
npx react-native start
\`\`\``
    : input.frontendMobileTech?.toLowerCase().includes("flutter")
      ? `\`\`\`
flutter run
\`\`\``
      : `\`\`\`
# Start the mobile development server
\`\`\``
}

5. Run on a device or emulator:
${
  input.frontendMobileTech?.toLowerCase().includes("react native")
    ? `\`\`\`
# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
\`\`\``
    : input.frontendMobileTech?.toLowerCase().includes("flutter")
      ? `\`\`\`
# For iOS
flutter run -d ios

# For Android
flutter run -d android
\`\`\``
      : `\`\`\`
# Run on your preferred device or emulator
\`\`\``
}

6. Troubleshooting common issues:
   - Ensure you have the correct SDK versions installed
   - Check that your emulator/device is properly configured
   - Verify that the backend server is running and accessible
`
      : ""
}

${
  input.apiTestingInstructions
    ? `#### ▶️ ***API Testing***
${input.apiTestingInstructions}`
    : input.testingTool
      ? `#### ▶️ ***API Testing***
1. Install ${input.testingTool}:
   - Download from the official website
   - Follow the installation instructions
   - Launch the application

2. Import the API collection:
   - Look for the API collection file in the project repository (usually in a \`docs\` or \`api\` folder)
   - In ${input.testingTool}, click on Import and select the collection file
   - The collection should now appear in your workspace

3. Set up environment variables:
   - Create a new environment in ${input.testingTool}
   - Add the following variables:
     - \`BASE_URL\`: http://localhost:8080/api
     - \`AUTH_TOKEN\`: (leave empty for now)

4. Authenticate with the API:
   - Find the "Login" or "Authenticate" request in the collection
   - Update the request body with valid credentials
   - Send the request
   - Save the returned token to your environment variable \`AUTH_TOKEN\`

5. Test the endpoints:
   - Browse through the collection and test each endpoint
   - Verify that responses match the expected format
   - Check that error handling works correctly

6. Automate testing (optional):
   - Use ${input.testingTool}'s test scripts to automate validation
   - Set up a collection runner to test all endpoints at once
   - Configure CI/CD integration if needed
`
      : ""
}

### 5 TROUBLESHOOTING COMMON ISSUES

#### Connection Issues
- Verify that all services are running (backend, database, etc.)
- Check firewall settings and port availability
- Ensure environment variables are correctly configured
- Validate network connectivity between services

#### Authentication Problems
- Verify credentials are correct
- Check token expiration and refresh mechanisms
- Ensure proper permissions are assigned to users
- Validate SSL certificates if using HTTPS

#### Build Failures
- Clear cache and temporary files
- Update dependencies to compatible versions
- Check for syntax errors in code
- Verify system requirements are met

## FORMATTING REQUIREMENTS:
- Use the following emojis for section headers:
  - 🟣 (purple circle) for GitHub setup
  - 🔵 (blue circle) for database configuration
  - 🟡 (yellow circle) for external APIs
  - ▶️ (play button) for running instructions
- Use bold (**text**) for tool names in prerequisites
- Use italic (*text*) for descriptions in prerequisites
- Include specific commands in code blocks
- Use professional, technical language throughout

Generate a professional, comprehensive Developer Setup Guide that meets enterprise standards.
`
}

export const generateUserGuidePrompt = (input: DocInput): string => {
  return `
You are an expert technical writer specializing in user-friendly documentation for professional and academic environments. Create a comprehensive User Guide that meets professional submission standards.

## INPUT ANALYSIS & ENHANCEMENT INSTRUCTIONS:
Transform any minimal input into detailed, professional content suitable for end-users. Use your expertise to:
- Expand brief descriptions into comprehensive user workflows
- Include detailed feature explanations and benefits
- Provide step-by-step instructions with clear outcomes
- Add professional context and user value propositions
- Add appropriate emojis as specified in the formatting requirements

## PROJECT INFORMATION:
Application Name: ${input.appName}
Institution/Company: ${input.companyName || "Professional Organization"}
Description: ${input.description || "Professional software application"}
Development Team: ${input.developers || "Development Team"}
Project Manager: ${input.projectManager || "Project Supervisor"}

## DOCUMENT STRUCTURE REQUIREMENTS:

### 1 INTRODUCTION
Write a comprehensive 300-350 word introduction that includes:
- Professional welcome to users
- Detailed explanation of the application's purpose and value
- Target audience identification and benefits
- Comprehensive guide overview and learning outcomes
- Professional context and importance
- User success expectations

### 2 GENERAL INFORMATION
Provide detailed application information (250-300 words):
- Comprehensive application functionality description
- Target audience analysis and use cases
- Key benefits and value propositions
- Problem-solving capabilities
- Unique features and competitive advantages
- User experience philosophy and design principles

### 2.1 SYSTEM OVERVIEW
Detail comprehensive functionality organized by platform:

**Web Application Features:**
Provide 8-12 detailed features with professional descriptions:
1. 🌟 User Dashboard – Comprehensive personal interface for activity management, analytics, and productivity tracking
2. 🔧 Administrative Interface – Centralized management system for user oversight, system configuration, and reporting
3. 💬 Communication System – Integrated messaging platform with real-time notifications and collaboration tools
4. 🤖 AI-Powered Support – Intelligent assistance system with automated responses and escalation capabilities
5. 👤 Profile Management – Complete user account control with security settings and personalization options
6. 🔔 Real-Time Notifications – Instant alert system for critical updates, messages, and system events
7. 📊 Analytics & Reporting – Comprehensive data visualization and performance tracking capabilities
8. 📚 Help & Documentation – Integrated support center with searchable knowledge base and tutorials

${
  input.frontendMobileTech
    ? `**Mobile Application Features:**
Provide 6-8 mobile-specific features:
1. 📱 Mobile-Optimized Interface – Touch-friendly design with responsive layouts and gesture controls
2. 🔔 Push Notifications – Real-time mobile alerts with customizable notification preferences
3. 🔄 Offline Capabilities – Essential functionality available without internet connectivity
4. 📲 Mobile-Specific Workflows – Streamlined processes optimized for mobile interaction patterns
5. 📷 Camera Integration – Built-in photo capture and document scanning capabilities
6. 📍 Location Services – GPS-enabled features for location-based functionality`
    : ""
}

### 3 GETTING STARTED
Provide comprehensive access instructions:

**Web Application Access**
- Professional URL and access requirements
- Browser compatibility and system requirements
- Initial setup and account creation process

${
  input.frontendMobileTech
    ? `**Mobile Application Installation**
- Detailed installation instructions for all platforms
- System requirements and compatibility information
- Initial configuration and setup process`
    : ""
}

### 3.1 HOW TO USE THE WEB APPLICATION
Create detailed step-by-step instructions (12-15 steps) covering:
1. 🚀 Initial access and navigation overview
2. 👤 Account creation and verification process
3. ⚙️ Profile setup and customization
4. 📊 Dashboard orientation and feature overview
5. 🔍 Core functionality utilization
6. 💬 Communication and collaboration features
7. ⚙️ Settings and preferences configuration
8. 🌟 Advanced features and capabilities
9. 🛠️ Troubleshooting common issues
10. 💡 Best practices and optimization tips

${
  input.frontendMobileTech
    ? `### 3.2 HOW TO USE THE MOBILE APPLICATION
Create comprehensive mobile instructions (10-12 steps) covering:
1. 📲 Application download and installation
2. 🔄 Initial setup and account synchronization
3. 👆 Mobile interface navigation and gestures
4. 📱 Core mobile features and workflows
5. 🔔 Notification management and preferences
6. 🔄 Offline functionality and synchronization
7. 📷 Mobile-specific features utilization
8. 🔋 Performance optimization and battery management`
    : ""
}

## FORMATTING REQUIREMENTS:
- Use colorful emojis at the beginning of each feature or instruction step
- Use bold (**text**) for important terms and features
- Use italic (*text*) for explanatory notes and tips
- Include specific steps with expected outcomes
- Use encouraging and supportive tone while maintaining professionalism

Generate a professional, comprehensive User Guide that meets enterprise and academic submission standards while remaining user-friendly and accessible.
`
}

export const generateDocPrompt = (input: DocInput): string => {
  if (input.documentType === "dev-setup") {
    return generateDevSetupPrompt(input)
  } else {
    return generateUserGuidePrompt(input)
  }
}

export const validateDocInput = (input: DocInput): string[] => {
  const errors: string[] = []

  if (!input.appName?.trim()) {
    errors.push("Application Name is required")
  }

  if (!input.description?.trim()) {
    errors.push("Project Description is required")
  }

  return errors
}
