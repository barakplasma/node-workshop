const express = require('express')

const app = express()

app.get('/hello', function(req, res) {
  res.sendFile(__dirname + '/data/hello-world.txt')
})

const server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening...')
})

/*
* curl -i 'http://localhost:3000/hello'
* res.sendFile
* mime.lookup (node-mime)
*/
