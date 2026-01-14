const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category"
    }
}, {
    timestamps: true
})
const SubcategoryModel = mongoose.model('Subcategory', subcategorySchema)
module.exports = SubcategoryModel