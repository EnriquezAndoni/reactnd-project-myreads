import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'


class ListBooks extends Component {
  static propTypes = {
    shelves: PropTypes.object.isRequired,
    onControlChange: PropTypes.func.isRequired
  }

  render() {
    let {shelves, onControlChange} = this.props
    return (
      <div className='list-books'>
        <div className='list-books-title'>
          <h1>MyReads</h1>
        </div>
        {this.renderShelves(shelves, onControlChange)}
      </div>
    )
  }

  renderShelves = (shelves, onControlChange) => {
    let paint = []
    for (const shelf of shelves) {
      console.log(shelf)
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
                          onChange={(event) => onControlChange(event, book, book.shelf)}
                          value={book.shelf}>
                          <option value="none" disabled>Move to...</option>
                          <option value="Currently Reading">Currently Reading</option>
                          <option value="Want To Read">Want To Read</option>
                          <option value="Read">Read</option>
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
          <div className="open-search">
            <Link to='/search'/>
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
      if (title !== 'Currently Reading' && title !== 'Want To Read' && title !== 'Read') controls.push(<option key={title} value={title}>{title}</option>)
    }
    return controls
  }
}

export default ListBooks
