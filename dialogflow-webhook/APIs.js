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

const { getHttp, getHttpAuth, toTitleCase } = require('./utils');

const PLAN_URL = 'www-2.munimadrid.es';
const BDC_URL = 'www-j.munimadrid.es';

const planeamientoCoordinates = (x = '442879' , y = '4475446') => {
    /*  {
        "codigo": 0,
        "mensaje": "Consulta realizada con éxito",
        "parcela": {
        "idubo": "26260",
            "etiqueta": "A05453",
            "superficieGIS": "1117.616118",
            "superficieCalculo": "---",
            "ambitoEtiqueta": "APE.04.06",
            "ambitoDenominacion": "COCHERAS EMT",
            "usos": [
            {
                "usoId": "052D450000",",
                "usoDenominacion": "DOTACIONAL ZONAS VERDES BÁSICO ",
                "usoObservacion": "---
                "usoEdificabilidad": "---",
                "unidadId": "1",
                "unidadDescripcion": "---"
            }
        ],
            "zonaUrbanistica": "---",
            "perteneceArrabalFelipeII": "false",
            "perteneceAPE0001": "true",
            "exptePlaneamientoVigente": [

        ]
    },
        "historicoExpedientes": {
        "expedsHcosPlan": [
            {
                "numero": "135/2018/00678",
                "figura": "PE.00.313",
                "denominacion": "Regulación Servicios Terciarios Hospedaje",
                "fase": "Aprobación Definitiva",
                "fechaAprobacion": "27/3/2019"
            },
            {
                "numero": "711/2012/12710",
                "figura": "PE.04.374",
                "denominacion": "C/ Alcántara, 24 y 26",
                "fase": "Aprobación Definitiva",
                "fechaAprobacion": "26/9/2012"
            }
        ],
            "expedsHcosGes": [
            {
                "numero": "714/2002/06280",
                "figura": "UE.04.310",
                "denominacion": "APE 04.06 Cocheras E.M.T.",
                "fase": "Ratificación",
                "fechaAprobacion": "27/3/2003"
            }
        ],
            "expedsHcosUrb": [
            {
                "numero": "714/2002/06125",
                "figura": "PU.04.315",
                "denominacion": "APE.04.06 Cocheras de la EMT",
                "fase": "Aprobación Definitiva",
                "fechaAprobacion": "14/2/2003"
            }
        ]
    },
        "patrimonioHistorico": [
        {
            "descripcion": "RECINTO DE LA VILLA DE MADRID",
            "clase": "ENTORNO DE BIEN PROTEGIDO",
            "categoria": "ENTORNO DE BIEN PROTEGIDO (BIC DECLARADO EN LA CATEGORÍA DE CONJUNTO HISTÓRICO \"REC.VILLA MADRID\")"
        }
    ],
        "catalogo": {
        "edificio": [

        ],
            "establecimientoComercial": [

        ],
            "parqueJardin": [

        ],
            "elementoSingular": [

        ]
    }
    }*/


    const path = `/RPGCS_RSPLAN/rest/getInfo.iam?x=${x}&y=${y}`;
    return getHttp(PLAN_URL, path).then(res => {
        console.log(res);
        return JSON.parse(res);
    })
};

const planeamientoAddress = (claseVia = 'calle', nomVia = 'mayor', num = '2') => {
    const path = `/RPGCS_RSPLAN/rest/getInfo.iam?claseVia=${claseVia}&nomVia=${nomVia}&tipoApp=N&num=${num}&calif=`;
    return getHttp(PLAN_URL, path).then(res => {
        return JSON.parse(res);
    })
};

const planeamientoNdp = async (ndp = '11138219') => {
    const path = `/RPGCS_RSPLAN/rest/getInfo.iam?idNdp=${ndp}`;
    return getHttp(PLAN_URL, path).then(res => {
        return JSON.parse(res);
    })
};

const bdcSearch = async (street) => {
    const path = `/BDCTR_RSGENERAL/restBDC/validarEspaguetti?cadena=${street}`;
    return getHttp(BDC_URL, path).then(res => {
        return JSON.parse(res)[0];
    })
};

async function getPlaneamiento(street) {
    let result = await bdcSearch(street);
    let NDP = result.codigoNdps;
    if (NDP === 0) { return false}
    let claseVial = result.claseVial;
    let nombre = result.viales;
    let numero = result.numeros || '';
    let calificador = result.calificador;
    let parsedStreet = toTitleCase(`${claseVial} ${nombre} ${numero} ${calificador.toUpperCase()}`);
    let planeamiento = await planeamientoNdp(NDP);
    return { planeamiento: planeamiento, parsedStreet: parsedStreet.trim()};
};

module.exports = {
    planeamientoCoordinates,
    planeamientoAddress,
    planeamientoNdp,
    bdcSearch,
    getPlaneamiento,
};
