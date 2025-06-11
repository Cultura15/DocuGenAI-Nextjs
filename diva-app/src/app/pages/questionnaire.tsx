"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, ArrowRight } from "lucide-react"

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
  },
  {
    id: "isContainerized",
    question: "Is your backend containerized (e.g., using Docker)?",
    description: "This will include containerization tools and deployment instructions.",
  },
  {
    id: "includeApiTesting",
    question: "Will this guide include instructions for testing APIs?",
    description: "This will add API testing tools and testing workflow sections.",
  },
  {
    id: "consumesExternalApis",
    question: "Does your project consume any external APIs?",
    description: "This will include external API configuration and integration instructions.",
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
    }, 500)
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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[#727D73] mb-2">Setup Configuration</h2>
          <p className="text-[#727D73]/80">Answer a few questions to customize your developer setup guide</p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index < currentQuestionIndex
                      ? "bg-[#AAB99A]"
                      : index === currentQuestionIndex
                        ? "bg-[#727D73]"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <Card
          className={`transition-all duration-500 transform ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          } bg-white shadow-lg border-2 border-[#AAB99A]/20`}
        >
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-[#727D73] flex items-center justify-center gap-2">
              <span className="bg-[#AAB99A] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {currentQuestionIndex + 1}
              </span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#727D73] mb-3">{currentQuestion.question}</h3>
              <p className="text-sm text-[#727D73]/70 mb-6">{currentQuestion.description}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleAnswer(currentQuestion.id, true)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg font-semibold rounded-lg flex items-center gap-2 min-w-[120px]"
              >
                <CheckCircle className="h-5 w-5" />
                Yes
              </Button>
              <Button
                onClick={() => handleAnswer(currentQuestion.id, false)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg font-semibold rounded-lg flex items-center gap-2 min-w-[120px]"
              >
                <XCircle className="h-5 w-5" />
                No
              </Button>
            </div>

            <div className="text-center text-xs text-[#727D73]/50 mt-4">
              {currentQuestionIndex < questions.length - 1 ? (
                <span className="flex items-center justify-center gap-1">
                  Next question will appear automatically <ArrowRight className="h-3 w-3" />
                </span>
              ) : (
                <span>This is the final question</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
