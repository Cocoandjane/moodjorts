const express = require('express')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static("static"))
const path = require('path');


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.ejs'));
})

module.exports = app;