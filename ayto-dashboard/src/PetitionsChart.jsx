  
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
import { Card, CardActionArea, CardContent, CardMedia, CardActions, Typography, Button, Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Chart from 'react-apexcharts'

const useStyles = makeStyles(theme => ({
      media: {
        height: 90,
        margin: 30,
        objectFit: 'contain',
        backgroundSize: 'contain !important',
      },
      cardAnalytics: {
        margin: 10,
      },
    }));

export default function PetitionsChart(props) {
  const classes = useStyles();

  const trendingAddresses = [...props.addresses].sort((a,b) => b.Value - a.Value).slice(0, 11);
  const series = props.intents.map(int => {
      return {
          name: int.intent,
          data: trendingAddresses.map(address => {
              let count = props.petitions.filter(pet => pet.intent === int.intent && pet.address === address.address);
              return {
                  x: address.address,
                  y: count && count.length || 0
              };
          })
      }
  });
  const state = {
          options: {
            dataLabels: {
              enabled: false
            },
            colors: ["#003df6"],
          },
          series: series,
        }
  return (
      <Grid item xs={12} md={12} sm={12}>
          <Card className={classes.cardAnalytics} >
          <CardActionArea>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2" style={{fontFamily: 'Lato'}}>
                  Peticiones en las direcciones más consultadas
                </Typography>
                <Chart options={state.options} series={state.series} type="heatmap" width={'100%'} height={280} />
            </CardContent>
          </CardActionArea>
        </Card>
        </Grid>
  );
}
