"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Send, Bot, User } from "lucide-react"

const AiChat = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm your AI assistant. Ask me anything about this portfolio or the developer's work!",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Use the actual OpenAI API with the environment variable
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant for a portfolio website. Answer questions about the developer's skills, projects, and experience. The developer specializes in React, JavaScript, TypeScript, and frontend development with expertise in UI/UX design and AI integration. Keep responses concise and helpful.",
            },
            ...messages.filter((msg) => msg.role !== "assistant" || messages.indexOf(msg) !== 0),
            userMessage,
          ],
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I couldn't process your request. Please check the API key or try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Mock AI response function for demonstration
  // const mockAiResponse = async (question) => {
  //   // Simulate network delay
  //   await new Promise((resolve) => setTimeout(resolve, 1000))

  //   const responses = {
  //     skills:
  //       "The developer is skilled in React, JavaScript, TypeScript, HTML/CSS, UI/UX design, and AI integration. They specialize in creating responsive, accessible web applications with modern technologies.",
  //     experience:
  //       "The developer has over 5 years of experience working on various projects from small business websites to complex web applications. They're passionate about technology and design.",
  //     projects:
  //       "The portfolio showcases various projects including e-commerce platforms, AI-powered applications, dashboards, and mobile apps. Each project demonstrates different skills and technologies.",
  //     contact:
  //       "You can contact the developer through the contact form in the Contact section of this portfolio. They're open to freelance opportunities, collaborations, and full-time positions.",
  //     services:
  //       "The developer offers web development, UI/UX design, AI integration, and performance optimization services. They focus on creating beautiful, functional digital experiences.",
  //     default:
  //       "I'm an AI assistant for this portfolio website. I can tell you about the developer's skills, experience, projects, and services. What would you like to know?",
  //   }

  //   const lowerQuestion = question.toLowerCase()

  //   if (lowerQuestion.includes("skill") || lowerQuestion.includes("tech")) {
  //     return responses.skills
  //   } else if (lowerQuestion.includes("experience") || lowerQuestion.includes("background")) {
  //     return responses.experience
  //   } else if (lowerQuestion.includes("project") || lowerQuestion.includes("work")) {
  //     return responses.projects
  //   } else if (lowerQuestion.includes("contact") || lowerQuestion.includes("hire")) {
  //     return responses.contact
  //   } else if (lowerQuestion.includes("service") || lowerQuestion.includes("offer")) {
  //     return responses.services
  //   } else {
  //     return responses.default
  //   }
  // }

  return (
    <section id="ai-chat" className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ask Me Anything</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-300">
            Have questions about my skills, projects, or experience? Chat with my AI assistant to learn more!
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className={message.role === "assistant" ? "bg-primary/20 text-primary" : "bg-gray-700"}>
                        {message.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                        <AvatarFallback>{message.role === "assistant" ? "AI" : "You"}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "assistant"
                            ? "bg-gray-800 text-gray-100"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="bg-primary/20 text-primary">
                        <Bot className="h-5 w-5" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-gray-800 text-gray-100">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
                          <div
                            className="h-2 w-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="bg-gray-800 border-gray-700 focus-visible:ring-primary"
                  disabled={isLoading}
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default AiChat
