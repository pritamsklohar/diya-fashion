let appPromise

module.exports = async (req, res) => {
  try {
    if (!appPromise) {
      appPromise = import('../backend/server.js').then((mod) => mod.default)
    }

    const app = await appPromise
    return app(req, res)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Server boot failed'
    })
  }
}
