import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

interface OrderItem {
  productId: number;
  quantity: number;
}

interface CreateOrderBody {
  couponCode: any;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
}

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string): boolean =>
  /^\+?[\d\s\-().]{7,20}$/.test(phone);

router.post('/', async (req: Request<{}, {}, CreateOrderBody>, res: Response) => {
  const { email, phone, address, items } = req.body;

  const errors: Record<string, string> = {};
  if (!email || !isValidEmail(email)) errors.email = 'Valid email is required';
  if (!phone || !isValidPhone(phone)) errors.phone = 'Valid phone number is required';
  if (!address || address.trim().length < 5) errors.address = 'Address must be at least 5 characters';
  if (!items || !Array.isArray(items) || items.length === 0) errors.items = 'Order must contain at least one item';

  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const productIds = items.map((i) => i.productId);
    const productsResult = await client.query(
      'SELECT id, name, price FROM products WHERE id = ANY($1::int[])',
      [productIds]
    );

    const productMap = new Map(
      productsResult.rows.map((p) => [p.id, { name: p.name, price: parseFloat(p.price) }])
    );

    for (const item of items) {
      if (!productMap.has(item.productId)) {
        await client.query('ROLLBACK');
        res.status(422).json({ errors: { items: `Product ${item.productId} not found` } });
        return;
      }
    }

    const rawTotal = items.reduce((sum, item) => {
  const product = productMap.get(item.productId)!;
  return sum + product.price * item.quantity;
}, 0);

let totalPrice = rawTotal;
if (req.body.couponCode) {
  const couponResult = await client.query(
    `SELECT discount_percent FROM coupons
     WHERE UPPER(code) = UPPER($1) AND is_active = true
     AND (expires_at IS NULL OR expires_at > NOW())`,
    [req.body.couponCode]
  );
  if (couponResult.rowCount && couponResult.rowCount > 0) {
    const discount = couponResult.rows[0].discount_percent;
    totalPrice = rawTotal * (1 - discount / 100);
  }
}

    const orderResult = await client.query(
      `INSERT INTO orders (email, phone, address, total_price)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [email.trim(), phone.trim(), address.trim(), totalPrice.toFixed(2)]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      const product = productMap.get(item.productId)!;
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.productId, product.name, product.price.toFixed(2), item.quantity]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /orders error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

router.get('/search', async (req: Request, res: Response) => {
  const { email, phone, orderId } = req.query;

  const errors: Record<string, string> = {};

  if (orderId) {
    const id = parseInt(orderId as string, 10);
    if (isNaN(id)) {
      res.status(422).json({ errors: { orderId: 'Order ID must be a number' } });
      return;
    }

    try {
      const orderResult = await pool.query(
        'SELECT id, email, phone, address, total_price, status, created_at FROM orders WHERE id = $1',
        [id]
      );

      if (orderResult.rowCount === 0) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      const itemsResult = await pool.query(
        'SELECT product_id, product_name, product_price, quantity FROM order_items WHERE order_id = $1',
        [id]
      );

      res.json({ orders: [{ ...orderResult.rows[0], items: itemsResult.rows }] });
      return;
    } catch (err) {
      console.error('GET /orders/search by id error:', err);
      res.status(500).json({ error: 'Failed to search orders' });
      return;
    }
  }

  if (!email || !isValidEmail(email as string)) {
    errors.email = 'Valid email is required';
  }
  if (!phone || !isValidPhone(phone as string)) {
    errors.phone = 'Valid phone number is required';
  }

  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
    return;
  }

  try {
    const ordersResult = await pool.query(
      `SELECT id, email, phone, address, total_price, status, created_at
       FROM orders
       WHERE LOWER(email) = LOWER($1) AND phone = $2
       ORDER BY created_at DESC`,
      [email, phone]
    );

    if (ordersResult.rowCount === 0) {
      res.status(404).json({ error: 'No orders found for this email and phone' });
      return;
    }

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          'SELECT product_id, product_name, product_price, quantity FROM order_items WHERE order_id = $1',
          [order.id]
        );
        return { ...order, items: itemsResult.rows };
      })
    );

    res.json({ orders });
  } catch (err) {
    console.error('GET /orders/search error:', err);
    res.status(500).json({ error: 'Failed to search orders' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id, 10);
  if (isNaN(orderId)) {
    res.status(400).json({ error: 'Invalid order id' });
    return;
  }

  try {
    const orderResult = await pool.query(
      'SELECT id, email, phone, address, total_price, status, created_at FROM orders WHERE id = $1',
      [orderId]
    );
    if (orderResult.rowCount === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const itemsResult = await pool.query(
      'SELECT product_id, product_name, product_price, quantity FROM order_items WHERE order_id = $1',
      [orderId]
    );

    res.json({ ...orderResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    console.error('GET /orders/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.get('/:id/reorder', async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id, 10);
  if (isNaN(orderId)) {
    res.status(400).json({ error: 'Invalid order id' });
    return;
  }

  try {
    const itemsResult = await pool.query(
      `SELECT oi.product_id, oi.quantity,
              p.name, p.description, p.price, p.image_url, p.category, p.shop_id
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    if (itemsResult.rowCount === 0) {
      res.status(404).json({ error: 'Order not found or has no items' });
      return;
    }

    res.json({
      items: itemsResult.rows.map((row) => ({
        product: {
          id: row.product_id,
          name: row.name,
          description: row.description,
          price: parseFloat(row.price),
          image_url: row.image_url,
          category: row.category,
          shop_id: row.shop_id,
        },
        quantity: row.quantity,
      })),
    });
  } catch (err) {
    console.error('GET /orders/:id/reorder error:', err);
    res.status(500).json({ error: 'Failed to fetch reorder items' });
  }
});

export default router;