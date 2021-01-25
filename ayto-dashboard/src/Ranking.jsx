import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, Typography, Grid, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

export default function Ranking(props) {
    const useStyles = makeStyles(theme => ({
      cardAnalytics: {
        margin: 10,
      },
    }));
  const classes = useStyles();
  let addresses = [...props.addresses];
  addresses.sort((a,b) => b.Value - a.Value).slice(0, 11);


  return (
      <Grid item xs={12} md={3} sm={12}>
          <Card className={classes.cardAnalytics} height={'100%'}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2" style={{fontFamily: 'Lato'}}>
                  Direcciones más consultadas
              </Typography>
                <div className={'rankingContainer'} style={{overflow: 'auto', height: '590px' }} >
                    <Table className={classes.table} stickyHeader aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <TableCell align={"center"}>Posición</TableCell>
                        <TableCell align="center">Consultas</TableCell>
                        <TableCell align="left">Dirección</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {addresses.map((row, i) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                             <TableCell align="center">{i+1}</TableCell>
                             <TableCell align="center">{row.Value}</TableCell>
                             <TableCell align="left">{row.address}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
               </Table>
                </div>
            </CardContent>
          </CardActionArea>
        </Card>
        </Grid>
  );
}
