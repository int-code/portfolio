"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Send, Bot, User } from "lucide-react"


type Message = {
  role: "user" | "assistant"
  content: string
}

export default function AiChat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Your script logic here
    console.log("Script ran!");

    // Example: dynamically load an external script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // In a real implementation, you would use your API key
      // This is a mock implementation for demonstration
      const response = await mockAiResponse(input)

      // For a real implementation with OpenAI:
      // const { text } = await generateText({
      //   model: openai('gpt-4o'),
      //   prompt: `You are an AI assistant for a portfolio website. Answer questions about the developer's skills,
      //   projects, and experience. The developer specializes in React, Next.js, and AI integration.
      //
      //   User question: ${input}`
      // })
      let response_text = await response.json()
      response_text = response_text.response
      setMessages((prev) => [...prev, { role: "assistant", content: response_text }])
      
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I couldn't process your request. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Mock AI response function for demonstration
  const mockAiResponse = async (question: string): Promise<Response> => {

    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        text: question,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    // const lowerQuestion = question.toLowerCase()

    // if (lowerQuestion.includes("skill") || lowerQuestion.includes("tech")) {
    //   return responses.skills
    // } else if (lowerQuestion.includes("experience") || lowerQuestion.includes("background")) {
    //   return responses.experience
    // } else if (lowerQuestion.includes("project") || lowerQuestion.includes("work")) {
    //   return responses.projects
    // } else if (lowerQuestion.includes("contact") || lowerQuestion.includes("hire")) {
    //   return responses.contact
    // } else if (lowerQuestion.includes("service") || lowerQuestion.includes("offer")) {
    //   return responses.services
    // } else {
    //   return responses.default
    // }

    return response
  }

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
                        } class="note" markdown="1"`}
                        dangerouslySetInnerHTML={{__html: message.content }}
                      >
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
