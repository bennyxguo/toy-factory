import React from 'react'

const Card = ({ name, email, id }) => {
  return (
    <div className="p-5 rounded-lg shadow-lg transition-transform hover:scale-110 bg-gray-800 text-gray-400">
      <img
        src={`https://robohash.org/${id}?set=set4&size=200x200`}
        alt="kitty"
      />
      <div className="flex flex-col items-center">
        <h2 className="pt-2 font-bold text-xl">{name}</h2>
        <p>{email}</p>
      </div>
    </div>
  )
}

export default Card
