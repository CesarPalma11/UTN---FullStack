const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const productos = await Product.findAll();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
});



// POST nuevo producto
router.post('/', async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
});

// PUT actualizar producto
router.put('/:id', async (req, res) => {
  await Product.update(req.body, { where: { id: req.params.id } });
  res.sendStatus(204);
});

// DELETE eliminar producto
router.delete('/:id', async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// ✅ Exportar SOLO una vez al final
module.exports = router;
