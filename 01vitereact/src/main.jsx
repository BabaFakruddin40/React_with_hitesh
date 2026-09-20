import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

function MyApp() {
  return (
    <div>
      <h1>Hello, Custom App React - Baba!</h1>
    </div>
  );
}

const ReactElement = {
    type: 'a',
    props: {
        href: 'https://google.com',
        target: '_blank'
    },
        children: 'Click me to visit Google'
}

const anotherElement = (
    <a href="https://google.com" target="_blank">
        Click me to visit Google!!!!
    </a>
)

const anotherReactElement = React.createElement(
    'a',
    {
        href: 'https://google.com',
        target: '_blank'
    },
    'visit Google'
);

createRoot(document.getElementById('root')).render(
   <StrictMode>
    {/* <MyApp />
    <App /> */}
    {anotherElement}
    {/* {ReactElement}  */}
    {anotherReactElement}
 </StrictMode>,
)
