import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js'
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'
import cors from 'cors'


const app = express()

const PORT = process.env.PORT || 3000
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_ORIGINS ? process.env.FRONTEND_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean) : [])
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}))

//middleware
app.use(express.json())

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/orders', orderRoute)

connectDB()

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is listening at port:${PORT}`)
    })
}

export default app

