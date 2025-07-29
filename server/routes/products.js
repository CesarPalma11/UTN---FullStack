const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error del servidor al obtener productos
 */
router.get('/', async (req, res) => {
  try {
    const productos = await Product.findAll();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor al buscar el producto
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
});

// Rutas POST, PUT y DELETE no documentadas porque no son GET

router.post('/', async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
});

router.put('/:id', async (req, res) => {
  await Product.update(req.body, { where: { id: req.params.id } });
  res.sendStatus(204);
});

router.delete('/:id', async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

module.exports = router;
