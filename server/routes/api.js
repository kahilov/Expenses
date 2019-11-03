const express = require('express')
const router = express.Router()
const expenses = require('../model/Expense')
const mongoose = require('mongoose')

router.get('/expenses', function (req, res) {
    expenses.find({}).sort({ date: -1 }).exec(function (err, expenses) {
        res.send(expenses)
    })
})

router.post('/new', function (req, res) {
    const e = new expenses(req.body)
    e.save()
    res.send(e)
})
router.put('/update', function (req, res) {
    const groups = req.body
    const group1 = groups.group1
    const group2 = groups.group2
    expenses.findOneAndUpdate({ group: group1 }, { group: group2 }, { new: true })
        .exec(function (err, data) {
            res.send(data)
        })
})
router.get('/expenses/:group', function (req, res) {
    const group = req.params.group
    const total = req.query.total
    if (total) {
        expenses.aggregate([
            { $match: { group: group } },
            { $group: { _id: null, totalExpenses: { $sum: "$amount" } } }
        ]).exec(function (err, expenses) {
                res.send(expenses)
            })
    }
    else {
        expenses.find({ group }).exec(function (err, expenses) {
            res.send(expenses)
        })
    }
})

router.get('/expenses/:group', (req, res) => {
    const group = req.params.group;
    if (req.query.total === "true") {
        Expense.aggregate([{ $match: { group: `${group}` } },
        { $group: { _id: `${group}`, total: { $sum: "$amount" } } }])
            .exec(function (err, data) { console.log(data); res.send(data) })
    }
    else if (req.query.d1 && req.query.d2) {
        const d1 = moment(req.query.d1)
        const d2 = moment(req.query.d2)
        Expense.find({ date: { $gte: d1 }, date: { $lte: d2 } }).exec(function (err, data) { res.send(data) })
    }
    else if (req.rquery.d1 && !req.query.d2) {
        const d1 = moment(req.query.d1)
        Expense.find({ date: { $gte: d1 } }).exec(function (err, data) { res.send(data) })
    }
    else
        Expense.find({ group: `${group}` }).exec(function (err, data) { res.send(data) })
})
module.exports = router