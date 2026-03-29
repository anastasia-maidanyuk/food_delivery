import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, image_url, rating FROM shops ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /shops error:', err);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const shopId = parseInt(req.params.id, 10);
  if (isNaN(shopId)) {
    res.status(400).json({ error: 'Invalid shop id' });
    return;
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
  const offset = (page - 1) * limit;

  try {
    const shopResult = await pool.query(
      'SELECT id, name, description, image_url, rating FROM shops WHERE id = $1',
      [shopId]
    );

    if (shopResult.rowCount === 0) {
      res.status(404).json({ error: 'Shop not found' });
      return;
    }

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM products WHERE shop_id = $1',
      [shopId]
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const productsResult = await pool.query(
      'SELECT id, name, description, price, image_url, category FROM products WHERE shop_id = $1 ORDER BY id LIMIT $2 OFFSET $3',
      [shopId, limit, offset]
    );

    res.json({
      ...shopResult.rows[0],
      products: productsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + productsResult.rows.length < total,
      },
    });
  } catch (err) {
    console.error('GET /shops/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch shop' });
  }
});

export default router;