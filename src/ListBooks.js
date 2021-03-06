import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import Books from './Books'
import ProperCase from './utils/ProperCase'

class ListBooks extends Component {
  /**
   * @description Define the props needed by the component
   */
  static propTypes = {
    shelves: PropTypes.object.isRequired,
    onControlChange: PropTypes.func.isRequired
  }

  /**
   * @description Render each shelf
   * @param {object} shelves - The shelves object contains each shelf
   * @param {function} onControlChange - The function that changes the selected option and updates the state
   * @returns {object} the shelf rendered
   */
  renderShelves = (shelves, onControlChange) => {
    let paint = []
    for (const shelf of shelves) {
      const [title, object] = shelf
      paint.push(
        <div key={title} className='bookshelf'>
          <h2 className='book-shelf-title'>{ProperCase(title)}</h2>
          <div className='bookshelf-books'>
            <Books shelves={shelves} books={object.books} onControlChange={onControlChange}/>
          </div>
          <div className="open-search">
            <Link to='/search'/>
          </div>
        </div>
      )
    }
    return paint
  }

  /**
   * @description Render the main page
   */
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
}

export default ListBooks
