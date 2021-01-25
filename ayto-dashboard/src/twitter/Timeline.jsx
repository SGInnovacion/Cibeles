  
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


import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {TwitterTimelineEmbed} from 'react-twitter-embed';


export default function Timeline(props) {
    const useStyles = makeStyles(theme => ({
      cardAnalytics: {
        margin: 10,
      },
    }));
  const classes = useStyles();

  return (
      <Grid item xs={12} md={3} sm={12} alignItems={"stretch"}>
          <Card className={classes.cardAnalytics} >
          <CardActionArea>
            <CardContent>
              <TwitterTimelineEmbed
                sourceType="profile"
                screenName="madrid"
                options={{height: 660}}
              />
            </CardContent>
          </CardActionArea>
        </Card>
        </Grid>
  );
}
