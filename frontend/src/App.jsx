import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import Layout from "./components/Layout"
import Home from "./pages/Home"
require('dotenv').config()
function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  )
}

export default App
