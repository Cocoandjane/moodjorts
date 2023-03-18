const express = require('express')

const path = require('path');
const app = express()
app.set('view engine', 'ejs')
app.use(express.static("static"))


app.get('/', (req, res) => {
  res.render(path.join(__dirname + '/views/index.ejs'));
})

module.exports = app;