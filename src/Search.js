import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import Books from './Books'

class Search extends Component {
  static propTypes = {
    shelves: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    onSearchBooks: PropTypes.func.isRequired,
    onControlChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      query: ''
    }
  }

  updateQuery = (query) => {
    const {onSearchBooks} = this.props
    this.setState({query: query})
    onSearchBooks(query)
  }

  render() {
    const {query} = this.state
    const {shelves, books, onControlChange} = this.props
    return (
      <div className='search-books'>
        <div className='search-books-bar'>
          <Link className='close-search' to='/'/>
          <div className='search-books-input-wrapper'>
            <input
              type='text'
              placeholder='Search by title or author'
              value={query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />
          </div>
        </div>
        <div className='search-books-results'>
          <Books shelves={shelves} books={books} onControlChange={onControlChange}/>
        </div>
      </div>
    )
  }
}

export default Search
