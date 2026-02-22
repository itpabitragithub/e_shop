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

const app = express()
const isVercel = !!process.env.VERCEL

const allowedOrigins = [
    "http://localhost:5173",
    "https://e-shop-1m8q.vercel.app"
]
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""))
}
app.use(cors({
    credentials: true,
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.some((o) => origin === o || origin.startsWith(o + "/"))) return cb(null, true)
        cb(null, allowedOrigins.includes(origin))
    }
}))
app.use(express.json())
app.use(cookieParser())

// Ensure DB is connected before handling API requests (important for serverless cold start)
let dbReady = null
const ensureDb = (req, res, next) => {
    if (dbReady === true) return next()
    if (dbReady && dbReady.then) {
        return dbReady.then(() => next()).catch((err) => {
            console.error('DB not available:', err.message)
            res.status(503).json({ error: 'Database unavailable' })
        })
    }
    dbReady = connectDB()
        .then(() => { dbReady = true })
        .catch((err) => { dbReady = null; throw err })
    return dbReady.then(() => next()).catch((err) => {
        console.error('DB not available:', err.message)
        res.status(503).json({ error: 'Database unavailable' })
    })
}

app.use('/api', ensureDb)
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

// Only listen when running locally (not on Vercel serverless)
const PORT = process.env.PORT || 3000
if (!isVercel) {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`)
    })
}

module.exports = app