"use client"

import { motion } from "framer-motion"
import { Code, Palette, Lightbulb, Rocket } from "lucide-react"

export default function About() {
  const skills = [
    { name: "React", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "TypeScript", level: 80 },
    { name: "Node.js", level: 75 },
    { name: "UI/UX Design", level: 70 },
    { name: "AI Integration", level: 65 },
  ]

  const services = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Web Development",
      description: "Building responsive, performant web applications with modern frameworks and technologies.",
    },
    {
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: "UI/UX Design",
      description: "Creating intuitive, beautiful interfaces that provide exceptional user experiences.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "AI Integration",
      description: "Implementing AI-powered features to enhance applications with intelligent capabilities.",
    },
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "Performance Optimization",
      description: "Improving application speed and efficiency for better user experience and SEO.",
    },
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
    <section id="about" className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-300">
            I'm a passionate developer and designer with a focus on creating engaging digital experiences. With
            expertise in modern web technologies and AI integration, I build solutions that are both beautiful and
            functional.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">My Skills</h3>
            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">My Journey</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                With over 5 years of experience in web development, I've worked on a variety of projects from small
                business websites to complex web applications. My passion for technology and design drives me to
                continuously learn and improve.
              </p>
              <p>
                I specialize in creating responsive, accessible, and performant web applications using React, Next.js,
                and TypeScript. I'm also experienced in integrating AI capabilities to enhance user experiences.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects,
                or sharing my knowledge through blog posts and community events.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.h3
          className="text-2xl font-bold mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Services I Offer
        </motion.h3>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-primary transition-colors"
              variants={item}
            >
              <div className="mb-4">{service.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
