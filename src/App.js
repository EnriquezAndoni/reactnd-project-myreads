import React from 'react'
import {Route} from 'react-router-dom'
import ListBooks from './ListBooks'
import Search from './Search'
import * as BooksAPI from './BooksAPI'
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
        const id = books[index].shelf
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
    })
  }

  bookControl = (event, book, last) => {
    const shelves = this.state.shelves
    const id = event.target.value

    if (shelves.has(last)) {
      const shelf = shelves.get(last)
      shelf.books.forEach((storedBook, index, books) => {
        if (book.id === storedBook.id) {
          books[index].shelf = id
          // Actualizar el state de books
          // Peta al cambiar dos veces en el finder
          this.updateBooksState(id, book)
          this.updateBook(book, id, shelf, index, last)
        }
      })
    } else if (last === 'none') {
      book.shelf = id
      this.updateBook(book, id)
    }
  }

  updateBook = (book, id, shelf = null, index = null, last = null) => {
    const shelves = this.state.shelves
    BooksAPI.update(book, id).then(() => {
      if (shelves.has(id)) {
        const newShelf = shelves.get(id)
        newShelf.books.push(book)
        shelves.set(id, newShelf)
      } else if (id !== 'none') {
        shelves.set(id, {books: [book]})
      }

      if (shelf !== null) {
        shelf.books.splice(index, 1)
        if (shelf.books.length !== 0) {
          shelves.set(last, {books: shelf.books})
        } else {
          shelves.delete(last)
        }
      }

      this.setState({shelves: SortedMap(shelves)})
    })
  }

  updateBooksState = (shelfId, compareBook) => {
    const books  = this.state.books
    if (books.length > 0) {
      books.forEach((storedBook, index, booksHelper) => {
        if (storedBook.id === compareBook.id) {
          booksHelper[index].shelf = shelfId
          this.setState({books: booksHelper})
        }
      })
    }
  }

  searchBooks = (query, max = 20) => {
    let helper = []
    BooksAPI.search(query, max).then((books) => {
      books.forEach((book) => {
        BooksAPI.get(book.id).then((book) => {
          helper.push(book)
        }).then(() => {
          this.setState({books: helper})
        })
      })
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
