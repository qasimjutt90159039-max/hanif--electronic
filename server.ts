import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

import { initDatabase } from './server/db/db';
import authRoutes from './server/routes/auth';
import productRoutes from './server/routes/products';
import categoryRoutes from './server/routes/categories';
import brandRoutes from './server/routes/brands';
import orderRoutes from './server/routes/orders';
import couponRoutes from './server/routes/coupons';
import reviewRoutes from './server/routes/reviews';
import contactRoutes from './server/routes/contact';
import installmentRoutes from './server/routes/installments';
import settingRoutes from './server/routes/settings';
import adminRoutes from './server/routes/admin';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Middlewares
  app.use(cors({
    origin: '*',
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize DB & Seed Data
  await initDatabase();

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/brands', brandRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/coupons', couponRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/installments', installmentRoutes);
  app.use('/api/settings', settingRoutes);
  app.use('/api/admin', adminRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Hanif Centre Electronics Online Store API',
      timestamp: new Date().toISOString()
    });
  });

  // Client Mounting
  if (!isProduction) {
    // Development mode: Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error occurred. Please try again.'
    });
  });

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Hanif Centre Store running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
