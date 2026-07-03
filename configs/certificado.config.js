import "dotenv/config";
import Afip from "@afipsdk/afip.js";

/**
 * AVISO, esta configuracion es para usar el CUIT de la empresa para generar un certificado y poder usar los WebServices como el de Facturacion Electronica
 * Luego con el CUIT de nuestro cliente, el TOKEN de afip sdk y el certificado que sacamos con esto
 * le vamos a estar generando las facturas al cliente.
 * mas info: https://afipsdk.com/docs/automations/create-cert-dev/nodejs/
 */

const afip = new Afip({ access_token: process.env.TOKEN_AFIP_SDK }); //El token de nuestra empresa
// console.log(process.env.TOKEN_AFIP_SDK);

const data = {
  cuit: process.env.CUIT,//NUESTRO CUIT
  username: process.env.CUIT,//NUESTRO CUIT
  password: process.env.PASSWORD,//LA CLAVE FISCAL ASOCIADA A NUESTRO CUIT (REPITO esto lo saca Nabil i guess)
  alias: "afipsdk",//Nombre para el certificado... creo que va cualquier cosa
};
try {
  const response = await afip.CreateAutomation("create-cert-dev", data, true);
  console.log(response);
  /**
   * LA respuesta deberia ser: hay que guardar el CERT y la KEY para usarlas luego en la CONFIG DE AFIP en el servidor
   * {
    "id": "0c31d74f-d672-4677-a00b-7dc865396c69",
    "status": "complete",
    "data": {
        "cert": "-----BEGIN CERTIFICATE-----\nMIIDRzC...",
        "key": "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEowIBAAKCA..."
    }
}
   */
} catch (error) {
  console.log(error);
}

//ACA ESTO NO SE SI DEBERIA DE EXPORTARSE O CREARSE UN ENDPOIN PARA GENERAR ESTOS CERTIFICADOS, LA COSA ES QUE SE CREE UNA VEZ Y LUEGO SE USE EN EL PROYECTO
//LO SUBO ESTO AL REPO PARA QUE VEAN SU FUNCIONAMIENTO E:E
//CORRERLO TIPO: node certificado.config.js en la consola
