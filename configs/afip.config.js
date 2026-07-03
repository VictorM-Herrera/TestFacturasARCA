import Afip from "@afipsdk/afip.js";

const afip = new Afip({
  CUIT: 20409378472, //cuit de prueba de afipsdk lo usamos para la muestra
  access_token: process.env.TOKEN_AFIP_SDK,
});

export default afip;

/**
 * Si tenemos CERTIFICADO SERIA:
 * 
 * import fs from 'fs';
 * import Afip from '@afipsdk/afip.js';
 * 
 * // Certificado (Puede estar guardado en archivos, DB, etc)
 * const cert = fs.readFileSync('ruta/a/certificado.crt', {encoding: 'utf8'});
 * // Key (Puede estar guardado en archivos, DB, etc)
 * const key = fs.readFileSync('ruta/a/key.key', {encoding: 'utf8'});
 * 
 * // CUIT NUESTRO ASOCIADO CON EL CERTIFICADO
 * const CUIT = [NUESTRO CUIT]};
 * 
 * const afip = new Afip({ 
 *  cert, 
 *  key, 
 *  CUIT,
 *  access_token: 'TU_ACCESS_TOKEN' // Obtenido de https://app.afipsdk.com
 * });
 * 
 * NOTA: EN CASO DE QUE EL CLIENTE YA NOS HAYA DELEGADO EL USO DE SU CUIT REMPLAZAMOS EL CUIT NUESTRO POR EL DE EL, PERO DEJAMOS LA KEY Y EL CERT NUESTRO
 * LO MISMO CON EL ACCESS TOKEN
 * TUTORIAL PARA ESO EN EL DRIVE
 */
