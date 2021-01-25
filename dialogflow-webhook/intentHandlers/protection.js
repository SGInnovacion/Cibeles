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

const { planeamientoNdp, bdcSearch, getPlaneamiento } = require('../APIs')

const general = async street => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  console.log(street)
  console.log(address)
  const response = address.planeamiento
  const catalogo = response.catalogo
  const patrimonioHistorico = response.patrimonioHistorico
  const perteneceArrabalFelipeII = response.parcela.perteneceArrabalFelipeII === 'true'
  const perteneceAPE0001 = response.parcela.perteneceAPE0001 === 'true'

  let speechText = `${address.parsedStreet} `
  const anyCatalogue = Object.keys(catalogo).find(key => catalogo[key] !== [] && catalogo[key][0] && catalogo[key][0].proteccionActual !== undefined)
  const affectedPatrimonio = patrimonioHistorico && patrimonioHistorico.length !== 0


    speechText += anyCatalogue ? `tiene un grado de protección ${catalogo[anyCatalogue][0].proteccionActual} como ${anyCatalogue}. ` : '';
    speechText += affectedPatrimonio ? 'Forma parte del Patrimonio Histórico de la Comunidad de Madrid. '
        : '';


  if (perteneceArrabalFelipeII && perteneceAPE0001) {
    speechText += 'Además, pertenece a la Cerca y Arrabal de Felipe II y al APE0001. '
  } else if (perteneceAPE0001) {
    speechText += 'Además, pertenece al APE0001. '
  } else if (perteneceArrabalFelipeII) {
    speechText += 'Además, pertenece la Cerca y Arrabal de Felipe II. '
  }
  if (speechText === `${address.parsedStreet} `) {
    return speechText + 'no está protegido. '
  }
  return speechText
}

const felipe = async street => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  const response = address.planeamiento; console.log(response)
  const perteneceArrabalFelipeII = response.parcela.perteneceArrabalFelipeII === 'true'
  console.log('Pertenece felipe o ape:', perteneceArrabalFelipeII)

  const speechText = perteneceArrabalFelipeII ? `Sí, ${address.parsedStreet} pertenece la Cerca y Arrabal de Felipe II. `
    : `No, ${address.parsedStreet} no pertenece la Cerca y Arrabal de Felipe II. `

  console.log('speechText: ', speechText)
  return speechText
}

const ape = async street => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  const response = address.planeamiento
  console.log(response)
  const perteneceAPE0001 = response.parcela.perteneceAPE0001 === 'true'
  console.log('[INFO] Pertenece ape:')
  console.log(perteneceAPE0001)
  const speechText = perteneceAPE0001 ? `Sí, ${address.parsedStreet} pertenece al APE0001.`
    : `No, ${address.parsedStreet} no pertenece al APE0001.`
  console.log(speechText)
  return speechText
}

const bip = async street => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  const response = address.planeamiento
  console.log(response)
  const patrimonioHistorico = response.patrimonioHistorico
  console.log('[INFO] patrimonioHistorico')
  console.log(patrimonioHistorico)
  const checkBip = (patrimonio) => patrimonio.categoria.includes('BIP')
  const speechText = patrimonioHistorico.some(checkBip)
    ? `${address.parsedStreet} es un Bien de interés patrimonial` : `${address.parsedStreet} no es un bien de interés patrimonial`
  return speechText
}

const bic = async street => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  const response = address.planeamiento

  console.log(response)
  const patrimonioHistorico = response.patrimonioHistorico
  console.log('[INFO] patrimonioHistorico')
  console.log(patrimonioHistorico)

  const checkBic = (patrimonio) => patrimonio.categoria.includes('BIC')

  const speechText = patrimonioHistorico.some(checkBic)
    ? `${address.parsedStreet} es un Bien de interés cultural` : `${address.parsedStreet} no es un bien de interés cultural`

  return speechText
}

const catalogue = async street => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  const response = address.planeamiento
  console.log(response)
  const catalogo = response.catalogo
  console.log('[INFO] Catalogo')
  console.log(catalogo)
  let speechText = `La protección de ${address.parsedStreet} `
  const protectedCat = Object.keys(catalogo).filter(key => {
    try {
      console.log(catalogo[key][0].proteccionActual)
    } catch (e) {
      console.log(e)
    }
    return catalogo[key] !== [] && catalogo[key][0] && catalogo[key][0].proteccionActual !== undefined
  })
  console.log('[INFO] Protected cat:')
  console.log(protectedCat)
  if (protectedCat !== undefined && protectedCat.length > 0) {
    protectedCat.map((category, i) => speechText += `${i === protectedCat.length - 1 && protectedCat.length > 1 ? 'y ' : ', '} como ${category} es ${catalogo[category][0].proteccionActual}`)
  } else {
    speechText = 'El edificio no está protegido.'
  }
  console.log('[INFO] Speechtext')
  console.log(speechText)
  return speechText
}

module.exports = {
  general,
  felipe,
  ape,
  catalogue,
  bip,
  bic
}
