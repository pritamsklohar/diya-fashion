import mongoose from "mongoose"

let cachedPromise = null

const connectDB = async()=>{
    try {
        if (mongoose.connection.readyState === 1) return mongoose.connection

        if (!cachedPromise) {
            const uri = process.env.MONGO_URI || process.env.MONGODB_URI
            if (!uri) {
                throw new Error('Mongo URI is missing (set MONGO_URI or MONGODB_URI)')
            }

            // If URI already contains a db path, use it as-is; otherwise use default db name.
            const hasDbPath = /^mongodb(?:\+srv)?:\/\/[^/]+\/[^?]+/.test(uri)
            cachedPromise = mongoose.connect(uri, hasDbPath ? {} : { dbName: 'diya-fashion' })
        }

        await cachedPromise
        return mongoose.connection
    } catch (error) {
        cachedPromise = null
        console.log("MongoDB connection failed:", error);
        throw error
    }
}

export default connectDB
