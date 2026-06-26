import { Router } from 'express'
import configRoutes from './config.routes.ts'

const v1Router = Router()

// Mount individual resource routes onto the v1Router
v1Router.use('/configs', configRoutes)

// Test route: Health check route directly on the API version root
v1Router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
})

export default v1Router