const express = require('express')
const cors = require('cors')
require('dotenv').config()
const cookieParser = require('cookie-parser')

const authRoutes = require('../routes/authRoute')
const userRoutes = require('../routes/userRoute')
const productRoutes = require('../routes/productRoute')
const cartRoute = require('../routes/cartRoute')
const orderRoute = require('../routes/orderRoute')

const connectDB = require('../config/connectDB')

const app = express()

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://e-shop-1m8q.vercel.app"
]

// ✅ CORS CONFIG (PRE-FLIGHT SAFE)
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(null, false)
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}))

// ✅ VERY IMPORTANT — HANDLE PREFLIGHT
app.options("*", (req,res)=>res.sendStatus(200))

app.use(express.json())
app.use(cookieParser())

connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cart', cartRoute)
app.use('/api/orders', orderRoute)

app.get('/', (req, res) => {
  res.json({ message: "Server is running Properly" })
})
module.exports = app;

// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`Server running at port ${PORT}`)
// })