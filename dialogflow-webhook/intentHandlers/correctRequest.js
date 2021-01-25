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

const { dynamoRecord } = require('../utils')

module.exports = (agent) => {
  console.log('[INFO] Correct request handler: contexts')
  console.log(agent.contexts)
  agent.add('De acuerdo, me acordaré de eso')
  const context = agent.getContext('was-successful')
  return dynamoRecord(context.parameters.queries, agent.query, context.parameters.attendedBy, 'AytoFailedRequests')
}
