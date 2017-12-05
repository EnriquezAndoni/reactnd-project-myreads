import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ProperCase from './utils/ProperCase'

class ListBooks extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired
  }

  state = {
    shelves: new Map()
  }

  componentWillReceiveProps(newProps) {
    newProps.books.forEach((book, index, books) => {
      const id = ProperCase(book.shelf)
      books[index].shelf = id
      if (!this.state.shelves.has(id)) {
        this.state.shelves.set(id, {books: [book]})
      } else {
        const shelf = this.state.shelves.get(id)
        shelf.books.push(book)
        this.state.shelves.set(id, shelf)
      }
    })
  }

  controlChange = (event, book, last) => {
    let shelves = this.state.shelves
    const id = event.target.value
    if (shelves.has(last)) {
      const shelf = shelves.get(last)
      shelf.books.forEach((storedBook, index, books) => {
        if (book === storedBook) {
          // Update shelf where the new book is stored & update the shelf id
          const newShelf = shelves.get(id)
          books[index].shelf = id
          console.log(id)
          console.log(books[index])
          newShelf.books.push(books[index])
          shelves.set(id, newShelf)

          // Remove from the previous shelf
          shelf.books.splice(index, 1)
          shelves.set(last, {books: shelf.books})

          // Update state
          this.setState({shelves})
        }

      })
    }
  }

  render() {
    const {shelves} = this.state
    return (
      <div className='list-books'>
        <div className='list-books-title'>
          <h1>MyReads</h1>
        </div>
        {this.renderShelves(shelves)}
      </div>
    )
  }

  renderShelves = (shelves) => {
    let paint = []
    for (const shelf of shelves) {
      const [title, object] = shelf
      paint.push(
        <div key={title} className='bookshelf'>
          <h2 className='book-shelf-title'>{title}</h2>
          <div className='bookshelf-books'>
            <ol className='books-grid'>
              {object.books.map((book) => (
                <li key={book.id}>
                  <div className='book'>
                    <div className='book-top'>
                      <div className='book-cover' style={{
                        width: 128,
                        height: 193,
                        backgroundImage: `url(${book.imageLinks.thumbnail})`
                      }}/>
                      <div className='book-shelf-changer'>
                        <select
                          id='control'
                          onChange={(event) => this.controlChange(event, book, book.shelf)}
                          value={book.shelf}>
                          <option value="none" disabled>Move to...</option>
                          {this.renderControlOptions(shelves)}
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>
                    <div className="book-title">{book.title}</div>
                    {book.authors.map((author, index) => (
                      <div key={index} className="book-authors">{author}</div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )
    }
    return paint
  }

  renderControlOptions = (shelves) => {
    let controls = []
    for (const shelf of shelves) {
      const [title] = shelf
      controls.push(<option key={title} value={title}>{title}</option>)
    }
    return controls
  }
}

export default ListBooks
