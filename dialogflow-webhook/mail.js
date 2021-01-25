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

const parseGeneralInfo = parcela => {
    let out = '';
    try {
        out = `
                ${parcela.ambitoDenominacion.includes('ZONA') ? '' : `
                       <b>Parcela</b>
                       <p>${parcela.ambitoDenominacion}</p>
                         `}
                  
                       <b>Superficie</b>
                       <p>${
                            parcela.superficieCalculo.includes('---') ? parseFloat(parcela.superficieGIS).toFixed(2) :
                            parseFloat(parcela.superficieCalculo).toFixed(2)
                            } m<sup>2</sup></p>
                       <b>Ámbito de ordenación</b>
                       <p>${
                            parcela.ambitoDenominacion.includes('ZONA') ? parcela.ambitoDenominacion : 
                                (parcela.ambitoEtiqueta + ' ' + parcela.ambitoDenominacion)
                        }</p>
                       
                      ${parcela.zonaUrbanistica.includes('---') ? '' : `
                       <b>Zona urbanística</b>
                       <p>${parcela.zonaUrbanistica}</p>
                  `}
        `;
    } catch (e) {
        console.log(e);
    }
    return out;
};
const parseMainUse = main => {
    let out = '';
    try {
        out = `
                <tr>
                     <td>${main.usoDenominacion}</td>
                     <td>${main.usoEdificabilidad} m<sup>2</sup></td>
                </tr>        
        `;
    } catch (e) {
        console.log(e);
    }
    return out;
};
const parseVigente = vigente => {
    let out = '';
    try {
        out = `
            <div class="expediente">
                 <div class="section-title">Expediente y planeamiento vigente</div>
                 <div class="expediente-info">
                      <table class='exp-table' style="min-width: 60%">
                                  <tr>
                                    <th align="left" class='table-title' style="font-size: 1.3em;">
                                         <b>Número</b></th>
                                    <th align="left" class='table-title' style="font-size: 1.3em;">
                                         <b>Denominación</b></th>

                                  </tr>
                                  <tr>
                                    <td>${vigente.numero}</td>
                                    <td>${vigente.denominacion}</td>
                                  </tr>
                                  <tr>
                                    <th align="left" class='table-title' style="font-size: 1.3em;">
                                         <b>Fase</b></th>
                                    <th align="left" class='table-title' style="font-size: 1.3em;">
                                         <b>Fecha</b></th>
                                   </tr>
                                  <tr>
                                    <td>${vigente.fase}</td>
                                    <td>${vigente.fechaAprobacion}</td>
                                  </tr>
                      </table>
                 </div>
            </div>
        `;
    } catch (e) {
        console.log(e);
    }
    return out;
};
const parseProteccion = catalogo => {
    let out = '';
    try {
        let anyCatalogue = Object.keys(catalogo).find( key => catalogo[key] !== [] && catalogo[key][0] && catalogo[key][0].proteccionActual !== undefined);
        anyCatalogue = typeof anyCatalogue === 'string' ? [anyCatalogue] : anyCatalogue;

        if (anyCatalogue !== undefined && anyCatalogue.length > 0) {
                out += `
                        <table class='patr-table' style="width:100%">
                          <tr>
                            <th align="left" class='table-title' style="font-size: 1.3em;">
                                 <b>Catálogo</b></th>
                             <th align="left" class='table-title' style="font-size: 1.3em;">
                                 <b>Número</b></th>
                             <th align="left" class='table-title' style="font-size: 1.3em;">
                                 <b>Protección</b></th>
                          </tr>
                `;
            anyCatalogue.map(category => {
                let name = category === 'edificio' ? 'Edificio' :
                    (category === 'establecimientoComercial' ? 'Establecimiento comercial' :
                    (category === 'parqueJardin' ? 'Parque o jardín' : 'Elemento singular'));

                out += `
                          <tr>
                            <td>${name}:</td>
                            <td>${catalogo[category][0].numeroCatalogo}</td>
                            <td>${catalogo[category][0].proteccionActual}</td>
                          </tr>
                `;
            })
            out += `
                 </table>
            `;
        }
        } catch (e) {
            console.log(e);
        }
        return out;
};
const parseFelipeAPE = parcela => {
    let out = '';
    try {
        out +=  parcela.perteneceArrabalFelipeII === 'true' ? `<p style="font-weight: 800">Está incluido en la Cerca y Arrabal de Felipe II</p>` : '';
        out +=  parcela.perteneceAPE0001 === 'true' ? `<p style="font-weight: 800">Está incluido en el APE.00.01 Centro Histórico</p>` : '';
    } catch (e) {
        console.log(e);
    }
    return out;
};
const parseCAM = cam => {
    let out = '';
    try{
        if (cam.length === 0 ) return '';
    else {
         out = `
            <div class="patrimonio-cam">
            <div class="section-title">Patrimonio histórico de la Comunidad de Madrid</div>
                <table class='cam-table' style="width:100%">
                      <tr>
                        <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Clase</b></th>
                         <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Categoría</b></th>
                         <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Denominación</b></th>
                      </tr>
        `;

        cam.map(elem => {
            out += `
                      <tr>
                        <td>${elem.clase}</td>
                        <td>${elem.categoria}</td>
                        <td>${elem.descripcion}</td>
                      </tr>
            `;
        });

        out += '</table></div>';
        }
    } catch (e) {
        console.log(e)
    }
    return '';
};
const parseHistoricoExpte = history => {
    let out = '';
    try {
            if (history.length === 0 ) return '';
            else {
                out = `
                      <table class='planeamiento-table' style="width:100%">
                      `;

                history.map(h => {
                    out += `
                              <tr><td>
                              <a href="http://www-2.munimadrid.es/urbanismo_inter/visualizador/verActualizacionFichas.do?expediente=${h.numero}">
                                ${h.numero} ${h.denominacion}
                              </a>
                              </td></tr>
                              <tr>
                                <td>${h.fase} ${h.fechaAprobacion}</td>
                              </tr>
                              <tr><td></td></tr>
                    `;
                });

                out += '</table>';
            }
    } catch (e) {
        console.log(e);
    }
    return out;
};

const style = `
<style type="text/css">
body{
     margin: 0;
     font-size: 14px;
     font-family: 'Lato', sans-serif;
    height:100% !important;
    margin:0 !important;
    padding:0 !important;
    width:100% !important;
}
.logo{
 object-fit: contain;
}
.general-info{
     padding: 0.3em;
}
.section-title{
     font-size: 1.5em;
     text-decoration: underline;
     margin-bottom: 0.3em;
}
.section-info{
     display: flex;
     flex-direction: column;
     /*padding: 0.3em;*/
     padding: 1.4em;
     margin-bottom: 15px;
}
@media (max-width: 500px) {
     .section-info {
          flex-direction: column;
     }

     .col-izda{
          padding: 0.3em;
     }
}
.col-izda{
     flex:1 1;
}
.col-dcha{
     flex: 2 1;
}
.uses-table{
     background-color: #f5f5f5;
     flex: 1;
     padding: 0.3em;
}
.uses-table tr{
     line-height: 2em;
}
.table-title{
     font-size: 1.3em;
     line-height: 2em;
}
.exp-table{
     width: 100%;
     padding-left: 10px;
     margin-bottom: 15px;
}
.exp-title{
    font-size: 1.3em;
    margin-top: 1.4em;
    margin-bottom: 0.35em;
    text-decoration: none;
}
.expediente{
     padding: 0.3em;
}
.proteccion{
     background-color: #f5f5f5;
     padding: 1.4em;
     color: black;
     margin: 0.3em;
}
.patr-table{
    margin-bottom: 2em;
}
.patrimonio-cam{
     background-color: #f5f5f5;
     padding: 1.4em;
     color: black;
     margin: 0.3em;
}
.historico{
     padding: 0.3em;
}
.planeamiento{
     padding: 0.3em;
}
</style>
`;
const fillMail = (plan = '', address) => {

    let out = '';
    let hasExp = parseHistoricoExpte(plan.historicoExpedientes.expedsHcosPlan) !== ''
        || parseHistoricoExpte(plan.historicoExpedientes.expedsHcosPlan) !== ''
        || parseHistoricoExpte(plan.historicoExpedientes.expedsHcosUrb) !== '';

    console.log(parseHistoricoExpte(plan.historicoExpedientes.expedsHcosPlan) !== '')
    console.log(parseHistoricoExpte(plan.historicoExpedientes.expedsHcosGes) !== '')
    console.log(parseHistoricoExpte(plan.historicoExpedientes.expedsHcosUrb) !== '')
    console.log(hasExp);
    console.log(plan.historicoExpedientes);


    try{
        out = `
           <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="https://www.w3.org/1999/xhtml">
            <head>
                <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i,900,900i&display=swap" rel="stylesheet">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
                 ${style}
                <title>Test Email Sample</title>
            </head>
            <body>
            <table border="0" cellpadding="0" cellspacing="0" class="container" width="100%" style="height: 50px; width: 100%; background-color: #003df6">
                <tr>
                    <td align="left" width="60%" style="padding: 8px;">
                        <span style="font-size: 1.5em; color: white"></span>
                    </td>
                    <td align="right" width="40%" style="padding: 5px;">
                        <img class='logo' style="height: 40px; object-fit: contain" src="https://identidad.madrid.es/wp-content/uploads/2018/12/firma_madrid_blanco.png">
                    </td>
                </tr>
            </table>
            <div class="sub-header" style="  background-color: black;  color: white; padding: 15px; font-size: 1em; margin-bottom: 15px;">
                 Esta es toda la información urbanística que disponemos de ${address}
            </div>
            
            <div class="info" style="padding: 10px">
            <div class="general-info">
                 <div class="section-title">Datos generales y usos cualificados</div>
                 <div class="section-info">
                      <div class="col-izda">
                      ${parseGeneralInfo(plan.parcela)}
                      </div>
                 </div>
                 <div class="section-info">
                      <div class="col-dcha">
                           <table class='uses-table' style="width:100%">
                                  <tr>
                                    <th align="left" class='table-title' style="font-size: 1.3em;"><b>Principal:</b></th>
                                    <th></th>
                                  </tr>
                                  ${parseMainUse(plan.parcela.usos[0])}
                           </table>
                      </div>
                 </div>
            </div>
        ${plan.parcela.exptePlaneamientoVigente.length > 0 ? parseVigente(plan.parcela.exptePlaneamientoVigente[0]): ''}

        ${
        (parseProteccion(plan.catalogo) !== '' ||parseFelipeAPE(plan.parcela) !== '' ) ?
            `
            <div class="proteccion">
            <div class="section-title">Protección del patrimonio</div>
                 ${parseProteccion(plan.catalogo)}
                ${parseFelipeAPE(plan.parcela)}
            </div>
            ` :''
        }

        ${parseCAM(plan.patrimonioHistorico)}

        ${
                (hasExp)  ? `
              
                <div class="historico">
                <div class="section-title">Histórico de expedientes</div>
                ${parseHistoricoExpte(plan.historicoExpedientes.expedsHcosPlan) !== '' ? `
                <div class="exp-title">Planeamiento</div>
                ${parseHistoricoExpte(plan.historicoExpedientes.expedsHcosPlan)}
                `: ''}
                ${parseHistoricoExpte(plan.historicoExpedientes.expedsHcosGes) !== '' ? `
                <div class="exp-title">Gestión</div>
                ${parseHistoricoExpte(plan.historicoExpedientes.expedsHcosGes)}
                `: ''}
                ${parseHistoricoExpte(plan.historicoExpedientes.expedsHcosUrb) !== '' ? `
                <div class="exp-title">Urbanización</div>
                ${parseHistoricoExpte(plan.historicoExpedientes.expedsHcosUrb)}
                `: ''}
                ` : ''}

        </div>
        </div>
        </body>
        </html>
    `;
    } catch (e) {
        console.log(e)
    }
    return out;
};

module.exports = { fillMail };
