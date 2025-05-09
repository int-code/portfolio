import { Outlet } from "react-router-dom"
import Navbar from "./navbar"
import Footer from "./footer"

export default function Layout() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="absolute inset-0 grid-background"></div>
      <Navbar />
      <div className="relative">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
