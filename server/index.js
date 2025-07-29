const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const productRoutes = require('./routes/products');
const setupSwagger = require('./swagger');

const app = express();
app.use(cors());
app.use(express.json());



setupSwagger(app);
app.use('/api/products', productRoutes);

sequelize.sync().then(() => {
  app.listen(3001, () => console.log('Backend corriendo en http://localhost:3001'));
   console.log('Documentación disponible en http://localhost:3001/api-docs');
});
