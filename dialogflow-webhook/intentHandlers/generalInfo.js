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
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  let response = address.planeamiento
  let speechText = ''
  const usos = address.planeamiento.parcela.usos
  console.log(usos)
  if (usos && usos.length !== 0) {
    speechText += `El uso asociado a ${address.parsedStreet} es ${usos[0].usoDenominacion.toLowerCase().trim()}. `
  };

  let area = address.planeamiento.parcela.usos[0].usoEdificabilidad
  speechText += (area === '---') ? ''
    : `Se puede construir ${area.replace('.', ',')} metros cuadrados del uso cualificado residencial vivienda colectiva. `

  zonaUrbanistica = response.parcela.zonaUrbanistica
  ambitoEtiqueta = response.parcela.ambitoEtiqueta
  ambitoDenominacion = response.parcela.ambitoDenominacion
  area = response.parcela.usos[0].usoEdificabilidad

  if (zonaUrbanistica != '---') {
    speechText += `Pertenece a la zona urbanística ${zonaUrbanistica}. `
  }
  speechText += `El ámbito es ${ambitoEtiqueta} `
  speechText += `y su denominación es ${ambitoDenominacion}. `

  const current = response.parcela.exptePlaneamientoVigente && response.parcela.exptePlaneamientoVigente.length > 0 ? response.parcela.exptePlaneamientoVigente : false

  const lastRecord = response.historicoExpedientes && response.historicoExpedientes.expedsHcosPlan && response.historicoExpedientes.expedsHcosPlan.length > 0
    ? response.historicoExpedientes.expedsHcosPlan[0] : false

  speechText += current ? `El expediente vigente es el ${current[0].numero} con denominación ${current[0].denominacion}. `
    : lastRecord ? `El último expediente del histórico es el ${lastRecord.numero} con denominación ${lastRecord.denominacion}. `
      : ''

  return speechText
}

// (i) Usos,
// (ii) Edificabilidad,
// (iii) Ambito y denominación,
// (vi) expediente y preguntar por el informe completo por correo.
