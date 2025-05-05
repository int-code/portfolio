import Hero from "./hero"
import About from "./about"
import Projects from "./projects"
import AiChat from "./ai-chat"
import Contact from "./contact"

export default function Home() {
  return (
    <main className="min-h-screen w-screen bg-gray-950 text-gray-100">
      <Hero />
      <About />
      <Projects />
      <AiChat />
      <Contact />
    </main>
  )
}
