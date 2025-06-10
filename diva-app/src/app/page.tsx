import DocumentGenerator from "./pages/document-generator";
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diva - AI Document Generator",
  description: "Generate professional documentation with AI assistance",
}

export default function Home() {

   return (
    <main className="min-h-screen bg-[#F0F0D7] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#727D73]">Diva</h1>
          <p className="text-[#727D73]/80 text-lg mt-2">AI-powered document generation for developers and users</p>
        </header>
        <DocumentGenerator />
      </div>
    </main>
  )
}