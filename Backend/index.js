const express = require('express')
const cors = require('cors')
require('dotenv').config()
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/userRoute')
const productRoutes = require('./routes/productRoute')
const cartRoute = require('./routes/cartRoute')
const orderRoute = require('./routes/orderRoute')

const connectDB = require('./config/connectDB')
const UserModel = require('./models/user.model')
const SessionModel = require('./models/session.model')
const CartModel = require('./models/cart.model')
const ProductModel = require('./models/product.model') 


const app = express() 
const allowedOrigins = [
    "http://localhost:5173",
    "https://e-shop-1m8q.vercel.app"
  ];
  
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));
app.use(express.json()) // read and parse JSON data sent from the client to your Express server.
app.use(cookieParser())
connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cart', cartRoute)
app.use('/api/orders', orderRoute)


app.get('/', (req, res) => {  
    res.json({ 
        message: "Server is running Properly"
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);

})