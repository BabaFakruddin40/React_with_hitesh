import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import juliaImg from './assets/julia.jpg'
import babaImg from './assets/baba.jpg'
import Card from './components/Card'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-8 bg-amber-700 text-black p-4 rounded-lg">Welcome to React with Tailwind CSS</h1>
      <Card name="Baba Fakruddin" title="Software Engineer" quote="Tailwind CSS is amazing!" imgSrc={babaImg} />
      <Card name="Julia Roberts" title="Product Manager" quote="Tailwind CSS is fantastic!" imgSrc={juliaImg} />
    </>
  )
}

export default App
