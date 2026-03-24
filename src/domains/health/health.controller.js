const { mongoose } = require('../../shared/database')

function readyStateLabel(readyState) {
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  if (readyState === 0) return 'disconnected'
  if (readyState === 1) return 'connected'
  if (readyState === 2) return 'connecting'
  if (readyState === 3) return 'disconnecting'
  return 'unknown'
}

function serializeError(error) {
  if (!error) return null

  const isProd = process.env.NODE_ENV === 'production'
  const payload = {
    name: error.name,
    message: error.message
  }

  if (error.code !== undefined) payload.code = error.code
  if (error.errno !== undefined) payload.errno = error.errno

  // Mongoose/Mongo driver errors sometimes have nested objects that are useful.
  if (error.cause && typeof error.cause === 'object') {
    payload.cause = {
      name: error.cause.name,
      message: error.cause.message
    }
  }

  if (!isProd && error.stack) payload.stack = error.stack
  return payload
}

exports.dbHealth = async (req, res) => {
  const startedAt = Date.now()
  try {
    const connection = mongoose.connection
    const readyState = connection.readyState
    const state = readyStateLabel(readyState)

    if (readyState !== 1 || !connection.db) {
      return res.status(503).json({
        ok: false,
        db: {
          state,
          readyState
        },
        tookMs: Date.now() - startedAt,
        timestamp: new Date().toISOString()
      })
    }

    const ping = await connection.db.admin().ping()

    return res.json({
      ok: true,
      db: {
        state,
        readyState,
        name: connection.name || undefined,
        host: connection.host || undefined
      },
      ping,
      tookMs: Date.now() - startedAt,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: serializeError(error),
      tookMs: Date.now() - startedAt,
      timestamp: new Date().toISOString()
    })
  }
}

