"use strict"
const Promise = require('bluebird')
const fs = require('fs')
Promise.promisifyAll(fs)
const path = require('path')

module.exports = (fileLocation) => {
  const userFilePath = userId => path.join(fileLocation, `${userId}-todo.json`)
  const MYreadUserFile = (userId) => {
    /*
    ** `readUserFile` should read the user file (in userFilePath(userId)),
    ** and return the json inside it (already parsed, of course) using 
    ** Promises. Don't forget that the file may not exist, and if it does
    ** not, you should return an empty list (`[]`)
    */
    fs.readFileAsync(userFilePath(userId))
    .then(todos => {
      JSON.parse(todos)
    })
    .catch((err) => err.code == 'ENOENT' ? [] : Promise.reject(err))
  }

    const readUserFile = (userId) => 
    fs.readFileAsync(userFilePath(userId))
      .then((content) => JSON.parse(content))
      .catch((err) => err.code == 'ENOENT' ? [] : Promise.reject(err))
  
  const writeUserFile = (userId, todos) => 
    fs.writeFileAsync(userFilePath(userId), JSON.stringify(todos))
  
  const findIndex = (todos, id) => todos.findIndex(element => element.id === id)
  
  return {
    MYaddTodo(userId, text, id) {
      /**
       * `addTodo(userId, text, id, cb)` should read the file, 
       * add the todo at the end of the list
       * of todos, then write the file.
       * The todo should be in the structure {text, id}.
       * Write it using Promises.
       */
    return readUserFile(userId)
        .then((todos) => {
          todos.concat({ text: text, id: id })
          writeUserFile(userId, todos)
        })
    },
    addTodo(userId, text, id) {
      return readUserFile(userId)
        .then((todos) => writeUserFile(userId, todos.concat({text, id})))
    }
    ,
    
    deleteTodo(userId, id) {
      return readUserFile(userId)
        .then((todos) => {
          todos.splice(findIndex(todos, id), 1)
          return writeUserFile(userId, todos)          
        })
    },
    
    markTodo(userId, id) {
      return readUserFile(userId)
        .then(todos => {
          const todo = todos[findIndex(todos, id)]
          todo.checked = !todo.checked
          return writeUserFile(userId, todos)
        })
    },
    
    listTodos(userId) {
      return readUserFile(userId)
    },
    
    renameTodo(userId, text, id) {
      return readUserFile(userId)
        .then(todos => {
          todos[findIndex(todos, id)].text = text
          return writeUserFile(userId, todos)
        })
    }
  }
}
