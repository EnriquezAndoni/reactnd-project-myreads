import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import Books from './Books'

class Search extends Component {
  /**
   * @description Define the props needed by the component
   */
  static propTypes = {
    shelves: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    onSearchBooks: PropTypes.func.isRequired,
    onControlChange: PropTypes.func.isRequired
  }

  /**
   * @description Initialize the state
   * @constructor
   */
  constructor(props) {
    super(props)
    this.state = {
      query: ''
    }
  }

  /**
   * @description Update the query state
   * The setTimeout can be deleted if we want to perform a call every time the query changes
   * @param {string} query - The text introduced in the search input
   */
  updateQuery = (query) => {
    const {onSearchBooks} = this.props
    this.setState({query: query})
    setTimeout(() => {
      if (this.state.query === query) {
        onSearchBooks(query)
      }
    }, 200)
  }

  /**
   * @description Render the search input and the books that are search
   */
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
