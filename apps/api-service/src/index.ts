import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const PORT = parseInt(process.env.API_PORT || '3004', 10)
const HOST = process.env.API_HOST || '0.0.0.0'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Initialize Fastify
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
})

// Register plugins
fastify.register(fastifyHelmet)
fastify.register(fastifyCors, {
  origin: true,
})
fastify.register(fastifyJwt, {
  secret: JWT_SECRET,
})

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// API routes placeholder
fastify.get('/api', async (request, reply) => {
  return {
    message: 'The Bazaar API Service',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      vendors: '/api/vendors',
      payments: '/api/payments',
      auth: '/api/auth',
    },
  }
})

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST })
    console.log(`✓ API Server running on http://${HOST}:${PORT}`)
    console.log(`✓ Health check: http://${HOST}:${PORT}/health`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
