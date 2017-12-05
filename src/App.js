import React from 'react'
import {Route} from 'react-router-dom'
import ListBooks from './ListBooks'
import Search from './Search'
import * as BooksAPI from './BooksAPI'
import ProperCase from './utils/ProperCase'
import Camelize from './utils/Camelize'
import SortedMap from './utils/SortMap'
import './App.css'

class BooksApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shelves: new Map()
    }
  }

  componentDidMount() {
    this.retrieveBooks()
  }

  retrieveBooks() {
    const shelves = this.state.shelves
    BooksAPI.getAll().then((books => (
      books.forEach((book, index, books) => {
        const id = ProperCase(book.shelf)
        books[index].shelf = id
        if (!shelves.has(id)) {
          shelves.set(id, {books: [book]})
        } else {
          const shelf = shelves.get(id)
          shelf.books.push(book)
          shelves.set(id, shelf)
        }
      })
    ))).then(() => {
      this.setState({shelves})
    })
  }

  bookControl = (event, book, last) => {
    const shelves = this.state.shelves
    const id = event.target.value
    if (shelves.has(last)) {
      const shelf = shelves.get(last)
      shelf.books.forEach((storedBook, index, books) => {
        if (book === storedBook) {
          // Update the server
          const serverId = Camelize(id)
          books[index].shelf = serverId
          BooksAPI.update(books[index], serverId).then(() => {
            // Update shelf where the new book is stored & update the shelf id
            books[index].shelf = id
            if (id !== 'none' && shelves.has(id)) {
              const newShelf = shelves.get(id)
              newShelf.books.push(books[index])
              shelves.set(id, newShelf)
            } else {
              shelves.set(id, {books: [books[index]]})
            }

            // Remove from the previous shelf
            shelf.books.splice(index, 1)
            if (shelf.books.length !== 0) {
              shelves.set(last, {books: shelf.books})
            } else {
              shelves.delete(last)
            }

            // Update state
            this.setState({shelves: SortedMap(shelves)})
          })
        }
      })
    }
  }

  render() {
    const {shelves} = this.state
    console.log(shelves)
    return (
      <div className='app'>
        <Route exact path='/' render={() => (
          <ListBooks
            shelves={shelves}
            onControlChange={this.bookControl}
          />
        )}/>
        <Route exact path='/search' render={() => (
          <Search/>
        )}/>
      </div>
    )
  }
}

export default BooksApp
