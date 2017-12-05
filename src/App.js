import React from 'react'
import ListBooks from './ListBooks'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books => {
      this.setState({books})
    }))
  }


  render() {
    return(
      <div className='app'>
        <ListBooks books={this.state.books}/>
      </div>
    )
  }
}

export default BooksApp
