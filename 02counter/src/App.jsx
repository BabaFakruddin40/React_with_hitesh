import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  
  function Addvalue() {
      //if (count < 20) {
        setCount(Math.min(count + 1, 20));
      //}      
    }

    function Subtractvalue() {
      //if (count > 0) {
        setCount(Math.max(count - 1, 0) );
      //}
    }

  return (
    <>
    <h1>Counter App</h1>
     <h1>Count: {count}</h1>
     <button onClick={Addvalue}>Addvalue: {count}</button>
     <br />
     <button onClick={Subtractvalue}>Subtractvalue: {count}</button>
     <p>Footer content here: {count}</p>
    </>
  )
}

export default App
