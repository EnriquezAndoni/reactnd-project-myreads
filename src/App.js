import React from 'react'
import {Route} from 'react-router-dom'
import ListBooks from './ListBooks'
import Search from './Search'
import * as BooksAPI from './BooksAPI'
import SortedMap from './utils/SortMap'
import './App.css'

class BooksApp extends React.Component {
  /**
   * @description Initialize the state
   * @constructor
   */
  constructor(props) {
    super(props)
    this.state = {
      shelves: new Map(),
      books: []
    }
  }

  /**
   * @description When the component is mounted it retrieves the books
   */
  componentDidMount() {
    this.retrieveBooks()
  }

  /**
   * @description Retrieves the books calling BooksApi getAll()
   * Updates the state with the retrieved books
   */
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

  /**
   * @description Each book has a control, this function updates the control
   * @param {object} event - The event that fires the update action -> Select
   * @param {object} book - The book that has to be updated
   * @param {string} last - The control before firing the update action
   */
  bookControl = (event, book, last) => {
    const shelves = this.state.shelves
    const id = event.target.value
    if (shelves.has(last)) {
      const shelf = shelves.get(last)
      shelf.books.forEach((storedBook, index, books) => {
        if (book.id === storedBook.id) {
          books[index].shelf = id
          this.updateBooksState(id, book)
          this.updateShelf(book, id, shelf, index, last)
        }
      })
    } else if (last === 'none') {
      book.shelf = id
      this.updateShelf(book, id)
    }
  }

  /**
   * @description Update the shelve state, updating the changed book
   * @param {object} book - The book that has to be updated
   * @param {string} id - The shelf id
   * @param {object} shelf - The shelf that has to be updated
   * @param {int} index - The position of the book in the shelf
   * @param {string} last - The control before firing the update action
   */
  updateShelf = (book, id, shelf = null, index = 0, last = '') => {
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

  /**
   * @description Update the books state, updating the changed book
   * @param {string} id - The shelf id
   * @param {object} book - The book that has to be updated
   */
  updateBooksState = (id, book) => {
    const books = this.state.books
    if (books.length > 0) {
      books.forEach((storedBook, index, booksHelper) => {
        if (book.id === storedBook.id) {
          booksHelper[index].shelf = id
          this.setState({books: booksHelper})
        }
      })
    }
  }

  /**
   * @description Search the book with the BooksAPI and update the state books
   * @param {string} query - The text introduced in the search input
   * @param {int} max - The total of books that are going to be retrieved
   */
  searchBooks = (query, max = 20) => {
    let helper = []
    if (query !== '') {
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
  }

  /**
   * @description Displays the components depending on the path
   */
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
