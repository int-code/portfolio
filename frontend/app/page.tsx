import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import AiChat from "@/components/ai-chat"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <Hero />
      <About />
      <Projects />
      <AiChat />
      <Contact />
    </main>
  )
}
