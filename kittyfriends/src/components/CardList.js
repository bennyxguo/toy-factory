import React from 'react'
import Card from './Card'

const CardList = ({ data }) => {
  return (
    <div className="grid grid-cols-4 justify-center gap-4">
      {data.map(({ id, name, email }) => {
        return <Card id={id} name={name} email={email} key={id} />
      })}
    </div>
  )
}

export default CardList
