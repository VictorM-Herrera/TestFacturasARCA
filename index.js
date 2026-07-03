import 'dotenv/config'
import express from 'express';
import arcaRoutes from './routes/arca.routes.js'
import facturaRoutes from './routes/factura.routes.js'

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static("public"));

app.use("/api/arca", arcaRoutes);
app.use("/api/facturas", facturaRoutes);

app.listen(port, ()=>{
    console.log(`Servidor iniciado en el puerto ${port}`);
})