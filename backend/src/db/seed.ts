import pool from './index';

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('TRUNCATE order_items, orders, coupons, products, shops RESTART IDENTITY CASCADE');

    const shopsResult = await client.query(`
      INSERT INTO shops (name, description, image_url, rating) VALUES
        ('Pizza Palace', 'Best pizza in town', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 4.8),
        ('Burger Barn', 'Juicy burgers and fries', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 3.9),
        ('Sushi Garden', 'Authentic Japanese cuisine', 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=400', 4.2),
        ('Taco Fiesta', 'Vibrant Mexican flavors', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', 2.5)
      RETURNING id
    `);

    const [pizzaId, burgerId, sushiId, tacoId] = shopsResult.rows.map((r) => r.id);

await client.query(`
      INSERT INTO products (shop_id, name, description, price, image_url, category) VALUES
        -- Pizza Palace ($1)
        ($1, 'Margherita', 'Classic pizza with tomato and mozzarella', 9.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 'Pizza'),
        ($1, 'Pepperoni', 'Spicy pepperoni with extra cheese', 11.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 'Pizza'),
        ($1, 'Four Cheese', 'Mozzarella, Gorgonzola, Parmesan, and Fontina', 13.50, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 'Pizza'),
        ($1, 'Garlic Knots', 'Freshly baked dough with garlic butter', 4.50, 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400', 'Sides'),
        ($1, 'Coca-Cola', 'Ice cold drink 0.5L', 2.50, 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400', 'Drinks'),
        ($1, 'Tiramisu', 'Classic Italian dessert', 5.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', 'Desserts'),
        ($1, 'Aperol Spritz', 'Refreshing Italian cocktail', 7.50, 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=400', 'Drinks'),

        -- Burger Barn ($2)
        ($2, 'Classic Burger', 'Juicy beef patty with fresh veggies', 8.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 'Burgers'),
        ($2, 'Double Smash', 'Two smashed patties with melted cheese', 12.99, 'https://www.dontgobaconmyheart.co.uk/wp-content/uploads/2024/03/double-smash-burgers.jpg', 'Burgers'),
        ($2, 'Veggie Delight', 'Plant-based patty with avocado cream', 10.50, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', 'Burgers'),
        ($2, 'Fries Large', 'Crispy golden fries', 3.99, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', 'Sides'),
        ($2, 'Onion Rings', 'Beer-battered crunchy onion rings', 4.99, 'https://theeburgerdude.com/wp-content/uploads/2022/09/9093e9_faee77ed55a44bd4994078f8fec266a7_mv2.webp', 'Sides'),
        ($2, 'Chocolate Shake', 'Rich creamy chocolate milkshake', 4.50, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', 'Drinks'),
        ($2, 'Craft Beer', 'Local IPA bottle', 5.50, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400', 'Drinks'),

        -- Sushi Garden ($3)
        ($3, 'Salmon Roll', 'Fresh Atlantic salmon, 8 pieces', 13.99, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 'Sushi'),
        ($3, 'Dragon Roll', 'Eel and cucumber topped with avocado', 15.50, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', 'Sushi'),
        ($3, 'California Roll', 'Crab mix, cucumber, and avocado', 11.50, 'https://images.unsplash.com/photo-1559466273-d95e72debaf8?w=400', 'Sushi'),
        ($3, 'Miso Soup', 'Traditional Japanese tofu miso soup', 2.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', 'Soups'),
        ($3, 'Edamame', 'Steamed soybeans with sea salt', 4.99, 'https://images.unsplash.com/photo-1615484477201-9f4953340fab?w=400', 'Starters'),
        ($3, 'Mochi', 'Sweet Japanese rice cake dessert', 4.99, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', 'Desserts'),
        ($3, 'Green Tea', 'Hot ceremonial matcha tea', 3.50, 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400', 'Drinks'),

        -- Taco Fiesta ($4)
        ($4, 'Beef Taco', 'Classic seasoned beef taco with salsa', 4.99, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', 'Mexican'),
        ($4, 'Chicken Burrito', 'Rice, beans, and grilled chicken', 10.99, 'https://www.loveandoliveoil.com/wp-content/uploads/2023/10/chicken-rice-bean-burritos-FEAT.jpg', 'Mexican'),
        ($4, 'Nachos Grande', 'Loaded cheesy nachos with jalapeños', 8.99, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', 'Mexican'),
        ($4, 'Guacamole & Chips', 'Fresh avocado dip with corn chips', 6.50, 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=400', 'Sides'),
        ($4, 'Churros', 'Fried dough sticks with cinnamon sugar', 4.99, 'https://salimaskitchen.com/wp-content/uploads/2025/08/Homemade-Fried-Churros-with-Chocolate-Dipping-Sauce-Salimas-Kitchen-15-2.jpg', 'Desserts'),
        ($4, 'Margarita Cocktail', 'Tequila, lime, and salt rim', 8.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'Drinks'),
        ($4, 'Jarritos Soda', 'Mexican fruit-flavored soda', 3.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', 'Drinks')
    `, [pizzaId, burgerId, sushiId, tacoId]);

    await client.query(`
      INSERT INTO coupons (code, discount_percent, description, is_active, expires_at) VALUES
        ('WELCOME10', 10, 'Welcome discount — 10% off your order', true, NOW() + INTERVAL '30 days'),
        ('SAVE20', 20, 'Save 20% on any order', true, NOW() + INTERVAL '14 days'),
        ('FREESHIP', 15, 'Extra 15% off — today only', true, NOW() + INTERVAL '7 days'),
        ('EXPIRED50', 50, 'This coupon has expired', false, NOW() - INTERVAL '1 day')
      ON CONFLICT (code) DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('Seed completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

seed();