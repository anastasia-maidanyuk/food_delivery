import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, code, discount_percent, description, is_active, expires_at
       FROM coupons
       WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY discount_percent DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /coupons error:', err);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

router.post('/apply', async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    res.status(422).json({ error: 'Coupon code is required' });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, code, discount_percent, description, is_active, expires_at
       FROM coupons
       WHERE UPPER(code) = UPPER($1)`,
      [code.trim()]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Coupon not found' });
      return;
    }

    const coupon = result.rows[0];

    if (!coupon.is_active) {
      res.status(400).json({ error: 'This coupon is no longer active' });
      return;
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      res.status(400).json({ error: 'This coupon has expired' });
      return;
    }

    res.json({
      code: coupon.code,
      discountPercent: coupon.discount_percent,
      description: coupon.description,
    });
  } catch (err) {
    console.error('POST /coupons/apply error:', err);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
});

export default router;