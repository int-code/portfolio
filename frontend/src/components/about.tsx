"use client"

import { motion } from "framer-motion"
import { Code, Palette, Lightbulb, Rocket } from "lucide-react"

export default function About() {
  const skills = [
    { name: "Python", level: 95 },
    { name: "FastAPI", level: 90 },
    { name: "PostgreSQL", level: 85 },
    { name: "JavaScript", level: 80 },
    { name: "Docker", level: 80 },
    { name: "Machine Learning", level: 75 },
    { name: "Git & GitHub Workflows", level: 75 },
    { name: "Azure", level: 70 },
    { name: "MLflow", level: 65 },
  ]

  const strengths = [
    {
      // icon: <YourIconComponentHere />,
      title: "Full-Stack Development",
      description: "Experience across backend and frontend with a focus on FastAPI, Postgres, and clean, scalable architecture.",
    },
    {
      // icon: <YourIconComponentHere />,
      title: "Machine Learning",
      description: "Building smart, data-driven solutions while actively sharpening ML engineering skills.",
    },
    {
      // icon: <YourIconComponentHere />,
      title: "API Design",
      description: "Designing robust REST APIs and integrating complex workflows with clean documentation and structure.",
    },
    {
      // icon: <YourIconComponentHere />,
      title: "Rapid Prototyping",
      description: "From idea to MVP—fast. Efficient at building, testing, and iterating across the stack.",
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
          Hey, I’m Pubali — a full-stack developer with a thing for clean code, 
          smart systems, and making tech actually useful. I’ve worked across the stack, 
          from crafting solid APIs with FastAPI to designing smooth user experiences. 
          Lately, I’ve been diving deeper into machine learning, sharpening my skills to 
          build solutions that aren’t just functional, but intelligent. Whether it’s a 
          side project or a production-grade app, I’m all about thoughtful design, efficient 
          architecture, and solving problems that matter.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 mb-20 mx-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold p-4">My Skills</h3>
            <div className="space-y-6 p-4">
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
            <h3 className="text-xl font-bold mb-6 p-4">My Journey</h3>
            <div className="space-y-4 text-gray-300">
              <p className="text-justify">
                Starting out with curiosity and a love for problem-solving, I’ve built my way from college hackathons to shipping full-stack features at startups. Along the way, I’ve worked with technologies like FastAPI, Postgres, and modern JavaScript frameworks to develop everything from survey platforms to BLE-based detection systems.
              </p>
              <p className="text-justify">
                I specialize in building scalable, clean, and efficient applications—whether it’s backend-heavy systems or full-stack workflows. Recently, I’ve been sharpening my skills in machine learning engineering, combining clean code with smart data to create intelligent, real-world solutions.
              </p>
              <p className="text-justify">
                Outside of work, I enjoy geeking out over psychology and tabletop games, exploring niche tech ideas, and dreaming up side projects that (sometimes) make it to GitHub.
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
          What I Bring to the Table
        </motion.h3>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {strengths.map((strength, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-primary transition-colors"
              variants={item}
            >
              {/* <div className="mb-4">{strength.icon}</div> */}
              <h4 className="text-xl font-semibold mb-2">{strength.title}</h4>
              <p className="text-gray-400">{strength.description}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
