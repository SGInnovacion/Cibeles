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

const { getPlaneamiento } = require('../APIs')

module.exports = async (street) => {
// Normativa:
  // - Registro: zona urbanistica
  // - Derivar al ambito
  // - Metros cuadrados, cómo los puedes contruir (max altura etc)
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  const response = address.planeamiento
  console.log(response)

  zonaUrbanistica = response.parcela.zonaUrbanistica
  ambitoEtiqueta = response.parcela.ambitoEtiqueta
  ambitoDenominacion = response.parcela.ambitoDenominacion
  area = response.parcela.usos[0].usoEdificabilidad
  console.log('zonaUrbanistica: ', zonaUrbanistica)
  console.log('ambitoDenominacion: ', ambitoDenominacion)
  console.log('ambitoEtiqueta: ', ambitoEtiqueta)
  console.log('Area: ', area)

  let speechText = ''

  if (zonaUrbanistica != '---') {
    speechText += `${address.parsedStreet} pertenece a la zona urbanística ${zonaUrbanistica}. `
  }
  speechText += `El ámbito de ${address.parsedStreet} es ${ambitoEtiqueta} `
  speechText += `y su denominación es ${ambitoDenominacion}. `
  speechText += area !== '---' ? `Además, se pueden construir ${area.replace('.', ',')} metros cuadrados. ` : '';

  return speechText
}
