import cors from 'cors';
import express from 'express';
import dashboardRoutes from './routes/dashboard.routes';
import environmentRoutes from './routes/environment.routes';
import equipmentRoutes from './routes/gestionequipos.routers';
import incidentRoutes from './routes/gestion-novedades.routers';
import loanRoutes from './routes/loan.routes';
import userRoutes from './routes/user.routes';
import { requestLogger } from './middlewares/logger.middleware';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';
const app = express();

app.use(cors());
app.use(requestLogger);
app.use(express.json());

// Health Check Endpoint
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de usuarios
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/loans', loanRoutes);

// Ruta de ambientes
app.use('/api/v1/environments', environmentRoutes);

// Ruta de equipos
app.use('/api/v1/equipos', equipmentRoutes);

// Ruta de novedades
app.use('/api/v1/novedades', incidentRoutes);

// Ruta del dashboard
app.use('/api/v1/dashboard', dashboardRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada.'
  });
});

app.use(globalErrorHandler);

export default app;