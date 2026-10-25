import 'dotenv/config';
import app from './src/app';

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Servidor ControlLabs corriendo en http://localhost:${port}`);
});
