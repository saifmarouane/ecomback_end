// const express = require('express')
// const cors = require('cors')
// const path = require('path')
// const productRoutes = require('./domains/product/product.routes')
// const authRoutes = require('./domains/auth/auth.routes')
// const categoryRoutes = require('./domains/category/category.routes')
// const cartRoutes = require('./domains/cart/cart.routes')
// const healthRoutes = require('./domains/health/health.routes')

// const app = express()
// app.use(cors())
// app.use(express.json())
// // Serve the built React app (run `npm run build` in front_end first)
// const clientBuildPath = path.join(__dirname, '../../front_end/build')
// app.use(express.static(clientBuildPath))
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// app.use('/api/auth', authRoutes)
// app.use('/api/products', productRoutes)
// app.use('/api/categories', categoryRoutes)
// app.use('/api/cart', cartRoutes)
// app.use('/api/health', healthRoutes)

// // Serve front-end for client-side routes while letting asset paths 404 normally
// app.use((req, res, next) => {
//   const url = req.originalUrl
//   const isApi = url.startsWith('/api/')
//   const isUpload = url.startsWith('/uploads/')
//   const isStatic = url.startsWith('/static/') || url === '/asset-manifest.json' || url === '/manifest.json' || url === '/favicon.ico'

//   if (!isApi && !isUpload && !isStatic) {
//     res.sendFile(path.join(clientBuildPath, 'index.html'))
//   } else {
//     next()
//   }
// })

// // Handle 404 for API routes
// app.use((req, res) => {
//   res.status(404).send('Not found')
// })

// module.exports = app
// back_end/src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./domains/product/product.routes');
const authRoutes = require('./domains/auth/auth.routes');
const categoryRoutes = require('./domains/category/category.routes');
const cartRoutes = require('./domains/cart/cart.routes');
const healthRoutes = require('./domains/health/health.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/health', healthRoutes);

// Handle 404 for API routes
app.use((req, res) => {
  res.status(404).send('Not found');
});

module.exports = app;