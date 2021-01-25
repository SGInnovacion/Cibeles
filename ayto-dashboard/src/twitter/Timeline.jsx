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
