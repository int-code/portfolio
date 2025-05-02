import Hero from "../components/Hero"
import About from "../components/About"
import Projects from "../components/Projects"
import AiChat from "../components/AiChat"
import Contact from "../components/Contact"

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
