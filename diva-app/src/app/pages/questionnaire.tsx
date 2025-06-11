"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, ArrowRight, Sparkles, Zap } from "lucide-react"

interface QuestionnaireProps {
  documentType: "dev-setup" | "user-guide"
  onComplete: (answers: QuestionnaireAnswers) => void
}

export interface QuestionnaireAnswers {
  includeMobileFrontend: boolean
  isContainerized: boolean
  includeApiTesting: boolean
  consumesExternalApis: boolean
}

const devSetupQuestions = [
  {
    id: "includeMobileFrontend",
    question: "Will this guide include a mobile frontend?",
    description: "This will enable mobile frontend configuration and setup instructions.",
    icon: "📱",
  },
  {
    id: "isContainerized",
    question: "Is your backend containerized (e.g., using Docker)?",
    description: "This will include containerization tools and deployment instructions.",
    icon: "🐳",
  },
  {
    id: "includeApiTesting",
    question: "Will this guide include instructions for testing APIs?",
    description: "This will add API testing tools and testing workflow sections.",
    icon: "🧪",
  },
  {
    id: "consumesExternalApis",
    question: "Does your project consume any external APIs?",
    description: "This will include external API configuration and integration instructions.",
    icon: "🔗",
  },
]

export default function Questionnaire({ documentType, onComplete }: QuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({})
  const [isAnimating, setIsAnimating] = useState(false)

  const questions = documentType === "dev-setup" ? devSetupQuestions : []
  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = (questionId: string, answer: boolean) => {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)

    setIsAnimating(true)

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setIsAnimating(false)
      } else {
        onComplete(newAnswers as QuestionnaireAnswers)
      }
    }, 600)
  }

  if (documentType === "user-guide") {
    onComplete({
      includeMobileFrontend: false,
      isContainerized: false,
      includeApiTesting: false,
      consumesExternalApis: false,
    })
    return null
  }

  if (!currentQuestion) return null

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <br></br>
          <h2 className="text-4xl font-bold text-[#727D73] mb-4">Let's customize your guide</h2>
          <p className="text-xl text-[#727D73]/70 max-w-2xl mx-auto">
            Answer a few questions to create the perfect developer setup guide for your project
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-3">
              {questions.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-500 ${
                      index < currentQuestionIndex
                        ? "bg-gradient-to-r from-[#AAB99A] to-[#727D73] shadow-lg"
                        : index === currentQuestionIndex
                          ? "bg-[#727D73] shadow-lg scale-125"
                          : "bg-gray-200"
                    }`}
                  />
                  {index < questions.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-2 transition-colors duration-500 ${
                        index < currentQuestionIndex ? "bg-[#AAB99A]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-[#727D73]/60 mt-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Question Card */}
        <Card
          className={`transition-all duration-500 transform ${
            isAnimating ? "opacity-0 scale-95 rotate-1" : "opacity-100 scale-100 rotate-0"
          } bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-[#AAB99A]/30 hover:shadow-3xl`}
        >
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-[#AAB99A]/5 to-[#727D73]/5 border-b border-[#AAB99A]/20">
            <div className="flex items-center justify-center mb-6">
              <div className="text-6xl mb-4">{currentQuestion.icon}</div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#727D73] flex items-center justify-center gap-3">
              <span className="bg-gradient-to-r from-[#AAB99A] to-[#727D73] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg">
                {currentQuestionIndex + 1}
              </span>
              Configuration Step
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#727D73] mb-4 leading-tight">{currentQuestion.question}</h3>
              <p className="text-lg text-[#727D73]/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                {currentQuestion.description}
              </p>
            </div>

            <div className="flex gap-6 justify-center">
              <Button
                onClick={() => handleAnswer(currentQuestion.id, true)}
                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-6 text-xl font-bold rounded-2xl flex items-center gap-3 min-w-[160px] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <CheckCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                Yes
              </Button>
              <Button
                onClick={() => handleAnswer(currentQuestion.id, false)}
                className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-6 text-xl font-bold rounded-2xl flex items-center gap-3 min-w-[160px] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <XCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                No
              </Button>
            </div>

            <div className="text-center">
              {currentQuestionIndex < questions.length - 1 ? (
                <div className="flex items-center justify-center gap-2 text-[#727D73]/50">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Next question will appear automatically</span>
                  <ArrowRight className="h-4 w-4 animate-pulse" />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-[#AAB99A]">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Final question - you're almost done!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
