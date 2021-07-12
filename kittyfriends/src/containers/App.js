import React, { Component } from 'react'
import CardList from '../components/CardList'
import SearchBox from '../components/SearchBox'
import Scroll from '../components/Scroll'
import ErrorBoundry from '../components/ErrorBoundry'

class App extends Component {
  constructor() {
    super()
    this.state = {
      kitties: [],
      searchField: ''
    }
  }

  async componentDidMount() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json()
    this.setState({ kitties: data })
  }

  onSearchChange = (event) => {
    this.setState({ searchField: event.target.value })
  }

  render() {
    const { kitties, searchField } = this.state
    const filteredKitties = kitties.filter((kitty) => {
      return kitty.name.toLowerCase().includes(searchField.toLowerCase())
    })

    return (
      <>
        <div className="max-w-4xl lg:max-w-6xl mx-auto pb-12">
          <div className="flex flex-col justify-center items-center my-6">
            {kitties.length === 0 ? (
              <h1 className="main-title text-5xl text-gray-100">Loading</h1>
            ) : (
              <>
                <h1 className="main-title text-5xl text-gray-100">
                  Kitty Friends
                </h1>
                <SearchBox searchChange={this.onSearchChange} />
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
}

export default App
