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
      shelves: new Map(),
      books: []
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
      this.setState({shelves: SortedMap(shelves)})
    }).catch((error) => {
      console.log(error)
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
            if (shelves.has(id)) {
              const newShelf = shelves.get(id)
              newShelf.books.push(books[index])
              shelves.set(id, newShelf)
            } else if (id !== 'none'){
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
    } else {
      const serverId = Camelize(id)
      book.shelf = serverId
      BooksAPI.update(book, serverId).then(() => {
        // Update shelf where the new book is stored & update the shelf id
        book.shelf = id
        if (shelves.has(id)) {
          const newShelf = shelves.get(id)
          newShelf.books.push(book)
          shelves.set(id, newShelf)

        } else if (id !== 'none'){
          shelves.set(id, {books: [book]})
        }

        // Update state
        this.setState({shelves: SortedMap(shelves)})
      })
    }
  }

  searchBooks = (query, max = 20) => {
    let helper = []
    BooksAPI.search(query, max).then((books) => {
      books.forEach((book, index, books) => {
        if (book.shelf === undefined) {
          books[index].shelf = ProperCase('none')
        } else {
          books[index].shelf = ProperCase(book.shelf)
        }
        helper.push(books[index])
      })
      this.setState({books: helper})
    })
  }

  render() {
    const {shelves, books} = this.state
    return (
      <div className='app'>
        <Route exact path='/' render={() => (
          <ListBooks
            shelves={shelves}
            onControlChange={this.bookControl}
          />
        )}/>
        <Route exact path='/search' render={() => (
          <Search
            shelves={shelves}
            books={books}
            onSearchBooks={this.searchBooks}
            onControlChange={this.bookControl}
          />
        )}/>
      </div>
    )
  }
}

export default BooksApp
