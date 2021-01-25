import React, {useEffect, useState} from 'react';
import './App.css';
import indigo from '@material-ui/core/colors/indigo';
import green from '@material-ui/core/colors/red';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Assessment';
import Grid from "@material-ui/core/Grid";
import AWS from 'aws-sdk';

import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import AlexaCards from "./AlexaCards";
import ExternalConsole from "./ExternalConsole";
import {ALEXA_URL, DIALOG_URL} from "./constants";
import Ranking from "./Ranking";
import Timeline from "./twitter/Timeline";
import PieChart from "./PieChart";
import PetitionsChart from "./PetitionsChart";

const theme = createMuiTheme({
  palette: {
    // type: 'dark',
  primary: {
    light: indigo[300],
    main: indigo.A700,
    dark: indigo[700],
  },
  secondary: {
    light: green.A200,
    main: green.A400,
    dark: green.A700,
    contrastText: green.A400,
  },
  error: {
    light: green.A200,
    main: green.A400,
    dark: green.A700,
    contrastText: green.A400,
  },
},
  status: {
    danger: 'orange',
  },
});

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  cardAnalytics: {
        margin: 10,
  },
}));

const dynamoScan = (dataTable, handler) => {
  AWS.config.region = 'us-east-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: "us-east-1:dbfe944e-af56-44ba-99fa-327e3eb907d8"});
  let dynamoClient = new AWS.DynamoDB.DocumentClient();
  const params = { TableName: dataTable, Select: "ALL_ATTRIBUTES" };
  dynamoClient.scan(params, function(err, data) {
    if (err) {
       console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
       handler(data.Items);
    }
  });
};

function App() {
  const classes = useStyles();
  const [intents, setIntents] = useState([]);
  const [petitions, setPetitions] = useState([]);
  const [addresses, setAddresses] = useState([]);


  useEffect(() => dynamoScan('CibelesIntents', setIntents), []);
  useEffect(() => dynamoScan('CibelesPetitions', setPetitions), []);
  useEffect(() => dynamoScan('Addresses', setAddresses), []);


  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}  style={{fontFamily: 'Lato'}}>
            Panel de analíticas
          </Typography>
        </Toolbar>
      </AppBar>
        <Grid container direction={"row"} alignItems={"stretch"}>
          <Ranking classes={classes} addresses={addresses}/>
          <Timeline/>
          <Grid item xs={12} md={6} sm={12}>
              <Grid container id={'alexaCards'} alignItems={"stretch"}>
                <PieChart intents={intents}/>
                <PetitionsChart petitions={petitions} addresses={addresses} intents={intents}/>
              </Grid>
            </Grid>

          {/*<AlexaCards/>*/}
        </Grid>
        <AlexaCards petitions={petitions} intents={intents} addresses={addresses}/>
        <Grid container>

        <ExternalConsole title={'Alexa Developer Console'}
                         description={'Accede a la ventana de analítica de Alexa para conocer las interacciones de la Skill en detalle'}
                         imageUrl={'./alexa.png'}
                         consoleUrl={ALEXA_URL}
        />
        <ExternalConsole title={'Dialogflow Developer Console'}
                         description={'Accede a la ventana de analítica de Dialogflow para conocer las interacciones del bot de Twitter en detalle'}
                         imageUrl={'./dialogflow.png'}
                         consoleUrl={DIALOG_URL}
        />
        </Grid>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
