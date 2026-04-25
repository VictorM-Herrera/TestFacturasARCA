import afip from "../config.js";
import axios from "axios";
import fs from "fs";
import path from "path";

export async function crearFacturaB() {
  const wsfe = afip.ElectronicBilling;

  const last = await wsfe.getLastVoucher(1, 6);
  const next = last + 1;

  const today = new Date();
  const yyyymmdd = Number(today.toISOString().slice(0, 10).replace(/-/g, ""));
    const fechaVisual = yyyymmdd;
  const data = {
    CantReg: 1,
    PtoVta: 1,
    CbteTipo: 6,
    Concepto: 1,
    DocTipo: 99,
    DocNro: 0,
    CondicionIVAReceptorId: 5,

    CbteDesde: next,
    CbteHasta: next,
    CbteFch: yyyymmdd,

    ImpTotal: 1210,
    ImpTotConc: 0,
    ImpNeto: 1000,
    ImpOpEx: 0,
    ImpIVA: 210,
    ImpTrib: 0,

    Iva: [
      {
        Id: 5, // 21%
        BaseImp: 1000,
        Importe: 210,
      },
    ],

    MonId: "PES",
    MonCotiz: 1,
  };

  const factura = await wsfe.createVoucher(data);

  const pdfPath = await generarPdfFacturaB({
    comprobante: next,
    fechaVisual,
    cae: factura.CAE,
    vencimientoCae: factura.CAEFchVto,
  })

  return {
    comprobante: next,
    cae: factura.CAE,
    vencimientoCae: factura.CAEFchVto,
    pdfPath,
  };
}

async function generarPdfFacturaB({comprobante, fechaVisual, cae, vencimientoCae}) {
    const fileName = `factura-b-${comprobante}.pdf`;

    const pdfData = { //template de afipsdk
    file_name: fileName,
    template: {
      name: "invoice-b",
      send_to: "victormherrerac14@gmail.com", //coloco mi mail para probar e.e
      params: {
        voucher_number: comprobante,
        sales_point: 1,
        issue_date: formatAfipDate(fechaVisual),
        cae_due_date: formatAfipDate(vencimientoCae),

        issuer_cuit: 20409378472,
        cae: cae,
        issuer_business_name: "EMPRESA DE PRUEBA",
        issuer_address: "Calle Falsa 123",
        issuer_iva_condition: "Responsable Inscripto",
        issuer_gross_income: "CM 901-123456-7",
        issuer_activity_start_date: "01/01/2020",

        receiver_name: "CONSUMIDOR FINAL",
        receiver_address: "-",
        receiver_document_type: 99,
        receiver_document_number: 0,
        receiver_iva_condition: "Consumidor Final",

        sale_condition: "Contado",
        currency_id: "ARS",
        currency_rate: 1,
        concept: 1,

        items: [
          {
            code: "001",
            description: "Servicio mensual",
            quantity: 1,
            unit_price: 1210,
            subtotal: 1210,
          },
        ],

        vat_amount: 210,
        tributes_amount: 0,
        total_amount: 1210,
      },
    },
  };

  const pdfResponse = await afip.ElectronicBilling.createPDF(pdfData);

  // para descargarlo local. esto no lo hariamos asi jeje. lo hariamos por mail
  const folderPath = path.resolve("public", "facturas");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

   const localPath = path.join(folderPath, fileName);

   const file = await axios.get(pdfResponse.file, {
    responseType: "stream",
  });

  await new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(localPath);
    file.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  return `/facturas/${fileName}`;
}

function formatAfipDate(dateValue) {
    const clean = String(dateValue).replace(/-/g, "");
   const year = clean.slice(0, 4);
  const month = clean.slice(4, 6);
  const day = clean.slice(6, 8);

  return `${day}/${month}/${year}`;
}