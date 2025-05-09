import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import Admin from "./pages/Admin"
import Layout from "./components/Layout"
import Home from "./components/Home"
import React from "react"
function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  )
}
export default App
