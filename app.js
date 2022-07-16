const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static("static"))


app.get('/', (req, res) => {
  res.render("index")
})

module.exports = app;