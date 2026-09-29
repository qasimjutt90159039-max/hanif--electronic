import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET all products with filtering, searching, pagination, sorting
router.get('/', async (req, res) => {
  try {
    const {
      page,
      limit,
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      isDeal,
      isNew,
      sort
    } = req.query;

    const result = await db.getProducts({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      category: category as string,
      brand: brand as string,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock === 'true',
      isFeatured: isFeatured === 'true',
      isDeal: isDeal === 'true',
      isNew: isNew === 'true',
      sort: sort as string
    });

    res.json({
      success: true,
      data: result.products,
      pagination: {
        page: result.page,
        limit: limit ? Number(limit) : 20,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: err.message });
  }
});

// GET single product by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await db.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
});

// ADMIN: Create Product
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, price, brand, category } = req.body;
    if (!name || !price || !brand || !category) {
      return res.status(400).json({ success: false, message: 'Name, price, brand, and category are required' });
    }

    const created = await db.createProduct(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully', data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: err.message });
  }
});

// ADMIN: Update Product
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update product', error: err.message });
  }
});

// ADMIN: Delete Product
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product removed from store' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

export default router;
