import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Helmet>
        <title>Akito Ando - Portfolio</title>
        <meta name="description" content="Akito Ando - フルスタック開発者のポートフォリオサイト" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="preconnect" href="https://api.github.com" />
      </Helmet>
      
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App