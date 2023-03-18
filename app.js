const express = require('express')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static("static"))

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.render("index.ejs")
})

module.exports = app;