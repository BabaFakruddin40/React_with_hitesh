import { useState, useCallback, useEffect, useRef } from 'react'

// import './App.css'

function App() {
  const [length, setLength] = useState(8);
  const [NumberAllowed, setNumberAllowed] = useState(false);
  const [charactersAllowed, setCharactersAllowed] = useState(false);
  const [specialCharactersAllowed, setSpecialCharactersAllowed] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const passwordRef = useRef(null);
  // const [charactersAllowed, setCharactersAllowed] = useState(true)
  // Function to generate a new password based on the selected options
  const generatePassword = useCallback(()=>{
    let chars = '';
    if (charactersAllowed) chars += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (NumberAllowed) chars += '0123456789';
    if (specialCharactersAllowed) chars += '!@#$%^&*()_+[]{}|;:,.<>?';
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  }, [length,NumberAllowed,charactersAllowed,specialCharactersAllowed])
    
  
  const handleLengthChange = (e) => setLength(Number(e.target.value));
  const handleNumberAllowedChange = (e) => setNumberAllowed(e.target.checked);
  const handleCharactersAllowedChange = (e) => setCharactersAllowed(e.target.checked);
  const handleSpecialCharactersAllowedChange = (e) => setSpecialCharactersAllowed(e.target.checked);
  const handleGeneratePassword = () => generatePassword();

  const handleCopyPassword = useCallback(async () => {
  if (!password) return

  passwordRef.current?.select()
  await navigator.clipboard.writeText(password)

  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}, [password])

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);


  return (
    <>
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-800">
        <h1 className='text-4xl font-bold text-center text-white mt-8 mb-8 my-3'>Password Generator</h1>
        <div className="flex overflow-hidden mb-4 bg-white rounded-lg shadow-md">
          <input
            ref={passwordRef}
            type="text"
            value={password}
            readOnly
            className="outline-none w-full py-1 px-3"
            placeholder="Generated Password"
          />

          {/* <button
            type="button"
            onClick={handleGeneratePassword}
            className="bg-green-600 text-white px-3 py-2"
          >
            Generate
          </button> */}

          <button
            type="button"
            onClick={handleCopyPassword}
            disabled={!password}
            className="bg-blue-500 text-white px-3 py-2 disabled:opacity-50"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="text-center">
          {/* <input
            type="text"
            value={password}
            readOnly
            className="outline-none w-full py-1 px-3"
            placeholder="Generated Password"
          /> */}

          <button
            type="button"
            onClick={handleGeneratePassword}
            className="bg-green-600 text-white px-3 py-2"
          >
            Generate
          </button>
        </div>
        <div className='flex items-center gap-x-1 text-orange-500 mt-4'>
          <div>
            <input
              type="range"
              id="Length"
              min="4"
              max="32"
              value={length}
              onChange={handleLengthChange}
              className='cursor-pointer'
            />
            <label htmlFor='Length'>
              Length: {length}
            </label>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-orange-500">
              <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={NumberAllowed}
                onChange={handleNumberAllowedChange}
                className='cursor-pointer'
              />
              Numbers</label>
              <label className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={charactersAllowed}
                onChange={handleCharactersAllowedChange}
                className='cursor-pointer'
                />
                Characters
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={specialCharactersAllowed}
                  onChange={handleSpecialCharactersAllowedChange}
                  className='cursor-pointer'
                />
                Special Characters
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}

export default App
