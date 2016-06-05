"use strict"
const path = require('path')
const fs = require('fs')

module.exports = (fileLocation) => {
  const userFilePath = userId => path.join(fileLocation, `${userId}-todo.json`)
  const readUserFile = (userId, cb) => { 
    fs.readFile(userFilePath(userId), (err, content) => { 
      if (err)
        if (err.code === 'ENOENT')
          return cb(null, [])
        else
          return cb(err)
          
      cb(null, JSON.parse(content))
    })
  }
  
  const writeUserFile = (userId, todos, cb) =>
    fs.writeFile(userFilePath(userId), JSON.stringify(todos), cb)
  
  const findIndex = (todos, id) => todos.findIndex(element => element.id === id)
  
  return {
    addTodo(userId, text, id, cb) {
      readUserFile(userId, (err, todos) => {
        if (err)
          return cb(err)
        writeUserFile(userId, todos.concat({text, id}), cb)
      })
    },
    
    deleteTodo: undefined 
      /**
       * `deleteTodo(userId, id, cb)` should read the file, remove the todo
       * with the id `id`, and write the file.
       * Write it using callbacks.
       */
    ,
    
    markTodo(userId, id, cb) {
    /**
     * `markTodo(userId, id, cb)` should read the file, toggle the `checked` flag
     * of the todo with the id `id, and write the file.
       * Write it using callbacks.
     */
    },
    
    listTodos(userId, cb) {
      return readUserFile(userId, cb)
    },
    
    renameTodo(userId, text, id, cb) {
      readUserFile(userId, (err, todos) => {
        if (err)
          return cb(err)
          
        todos[findIndex(todos, id)].text = text
        
        writeUserFile(userId, todos, cb)
      })
    }
  }
}