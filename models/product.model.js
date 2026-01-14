const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
  },
  image:{
    type : Array,
    default : []
  },
    category: [
        {
        type: mongoose.Schema.ObjectId,
        ref: "Category"
        }
    ],
    subCategory: [
        {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory"
        }
    ],
    unit: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: ""
    },
    publish: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

const ProductModel = mongoose.model('Product', productSchema)
module.exports = ProductModel