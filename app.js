// const express = require('express')
// const app = express()
// app.set('view engine', 'ejs')
// app.use(express.static("static"))


// app.get('/', (req, res) => {
//   res.render("index")
// })

// module.exports = app;


const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static("static"))
const port = 3000

app.get('/', (req, res) => {
  res.render("index")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})