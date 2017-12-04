import React, {Component} from 'react'
import PropTypes from 'prop-types'

class ListBooks extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired
  }

  state = {
    shelves: []
  }

  componentWillReceiveProps(newProps) {
    let shelves = [
      {title: 'Currently Reading', books: []},
      {title: 'Want to Read', books: []},
      {title: 'Read', books: []},
    ]

    for (const book of newProps.books) {

      switch (book.shelf) {
        case 'currentlyReading':
          shelves[0].books.push(book)
          break

        case 'wantToRead':
          shelves[1].books.push(book)
          break

        case 'read':
          shelves[2].books.push(book)
          break

        default:
          break
      }
    }

    this.setState({shelves})
  }

  render() {
    const {shelves} = this.state
    console.log(shelves)
    return (
      <div className='list-books'>
        <div className='list-books-title'>
          <h1>MyReads</h1>
        </div>
        {shelves.map((shelf) => (
          <div key={shelf.title} className='bookshelf'>
            <h2 className='book-shelf-title'>{shelf.title}</h2>
            <div className='bookshelf-books'>
              <ol className='books-grid'>
                {shelf.books.map((book) => (
                  <li key={book.id}>
                    <div className='book'>
                      <div className='book-top'>
                        <div className='book-cover' style={{
                          width: 128,
                          height: 193,
                          backgroundImage: `url(${book.imageLinks.thumbnail})`
                        }}/>
                        <div className='book-shelf-changer'>
                          <select>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
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
        ))}
      </div>
    )
  }
}

export default ListBooks