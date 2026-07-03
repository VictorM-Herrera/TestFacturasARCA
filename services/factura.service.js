// import afip from "../afip.config.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import afip from "../configs/afip.config.js";

const facturaService = {};

facturaService.crearFacturaB = async (body = {}) => {
  const wsfe = afip.ElectronicBilling;

  const last = await wsfe.getLastVoucher(1, 6);
  const next = last + 1;

  /**ESTA SECCION DE ACA ES TEMPORAL PARA EL MVP SE FIJA SI EL BODY TIENE LOS DATOS Y SINO LOS REMPLAZA POR VALORES DEFAULT ASI SIEMPRE FUNCIONA
   * obviamente lo vamos a tener que hacer bien con comprobaciones y eso para que no carguen cualquier cosa como datos negativos o ID que no existen..
   */
  const cliente = body.cliente || "Consumidor Final";
  const descripcion = body.descripcion || "Servicio";
  const docTipo = Number(body.docTipo || 99);
  const docNro = Number(body.docNro || 0);
  const today = new Date();
  const yyyymmdd = Number(today.toISOString().slice(0, 10).replace(/-/g, ""));

  const importeNeto = Number(body.importeNeto || 1000);
  const iva = +(importeNeto * 0.21).toFixed(2);
  const total = +(importeNeto + iva).toFixed(2);

  /**
   * MAS INFO DE LA DATA A CARGAR: https://docs.afipsdk.com/siguientes-pasos/web-services/factura-electronica
   * seccion de "Crear y asignar CAE a un comprobante"
   * o https://github.com/AfipSDK/afip.js/blob/master/examples/createVoucher.js para MUCHOS MAS DATOS
   */
  const data = {
    CantReg: 1,
    PtoVta: 1,
    CbteTipo: 6,
    Concepto: 1,

    DocTipo: docTipo,
    DocNro: docNro,
    CondicionIVAReceptorId: 5,

    CbteDesde: next,
    CbteHasta: next,
    CbteFch: yyyymmdd,

    ImpTotal: total,
    ImpTotConc: 0,
    ImpNeto: importeNeto,
    ImpOpEx: 0,
    ImpIVA: iva,
    ImpTrib: 0,

    Iva: [
      {
        Id: 5,
        BaseImp: importeNeto,
        Importe: iva,
      },
    ],

    MonId: "PES",
    MonCotiz: 1,
  };

  const factura = await wsfe.createVoucher(data);

  const pdfURL = await generarPdfFacturaB({
    comprobante: next,
    fechaVisual: yyyymmdd,
    cae: factura.CAE,
    vencimientoCae: factura.CAEFchVto,
    descripcion,
    importeNeto,
    iva,
    total,
  });

  return {
    cliente,
    descripcion,
    comprobante: next,
    cae: factura.CAE,
    vencimientoCae: factura.CAEFchVto,
    total,
    pdfURL,
  };
};

/**ACA EN LOS PARAMETROS DEBEERIA DE RECIBIR LA QUERY PARAM "?ptoVta=1&tipo=6"  */
facturaService.obtenerUltimaFactura = async () => {
  const wsfe = afip.ElectronicBilling;

  // de mientras lo hardcodeamos
  // 1 = Punto de venta
  // 6 = Factura B
  const ultimo = await wsfe.getLastVoucher(1, 6);

  return {
    ultimo,
    siguiente: ultimo + 1,
  };
};

async function generarPdfFacturaB({
  comprobante,
  fechaVisual,
  cae,
  vencimientoCae,
  descripcion,
  importeNeto,
  iva,
  total,
}) {
  const fileName = `factura-b-${comprobante}.pdf`;

  /**
   * EN EL FUTURO LA MAYORIA DE ESTO DEBERIA DE VENIR DE LA BDD DONDE TENEMOS A LOS CLIENTES
   * like "const cliente = await db.clientes.findById()"
   */
  const pdfData = {
    //template de afipsdk
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
            description: descripcion,
            quantity: 1,
            unit_price: importeNeto,
            subtotal: importeNeto,
          },
        ],

        vat_amount: iva,
        tributes_amount: 0,
        total_amount: total,
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

export default facturaService;
