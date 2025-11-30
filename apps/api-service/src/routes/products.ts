import type { FastifyInstance } from 'fastify'

export async function productsRoutes(fastify: FastifyInstance) {
  // GET all products
  fastify.get('/api/products', async (request, reply) => {
    return {
      success: true,
      data: [],
      message: 'Products endpoint - implementation pending',
    }
  })

  // GET product by ID
  fastify.get<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const { id } = request.params
    return {
      success: true,
      data: null,
      message: `Product ${id} endpoint - implementation pending`,
    }
  })

  // POST create product
  fastify.post('/api/products', async (request, reply) => {
    return {
      success: true,
      data: null,
      message: 'Create product endpoint - implementation pending',
    }
  })

  // PUT update product
  fastify.put<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const { id } = request.params
    return {
      success: true,
      data: null,
      message: `Update product ${id} endpoint - implementation pending`,
    }
  })

  // DELETE product
  fastify.delete<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const { id } = request.params
    return {
      success: true,
      message: `Delete product ${id} endpoint - implementation pending`,
    }
  })
}
