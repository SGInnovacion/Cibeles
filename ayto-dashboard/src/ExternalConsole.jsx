import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, CardActions, Typography, Button, Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

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

export default function ExternalConsole(props) {
  const classes = useStyles();
  return (
      <Grid item xs={12} md={6}>
          <Card className={classes.cardAnalytics} >
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={props.imageUrl}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2" style={{fontFamily: 'Lato'}}>
                  {props.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p"  style={{fontFamily: 'Lato'}}>
                  {props.description}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" href={props.consoleUrl}>
              Ir a la consola
            </Button>
          </CardActions>
        </Card>
        </Grid>
  );
}
