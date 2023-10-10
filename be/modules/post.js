const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  category: {
    type: String,
    required: false,
    default: "General"
  },
  cover: {
    type: String,
    required: false,
    default: ""
  },

  price: {
    type: Number,
    required: true,
    default: 0
  },

  rate: {
    type: Number,
    required: false
  },

  author: {
      type: String,
      required: true
  }
}, {timestamps: true, strict: true})

module.exports = mongoose.model('postModel', PostsSchema, 'posts')
