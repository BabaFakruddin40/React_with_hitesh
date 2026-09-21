import React from 'react'
import juliaImg from '../assets/julia.jpg'

const Card = ({ imgSrc, name, title, quote }) => {
  return (
    <figure className="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
  <img className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src={imgSrc} alt="" width="384" height="512"></img>
  <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
    <blockquote>
      <p className="text-lg font-medium">
        {quote}
      </p>
    </blockquote>
    <figcaption className="font-medium">
      <div className="text-sky-500 dark:text-sky-400">
        {name}
      </div>
      <div className="text-slate-700 dark:text-slate-500">
        {title}
      </div>
    </figcaption>
  </div>
</figure>
  )
}

export default Card
