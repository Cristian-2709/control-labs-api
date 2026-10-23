const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes').default;

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

module.exports = app; // Exportación corregida