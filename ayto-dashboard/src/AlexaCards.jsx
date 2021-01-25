  
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


import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import hash from 'object-hash';

const useStyles = makeStyles(theme => ({
          card: {
            fontFamily: 'Lato',
            flexGrow: 1,
            margin: 10,
            width: 'auto',
            height: 150,
          },
          fullHeight: {
            height: '90%',
          },
        }));
const findMode = petitions => {
    let aux = {};
    petitions.forEach(pet => {
        let key = hash(pet);
        if (aux.hasOwnProperty(key)) {
           aux[key] += 1;
        } else {
            aux[key] = 1
        }
    });
    return Math.max(...Object.values(aux));
}

const convertToCSV = (objArray) => {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }
    str = str.replace('ã', 'ñ');
    return str;
}

const exportCSVFile = (headers, items, fileTitle) => {
    if (headers) {
        items.unshift(headers);
    }
    // Convert Object to JSON
    let jsonObject = JSON.stringify(items);
    let csv = convertToCSV(jsonObject);
    let exportedFilenmae = fileTitle + '.csv' || 'export.csv';
    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        let link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
const findLastPetition = petitions => Math.max(...petitions.map(p => p.time));

export default function AlexaCards (props) {
    let mails = props.intents.find(int => int.intent === 'mail');
    let lastPet = new Date(findLastPetition(props.petitions));
    let petitionHeaders = {
        user: 'user',
        time: 'time',
        source: 'source',
        address: 'address',
        intent: 'intent',
    };
    let addressessHeaders = {
        count: 'Value',
        address: 'address',
    };
    // let petitions = props.petitions.map(pet => ({..pet, }))
    let anonymousPetitions = props.petitions.map(pet =>  ({intent: pet.intent, address: pet.address }));
        const DATA = [
          {
            title: 'Usuarios únicos',
            num: [...new Set(props.petitions.map(pet => pet.user.includes('amzn1.ask') ? pet.user : 'anonimo'))].length,
            description: 'Número total de personas diferentes que han utilizado la apliación',
            color: 'color',
          },
          {
            title: 'Sesiones',
            description: 'Número de veces que se ha abierto la aplicación',
            num: [...new Set(props.petitions.map(pet => pet.user))].length,
            color: 'color',
          },
          {
            title: 'Mails enviados',
            num: mails && mails.hasOwnProperty('Value') ? mails.Value : 0,
            color: 'color',
          },
          {
            title: 'Máxima recurrencia',
            num: findMode(anonymousPetitions),
            description: 'Número máximo de veces que se ha solicitado la misma consulta',
            color: 'color',
          },
          {
            title: 'Última consulta',
              description: 'Cuándo se realizó la última consulta',
            num: lastPet.getDate() + '/' + lastPet.getMonth(),
            color: 'color',
          },
          {
            title: 'Peticiones totales',
            description: 'Número total de peticiones realizadas.',
            num: props.petitions.length,
            color: 'color',
          },
          {
            title: 'Descargar peticiones',
            description: 'Historial completo de uso de la aplicación (usuarios anonimizados)',
            num: 'CSV',
            handler: () => exportCSVFile(petitionHeaders, props.petitions, 'petitions'),
            color: 'color',
          },
          {
            title: 'Descargar direcciones',
            description: 'Direcciones y número de veces consultadas',
            num: 'CSV',
            handler: () => exportCSVFile(addressessHeaders, props.addresses, 'addresses'),
            color: 'color',
          },
        ];
        const MyCard = (name, num, i, description = '', handler) => {
          const classes = useStyles();
          return (
              <Grid item xs={12} md={3} sm={4} onClick={ () => typeof handler === 'function' ? handler() : null}>
                   <Card key={i} className={classes.card}>
                    <CardActionArea className={classes.fullHeight}>
                      <CardContent className={classes.fullHeight}>
                          <Grid container alignItems={"stretch"} className={classes.fullHeight}>
                              <Grid item xs={8}>
                                  <Typography variant={'h6'} color="textSecondary" style={{height: '25%'}}  style={{fontFamily: 'Lato'}}>
                                    {name}
                                  </Typography>
                                  <Typography variant={'body2'} color="textSecondary" style={{height: '25%'}}  style={{fontFamily: 'Lato'}}>
                                    {description}
                                  </Typography>
                              </Grid>
                              <Grid item xs={4} justify={"center"} alignItems={"center"} style={{alignSelf: "center"}}>
                                  <Typography variant="h4" component="h4" style={{height: '75%%'}}  align={"center"} style={{fontFamily: 'Lato'}}>
                                    {num}
                                  </Typography>
                              </Grid>
                          </Grid>


                      </CardContent>
                    </CardActionArea>
                  </Card>
              </Grid>
          );
        };
        return (
            <Grid item xs={12} md={12} sm={12}>
              <Grid container id={'alexaCards'} alignItems={"stretch"}>
              {DATA.map((d,i) => MyCard(d.title, d.num, i, d.description, d.handler))}
              </Grid>
            </Grid>
        );
}
