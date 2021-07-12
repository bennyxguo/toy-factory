import React, { useState, useEffect } from 'react'
import CardList from '../components/CardList'
import SearchBox from '../components/SearchBox'
import Scroll from '../components/Scroll'
import ErrorBoundry from '../components/ErrorBoundry'

const App = () => {
  // 1st var = state
  // 2nd var = function use to update the state
  const [kitties, setKitties] = useState([])
  const [searchField, setSearchField] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = await response.json()
      setKitties(data)
    }
    fetchData()
  }, [])

  const onSearchChange = (event) => {
    setSearchField(event.target.value)
  }

  const filteredKitties = kitties.filter((kitty) => {
    return kitty.name.toLowerCase().includes(searchField.toLowerCase())
  })

  return (
    <>
      <div className="max-w-4xl lg:max-w-6xl mx-auto pb-12">
        <div className="flex flex-col justify-center items-center my-6">
          {kitties.length === 0 ? (
            <h1 className="main-title text-5xl text-gray-100">Loading...</h1>
          ) : (
            <>
              <h1 className="main-title text-5xl text-gray-100">
                Kitty Friends
              </h1>
              <SearchBox searchChange={onSearchChange} />
            </>
          )}
        </div>
        <Scroll>
          <ErrorBoundry>
            <CardList data={filteredKitties} />
          </ErrorBoundry>
        </Scroll>
      </div>
    </>
  )
}

export default App
