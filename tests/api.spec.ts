import { test, expect } from '@playwright/test';

test('GET product and validate response', async ({ request }) => {
  const url = 'https://fakestoreapi.com/products/1';
  const response = await request.get(url);
  expect(response.status()).toBe(200);

  const body = await response.json();
  const requiredKeys = ['id', 'title', 'price', 'category', 'description'];
  for (const key of requiredKeys) {
    expect(body).toHaveProperty(key);
  }

  // Optional JSON Schema validation using Ajv if available
  let Ajv: any = null;
  try {
    Ajv = (await import('ajv')).default;
  } catch (e) {
    Ajv = null;
  }

  if (Ajv) {
    const ajv = new Ajv();
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        price: { type: ['number', 'string'] },
        category: { type: 'string' },
        description: { type: 'string' }
      },
      required: requiredKeys,
      additionalProperties: true
    } as const;
    const validate = ajv.compile(schema as any);
    const valid = validate(body);
    if (!valid) console.warn('Ajv validation errors:', validate.errors);
    expect(valid).toBeTruthy();
  } else {
    console.warn('Ajv not installed; skipping JSON Schema validation');
  }

  // Log product title and price
  console.log(`Product title: ${body.title}`);
  console.log(`Product price: ${body.price}`);
});
