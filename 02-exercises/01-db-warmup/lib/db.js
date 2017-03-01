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
    addTodo: function(userId, text, id, cb){
      readUserFile(userId,(err,tdl)=>{
        err ? cb(err): writeUserFile(userId,tdl.concat({text: text,id: id}),cb)
    })
    }
      /**
       * `addTodo(userId, text, id, cb)` should read the file
       * (using the above `readUserFile` function), 
       * add the todo at the end of the list
       * of todos, then write the file (using the above `writeUserFile`).
       * The todo should be in the structure {text, id}.
       * Write it using callbacks.
       */
    ,
    
    deleteTodo: undefined 
      /**
       * Don't write this. We will write it in the next exercise.
       */
    ,
    
    markTodo(userId, id, cb) {
    /**
       * Don't write this. We will write it in the next exercise.
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
