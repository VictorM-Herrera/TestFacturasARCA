# API Facturación ARCA - MVP

## Funcionalidades actuales

- Obtener último comprobante emitido
- Crear Factura B
- Generar PDF automáticamente

---

# Instalación

```bash
npm install
```

## Variables de entorno

Crear archivo `.env`

```env
TOKEN_AFIP_SDK=tu_token_access
```

---

## Ejecutar proyecto

```bash
node index.js
```

Servidor local:

```txt
http://localhost:3001
```

---

## Endpoints

## Obtener último comprobante

```http
GET /api/facturas/ultimo
```

### Respuesta esperada

```json
{
  "ok": true,
  "ultimo": 24840,
  "siguiente": 24841
}
```

---

## Crear Factura B

```http
POST /api/facturas
```

### Body ejemplo

```json
{
  "cliente": "Victor Herrera",
  "descripcion": "Desarrollo sistema facturacion",
  "docTipo": 99,
  "docNro": 0,
  "importeNeto": 5000
}
```

### Respuesta esperada

```json
{
  "ok": true,
  "cliente": "Victor Herrera",
  "descripcion": "Desarrollo sistema facturacion",
  "comprobante": 24841,
  "cae": "86170055342818",
  "vencimientoCae": "2026-05-04",
  "total": 6050,
  "pdfURL": "/facturas/factura-b-24841.pdf"
}
```

---

## PDFs generados

Se guardan en:

```txt
/public/facturas
```

Disponibles desde navegador:

```txt
http://localhost:3001/facturas/nombre-archivo.pdf
```

---
