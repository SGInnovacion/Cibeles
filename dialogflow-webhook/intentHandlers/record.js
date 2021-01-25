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

module.exports = async (street, url=false) => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  const response = address.planeamiento
  console.log(response)

  const current = response.parcela.exptePlaneamientoVigente && response.parcela.exptePlaneamientoVigente.length > 0 ? response.parcela.exptePlaneamientoVigente[0] : false

  const lastRecord = response.historicoExpedientes && response.historicoExpedientes.expedsHcosPlan && response.historicoExpedientes.expedsHcosPlan.length > 0
    ? response.historicoExpedientes.expedsHcosPlan[0] : false

  console.log('Current record: ', current)
  console.log('Last record: ', lastRecord)

  let speechText = current ? `El expediente vigente en ${address.parsedStreet} es el ${current.numero} con denominación ${current.denominacion}. `
    : lastRecord ? `El último expediente del histórico en ${address.parsedStreet} es el ${lastRecord.numero} con denominación ${lastRecord.denominacion}. `
      : `No dispongo de información sobre expedientes para ${address.parsedStreet}. `

  url = url ? (current ? current.numero : lastRecord ? lastRecord.numero : false) : false;
  speechText += url ? `Puede consultar la información en http://www-2.munimadrid.es/urbanismo_inter/visualizador/verActualizacionFichas.do?expediente=${url} \n` : '';


  return speechText
}
