  
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

export default function PieChart(props) {
  const classes = useStyles();
  let labels = [];
  let series = [];
  props.intents.map(int => {
        labels.push(int.intent);
        series.push(int.Value);
  });
  const state = {
          options: {
              labels: labels,
              colors:['#003df6','#3566f6','#6e83f6','#91aaf6','#aabcf6','#c2c7f6'],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },
          series: series
        };
  return (
      <Grid item xs={12} md={12} sm={12}>
          <Card className={classes.cardAnalytics} >
          <CardActionArea>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2" style={{fontFamily: 'Lato'}}>
                  Intenciones
                </Typography>
                <Grid container>
                    <Grid item xs={5} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography gutterBottom variant="body1" component="h2" style={{fontFamily: 'Lato'}}>
                            Una intención representa una interacción particular de la experiencia de voz, en base al propósito de la misma. En este caso se distinguen los diferentes tipo de consulta que puede realizar la ciudadanía
                        </Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <Chart options={state.options} series={state.series} type="donut" width={'100%'} height={280} />
                    </Grid>
                </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
        </Grid>
  );
}
