const express = require('express')
const app = express()
const api = require('./routes/api')
const expenses = require('./model/Expense')
const data = require('../expenses')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expensesDB', { useNewUrlParser: true })

app.use('/', api)


// data.forEach(d => {
//     const expense = new expenses(d)
//     expense.save()
// });

const port = 4200
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})