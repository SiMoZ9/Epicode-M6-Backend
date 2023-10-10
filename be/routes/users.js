const express = require('express')
const UserModel = require("../modules/users")

const users = express.Router()

users.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find()

        res.status(200).send({
            statusCode: 200,
            users
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Server Error"
        })
    }
})

users.post('/users/create', async  (req, res) => {

    const newUser = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    })

    try {
        const user = await newUser.save()
        res.status(201).send({
            statusCode: 200,
            message: "User created",
            payload: user
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Server Error"
        })
    }
})

module.exports = users