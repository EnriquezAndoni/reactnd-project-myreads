import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ProperCase from './utils/ProperCase'

class Books extends Component {
  /**
   * @description Define the props needed by the component
   */
  static propTypes = {
    shelves: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    onControlChange: PropTypes.func.isRequired
  }

  /**
   * @description Render the image for each book, it checks if the book has an image
   * @param {object} book - The book that has to be rendered
   * @returns {object} The div with the image if the book contains a thumbnail
   */
  renderThumbnail = (book) => {
    let thumbnail
    if (book.imageLinks !== undefined) {
      thumbnail =
        <div key={book.id}
          className='book-cover'
          style={{width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})`
      }}/>
    }
    return thumbnail
  }

  /**
   * @description Render each option depending of the shelves options
   * So, if the API introduces a new option (shelf) it's going to be rendered
   * @param {object} shelves - The shelves object contains each shelf
   * @returns {object} The option(s) with the new option(s)
   */
  renderControlOptions = (shelves) => {
    let controls = []
    for (const shelf of shelves) {
      const [title] = shelf
      if (title !== 'currentlyReading' && title !== 'wantToRead' && title !== 'read')
        controls.push(<option key={title} value={title}>{ProperCase(title)}</option>)
    }
    return controls
  }

  /**
   * @description Render the authors of the book
   * @param {object} book - The book that has to be rendered
   * @returns {object} The div(s) with the authors
   */
  renderAuthors = (book) => {
    let authors = []
    if (book.authors !== undefined) {
      book.authors.map((author, index) => (
        authors.push(<div key={index} className="book-authors">{author}</div>)
      ))
    }
    return authors
  }

  /**
   * @description Render the books -> the thumbnail, the authors and the options
   */
  render() {
    const {shelves, books, onControlChange} = this.props
    return(
      <ol className='books-grid'>
        {books.map((book) => (
          <li key={book.id}>
            <div className='book'>
              <div className='book-top'>
                {this.renderThumbnail(book)}
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