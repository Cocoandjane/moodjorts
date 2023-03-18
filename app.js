const express = require('express')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static("static"))
const path = require('path');


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define your routes
app.get('/', function(req, res) {
  res.render('index');
});

module.exports = app;