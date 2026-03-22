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
const normalizeOrigin = (origin) => {
    if (!origin) return null
    return origin.trim().replace(/\/+$/, '')
}

const isVercelOrigin = (origin) => {
    try {
        return /\.vercel\.app$/i.test(new URL(origin).hostname)
    } catch {
        return false
    }
}

const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
const allowedOrigins = new Set([
    'http://localhost:5173',
    normalizeOrigin(process.env.FRONTEND_URL),
    normalizeOrigin(vercelUrl),
    ...(process.env.FRONTEND_ORIGINS
        ? process.env.FRONTEND_ORIGINS.split(',').map((origin) => normalizeOrigin(origin))
        : [])
].filter(Boolean))

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        const normalized = normalizeOrigin(origin)
        const isKnown = allowedOrigins.has(normalized)
        const isVercelPreview = isVercelOrigin(normalized)

        // Do not throw errors for unknown origins (which surface as 500 in Express).
        if (isKnown || isVercelPreview) return callback(null, true)
        return callback(null, false)
    },
    credentials: true
}))

//middleware
app.use(express.json())

app.use(async (_req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        })
    }
})

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/orders', orderRoute)

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is listening at port:${PORT}`)
    })
}

export default app

