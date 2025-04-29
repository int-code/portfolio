"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all")

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A modern e-commerce platform built with Next.js and Stripe integration.",
      image: "/placeholder.svg?height=600&width=800",
      category: "web",
      technologies: ["Next.js", "React", "Stripe", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 2,
      title: "AI Content Generator",
      description: "An AI-powered application that generates content based on user prompts.",
      image: "/placeholder.svg?height=600&width=800",
      category: "ai",
      technologies: ["React", "OpenAI API", "Node.js", "Express"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 3,
      title: "Portfolio Dashboard",
      description: "A dashboard for tracking and visualizing investment portfolio performance.",
      image: "/placeholder.svg?height=600&width=800",
      category: "web",
      technologies: ["React", "D3.js", "Firebase", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 4,
      title: "Smart Home App",
      description: "A mobile app for controlling smart home devices with voice commands.",
      image: "/placeholder.svg?height=600&width=800",
      category: "mobile",
      technologies: ["React Native", "Redux", "Firebase", "IoT Integration"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 5,
      title: "AI Image Generator",
      description: "An application that generates images based on text descriptions using AI.",
      image: "/placeholder.svg?height=600&width=800",
      category: "ai",
      technologies: ["Next.js", "DALL-E API", "Vercel AI SDK", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 6,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates.",
      image: "/placeholder.svg?height=600&width=800",
      category: "web",
      technologies: ["React", "Socket.io", "MongoDB", "Express"],
      demoUrl: "#",
      githubUrl: "#",
    },
  ]

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter)

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "ai", label: "AI Projects" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section id="projects" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-300">
            Explore my recent projects showcasing my skills in web development, mobile apps, and AI integration.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className={activeFilter === filter.id ? "bg-primary" : "border-primary text-primary hover:bg-primary/10"}
            >
              {filter.label}
            </Button>
          ))}
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-primary transition-all duration-300 group"
              variants={item}
              whileHover={{ y: -10 }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <div className="flex gap-4">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </Button>
                    </a>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
