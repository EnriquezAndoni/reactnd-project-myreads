import React, {Component} from 'react'
import PropTypes from 'prop-types'

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
      if (title !== 'Currently Reading' && title !== 'Want To Read' && title !== 'Read') controls.push(<option key={title} value={title}>{title}</option>)
    }
    return controls
  }

  render() {
    const {shelves, books, onControlChange} = this.props
    return(
      <ol className='books-grid'>
        {books.map((book) => (
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
                    onChange={(event) => onControlChange(event, book, book.shelf)}
                    value={book.shelf}>
                    <option value="none" disabled>Move to...</option>
                    <option value="Currently Reading">Currently Reading</option>
                    <option value="Want To Read">Want To Read</option>
                    <option value="Read">Read</option>
                    {this.renderControlOptions(shelves)}
                    <option value="None">None</option>
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
    )
  }
}

export default Books