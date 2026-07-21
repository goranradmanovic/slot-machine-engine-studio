import { Router } from 'express'
import configRoutes from './routes/config.routes.ts'
import authRoutes from './routes/auth.routes.ts'
import userRoutes from './routes/user.routes.ts'

const v1Router = Router()

// Mount individual resource routes onto the v1Router
v1Router.use('/configs', configRoutes)
v1Router.use('/auth', authRoutes)
v1Router.use('/users', userRoutes)

// Test route: Health check route directly on the API version root
v1Router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
})

export default v1Router