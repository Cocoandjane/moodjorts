const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("static"))

// Define route for home page
app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;
