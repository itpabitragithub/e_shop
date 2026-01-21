const express = require('express')
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoute')

const connectDB = require('./config/connectDB')
const UserModel = require('./models/user.model')
const SessionModel = require('./models/session.model')
// const AddressModel = require('./models/address.model')
// const ProductModel = require('./models/product.model')
// const SubcategoryModel = require('./models/subcategory.model')
// const CategoryModel = require('./models/category.model')
// const OrderModel = require('./models/order.model')
// const CartproductModel = require('./models/cartproduct.model')

const app = express() 
app.use(cors({
    credentials: true, //
    origin: "http://localhost:5173"
}))
app.use(express.json()) // read and parse JSON data sent from the client to your Express server.
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false 
}))  
connectDB()

app.use('/api/user', userRoutes)

app.get('/', (req, res) => {  
    res.json({ 
        message: "Server is running Properly"
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);

})