import { useState, useEffect } from "react";
import personService from "./services/persons"

const Notification = ({ props }) => {
  const { message, color } = props
  //console.log(color);

  const style = {
    color: `${color}`,
    fontSize: 16,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "lightgray",
    marginBottom: 10
  }
  //console.log(style);
  if (message === null) {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

const Display = ({ persons, searchTerm, handleRemove }) => {
  let personList = []
  if (searchTerm !== '') {
    personList = persons.filter(person =>
      person.name.toLowerCase().indexOf(searchTerm) !== -1)
  } else {
    personList = persons
  }

  return (
    personList.map(person =>
      <p key={person.name}>
        {person.name} {person.number + " "}
        <button onClick={() => handleRemove(person.id, person.name)}>remove</button>
      </p>
    )
  )
}

const Search = ({ onChange, value }) => {
  return (
    <div>filter shown with{' '}
      <input onChange={onChange} value={value} />
    </div>
  )
}

const Input = ({ text, onChange, value }) => {
  return (
    <div>
      {text}: <input onChange={onChange} value={value} />
    </div>
  )
}

const PersonForm = ({ props }) => {
  const { handleNewName, newName, handlePhoneNumber, phoneNumber, handleClick } = props
  return (
    <form>
      <Input text='name' onChange={handleNewName} value={newName} />
      <Input text='number' onChange={handlePhoneNumber} value={phoneNumber} />
      <div>
        <button type="submit" onClick={handleClick}>add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState({ message: null, color: null })

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        console.log("getAll called");
        setPersons(response)
      })
  }, [])

  const handleClick = (event) => {
    event.preventDefault()
    const contact = persons.filter(person => {
      return person.name.toLowerCase() === newName.toLowerCase()
    })
    if (contact.length !== 0) {
      const newContact = { ...contact[0], number: phoneNumber }
      const confirm = window.confirm(
        `${newContact.name} is already added to phonebook,` +
        `replace the old number with a new one?`)
      if (confirm) {
        personService
          .update(newContact.id, newContact)
          .then(response => {
            setMessage({
              message: `Contact "${newContact.name}" updated succesfully`,
              color: "green"
            })
            setTimeout(() => {
              setMessage({ message: null, color: null })
            }, 5000);
            setPersons(persons.map(person =>
              person.id === newContact.id ? newContact : person
            ))
          })
          .catch(error => {
            setPersons(persons.filter(person => person.id !== newContact.id))
            setMessage({
              message: `Error: "${newContact.name}" has already been removed from server`,
              color: "red"
            })
            setTimeout(() => {
              setMessage({ message: null, color: null })
            }, 5000);
          })
      }
    } else {
      const newContact = {
        name: newName,
        number: phoneNumber
      }
      personService
        .create(newContact)
        .then(response => {
          setMessage({
            message: `New contact "${newContact.name}" created succesfully`,
            color: "green"
          })
          setTimeout(() => {
            setMessage({ message: null, color: null })
          }, 5000);
          setPersons(persons.concat(response))
        })
    }
    setNewName('')
    setPhoneNumber('')
  }

  const handleRemove = (id, name) => {
    const confirm = window.confirm(`Remove ${name}?`)
    if (confirm) {
      personService
        .remove(id)
        .then(response => {
          setMessage({
            message: `Contact "${name}" removed succesfully`,
            color: "green"
          })
          setTimeout(() => {
            setMessage({ message: null, color: null })
          }, 5000);
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage({
            message: `Error: "${name}" has already been removed from server`,
            color: "red"
          })
          setTimeout(() => {
            setMessage({ message: null, color: null })
          }, 5000);
        })
    }
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneNumber = (event) => {
    setPhoneNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase())
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification props={message} />
      <Search onChange={handleSearch} value={searchTerm} />
      <h2>Add a number</h2>
      <PersonForm props={{
        handleNewName,
        newName,
        handlePhoneNumber,
        phoneNumber,
        handleClick
      }} />
      <h2>Numbers</h2>
      <Display
        persons={persons}
        searchTerm={searchTerm}
        handleRemove={handleRemove} />
    </div>
  );
}

export default App;
