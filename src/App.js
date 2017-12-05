import React from 'react'
import {Route} from 'react-router-dom'
import ListBooks from './ListBooks'
import Search from './Search'
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

  updateBookControl = () => {
    this.setState((prevState) => ({
      // books: prevState.books.filter((b) => b.
    }))
  }

  removeContact = (contact) => {
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter((c) => c.id !== contact.id)
    }))

    ContactsAPI.remove(contact)
  }

  render() {
    return(
      <div className='app'>
        <Route exact path='/' render={() => (
          <ListBooks books={this.state.books}/>
        )}/>
        <Route exact path='/search' render={() => (
          <Search/>
        )}/>
      </div>
    )
  }
}

export default BooksApp
