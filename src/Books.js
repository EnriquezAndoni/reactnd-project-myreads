import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ProperCase from './utils/ProperCase'

class Books extends Component {
  static propTypes = {
    shelves: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    onControlChange: PropTypes.func.isRequired
  }

  renderControlOptions = (shelves) => {
    let controls = []
    for (const shelf of shelves) {
      const [title] = shelf
      if (title !== 'currentlyReading' && title !== 'wantToRead' && title !== 'read')
        controls.push(<option key={title} value={title}>{ProperCase(title)}</option>)
    }
    return controls
  }

  renderAuthors = (book) => {
    let authors = []
    if (book.authors !== undefined) {
      book.authors.map((author, index) => (
        authors.push(<div key={index} className="book-authors">{author}</div>)
      ))
    }
    return authors
  }

  render() {
    const {shelves, books, onControlChange} = this.props
    return(
      <ol className='books-grid'>
        {books.map((book) => (
          <li key={book.id}>
            <div className='book'>
              <div className='book-top'>
                <div className='book-cover' style={{width: 128, height: 193,
                  backgroundImage: `url(${book.imageLinks.thumbnail})`
                }}/>
                <div className='book-shelf-changer'>
                  <select
                    id='control'
                    onChange={(event) => onControlChange(event, book, book.shelf)}
                    value={book.shelf}>
                    <option disabled>Move to...</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="read">Read</option>
                    <option value="wantToRead">Want To Read</option>
                    {this.renderControlOptions(shelves)}
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <div className="book-title">{book.title}</div>
              {this.renderAuthors(book)}
            </div>
          </li>
        ))}
      </ol>
    )
  }
}

export default Books