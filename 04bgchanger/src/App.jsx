import { useState } from 'react'


function App() {
  const [color, setColor] = useState('Green')

  return (
    <div className="relative flex w-full items-center justify-center h-screen duration-200"
    style={{ backgroundColor: color }}>
      <div className="text-black text-6xl p-4">Current Background Color: {color}</div>
    <div className="fixed right-0 flex flex-wrap justify-center bottom-12 inset-x-0 px-2">
      <button className="p-2 m-2 bg-center bg-green-500 rounded-3xl" onClick={() => setColor('Green')}>Green</button>
      <button className="p-2 m-2 bg-center bg-red-500 rounded-3xl" onClick={() => setColor('Red')}>Red</button>
      <button className="p-2 m-2 bg-center bg-blue-500 rounded-3xl" onClick={() => setColor('Blue')}>Blue</button>
      <button className="p-2 m-2 bg-center bg-yellow-500 rounded-3xl" onClick={() => setColor('Yellow')}>Yellow</button>
      <button className="p-2 m-2 bg-center bg-purple-500 rounded-3xl" onClick={() => setColor('Purple')}>Purple</button>
      <button className="p-2 m-2 bg-center bg-orange-500 rounded-3xl" onClick={() => setColor('Orange')}>Orange</button>
    </div>
      
    </div>
  )
}

export default App
