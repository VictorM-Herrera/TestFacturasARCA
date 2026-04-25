import 'dotenv/config'
import express from 'express';
import facturaRoutes from './routes/factura.routes.js';
const app = express();
const port = 3001;

app.use(express.json())
app.use(express.static("public"));

app.use('/api', facturaRoutes);

app.get('/', (req,res) => {
    res.send("Hello world");
});

app.listen(port, ()=>{
    console.log(`Servidor iniciado en el puerto ${port}`);
})