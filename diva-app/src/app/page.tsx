"use client"

import { useState } from "react"
import DocumentGenerator from "./pages/document-generator"

type DocumentType = "dev-setup" | "user-guide"

export default function Home() {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F0F0D7] via-[#F0F0D7] to-[#AAB99A]/20">
    
      {!documentType && (
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#727D73]/5 to-[#AAB99A]/5"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-8">
            <nav className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#AAB99A] to-[#727D73] rounded-full blur opacity-30"></div>
                  <div className="relative bg-white rounded-full p-3 shadow-lg">
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#727D73] to-[#AAB99A] bg-clip-text text-transparent">
                      D
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#727D73] tracking-tight">Diva</h1>
                  <p className="text-sm text-[#727D73]/70 font-medium">AI Document Generator</p>
                </div>
              </div>
            </nav>

         
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-8 shadow-sm border border-[#AAB99A]/20">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-[#727D73]">AI-Powered • Professional • Fast</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-[#727D73] mb-6 leading-tight">
                Create Professional
                <span className="block bg-gradient-to-r from-[#AAB99A] to-[#727D73] bg-clip-text text-transparent">
                  Documentation
                </span>
                <span className="block">in Minutes</span>
              </h2>

              <p className="text-md text-[#727D73]/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                by Jesson Chyd
              </p>

              <br></br>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <div className="flex items-center text-[#727D73]/70">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No setup required
                </div>
                <div className="flex items-center text-[#727D73]/70">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Export to Word
                </div>
                <div className="flex items-center text-[#727D73]/70">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  AI-Enhanced Content
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* main contnet */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <DocumentGenerator documentType={documentType} onDocumentTypeChange={setDocumentType} />
      </div>

      {/* background deco */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-[#AAB99A]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-[#727D73]/10 rounded-full blur-2xl"></div>
        <div className="absolute top-3/4 left-1/4 w-32 h-32 bg-[#F0F0D7]/20 rounded-full blur-2xl"></div>
      </div>
    </main>
  )
}
