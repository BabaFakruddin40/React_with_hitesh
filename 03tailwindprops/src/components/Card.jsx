import React from 'react'
import juliaImg from '../assets/julia.jpg'

const Card = ({ imgSrc, name, title, quote }) => {
  return (
  <figure className="bg-slate-100 rounded-xl p-8 text-center dark:bg-slate-800">
      <img
        className="block w-24 h-24 mx-auto rounded-full object-cover md:w-48 md:h-48"
        src={imgSrc}
        alt={name}
      />

      <div className="pt-6 space-y-4">
        <figcaption className="font-medium">
          <div className="text-sky-500 dark:text-sky-400">{name}</div>
          <div className="text-slate-700 dark:text-slate-500">{title}</div>
        </figcaption>

        <blockquote>
          <p className="text-lg font-medium">{quote}</p>
        </blockquote>
      </div>
    </figure>
  )
}

export default Card
