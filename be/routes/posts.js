const express = require('express')
const PostsModel = require("../modules/post")
const ValidatePost = require("../middlewares/validatePost")

const posts = express.Router()

posts.get('/posts', async (req, res) => {

    //Paginazione
    const {page = 1, pageSize= 3} = req.query //ci sono delle query chiamate page e pageSize

    try {
        const posts = await PostsModel.find().limit(pageSize).skip((page - 1) * pageSize) //restituisce tutti i post

        const totalPost = await PostsModel.count()

        res.status(200)
            .send({
                statusCode: 200,
                currentPage: Number(page),
                totalPages: Math.ceil(totalPost / pageSize),
                totalPost,
                posts
            })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Errore interno del server'
        })
    }
})


posts.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await PostsModel.findById(postId)
        if(!post) {
            return res.status(404).send({
                statusCode: 404,
                message: "This message doesn't exists"
            })
        }

        res.status(200).send({
            statusCode: 200,
            post
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Errore interno del server'
        })
    }
})

posts.get('/posts/bytitle', async (req, res) => {
    const { title } = req.query;
    try {
        const postByTitle = await PostsModel.find({
            title: {
                $regex: title,
                $options: 'i'
            }
        })

        res.status(200).send(postByTitle)
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

posts.get('/posts/bydate/:date', async (req, res) => {
    const { date } = req.params

    try {
        const getPostByDate = await PostsModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    {$dayOfMonth: '$createdAt' },
                                    {$dayOfMonth: new Date(date)}
                                ]
                            },
                            {
                                $eq: [
                                    {$month: '$createdAt' },
                                    {$month: new Date(date)}
                                ]
                            },
                            {
                                $eq: [
                                    {$year: '$createdAt' },
                                    {$year: new Date(date)}
                                ]
                            }
                        ]
                    }
                }
            }
        ])

        res.status(200).send(getPostByDate)
    } catch (e) {

    }
})


posts.post('/posts/create', ValidatePost ,async (req, res) => {

    const newPost = new PostsModel({
        title: req.body.title,
        category: req.body.category,
        cover: req.body.cover,
        price: Number(req.body.price),
        rate: Number(req.body.rate),
        author: req.body.author
    })

    try {
        const post = await newPost.save()
        res.status(201).send({
            statusCode: 201,
            message: "Post saved successfully",
            payload: post
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Errore interno del server'
        })
    }
})

posts.patch('/posts/update/:postId', async (req, res) => {
    const { postId } = req.params
    const postExt= await PostsModel.findById(postId)

    if (!postExt) {
        return res.status(404).send({
            statusCode: 404,
            message: "This message doesn't exists"
        })
    }

    try {
        const dataToUpdate = req.body
        const options = {new: true}
        const result = await PostsModel.findByIdAndUpdate(postId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Post updated",
            result
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Errore interno del server'
        })
    }
})

posts.delete('/posts/delete/:postId', async (req, res) => {
     const { postId } = req.params;

     try {
         const post = await PostsModel.findByIdAndDelete(postId)
         if(!post) {
             return res.status(404).send({
                 statusCode: 404,
                 message: "This message doesn't exists"
             })
         }

         res.status(200).send({
             statusCode: 200,
             message: "Post deleted successfully"
         })

     } catch (e) {
         res.status(500).send({
             statusCode: 500,
             message: 'Errore interno del server'
         })
     }
})

module.exports = posts