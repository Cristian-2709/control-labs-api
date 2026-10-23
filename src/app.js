const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes').default;
const environmentRoutes = require('./routes/environment.routes').default;

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de usuarios
app.use('/api/v1/users', userRoutes);

// Ruta de ambientes
app.use('/api/v1/environments', environmentRoutes);

module.exports = app; // Exportación corregida