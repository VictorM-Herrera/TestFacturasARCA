import Afip from '@afipsdk/afip.js'

const afip = new Afip({
    CUIT: 20409378472, //cuit de prueba de afipsdk
    access_token: process.env.TOKEN_AFIP_SDK
})

export default afip;