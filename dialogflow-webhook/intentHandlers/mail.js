/*
* Licencia con arreglo a la EUPL, Versión 1.2 o –en cuanto sean aprobadas por la
Comisión Europea– versiones posteriores de la EUPL (la «Licencia»);
* Solo podrá usarse esta obra si se respeta la Licencia.
* Puede obtenerse una copia de la Licencia en:
* http://joinup.ec.europa.eu/software/page/eupl/licence-eupl
* Salvo cuando lo exija la legislación aplicable o se acuerde por escrito, el programa
distribuido con arreglo a la Licencia se distribuye «TAL CUAL», SIN GARANTÍAS NI
CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
* Véase la Licencia en el idioma concreto que rige los permisos y limitaciones que
establece la Licencia.
*/

const { sendMail } = require('../utils')
const { fillMail } = require('../mail')

module.exports = async (street, email) => {
  try {
    console.log('fillMail', fillMail(street.planeamiento, street.parsedStreet))
    const success = await sendMail(email, fillMail(street.planeamiento, street.parsedStreet), street.parsedStreet)
    const out = 'Ya te lo he enviado. '
    return out
  } catch (error) {
    console.log(error)
    return 'Vaya, he tenido problemas para enviártelo. Comprueba que has habilitado los permisos de correo en la skill. '
  }
}
