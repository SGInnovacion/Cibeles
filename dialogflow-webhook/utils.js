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

const AWS = require('aws-sdk');
let dynamoDB = new AWS.DynamoDB({ region: 'us-east-1'});
const http = require('http');
const axios = require('axios');

const recordStreet = async (street) => {
  try {
      let params = {
          TableName: 'Addresses',
          Key: {
              'address': { S: street }},
          UpdateExpression: 'SET #val = if_not_exists(#val, :zero) + :inc',
          ExpressionAttributeNames: { '#val': 'Value' },
          ExpressionAttributeValues: {
              ':inc': { N: '1' }, ':zero': { N: '0' }},
          ReturnValues: 'ALL_NEW'
      };
        const data = await dynamoDB.updateItem(params).promise();
        const response = {
            statusCode: 200,
            body: JSON.stringify('Counter updated'),
        };
        return response;
    } catch (err) {
      console.log(err, err.stack);
      return { statusCode: 400 }
    }
};

const recordManyStreets = async (streets) => streets.map(async street => await recordStreet(street));

const recordIntent = async (intentName, count) => {
  try {
      let params = {
          TableName: 'CibelesIntents',
          Key: {
              'intent': { S: intentName }},
          UpdateExpression: 'SET #val = if_not_exists(#val, :zero) + :inc, #last = :time',
          ExpressionAttributeNames: { '#val': 'Value', '#last': 'last_request' },
          ExpressionAttributeValues: {
              ':inc': { N: count.toString() }, ':zero': { N: '0' }, ':time' : { N: Date.now().toString()}},
          ReturnValues: 'ALL_NEW'
      };
      const data = await dynamoDB.updateItem(params).promise();
      return {
            statusCode: 200,
            body: JSON.stringify('Counter updated'),
        };
    } catch (err) {
      console.log(err, err.stack);
      return { statusCode: 400 }
    }
};

const recordManyIntents = async (intents) => Object.keys(intents).map(async k => await recordIntent(k, intents[k]));

const recordPetition = async (petition) => {
    let query =  {
        RequestItems: {
            ['CibelesPetitions']: [{
                PutRequest: {
                    Item: {
                         time: {"N": petition.time},
                            intent: {"S": petition.intent},
                            address: {"S": petition.address},
                            user: {"S": petition.user},
                            source: {"S": petition.source}
                    }
                }
            }]
        }
    };
    return new Promise(resolve => {
        dynamoDB.batchWriteItem(query, function (err, data){
            return err ? resolve( console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2)))
                : resolve('Success');
        })
    });
};

const recordManyPetitions = async (petitions) => petitions.map(async petition => await recordPetition(petition));

const dynamoRecord = (queries, correct, attendedBy, tableName) => {
    let query =  {
        RequestItems: {
            [tableName]: [{
                PutRequest: {
                    Item: {
                        id: {"N": Date.now().toString()},
                        correct: {"S": correct},
                        attendedBy: {"S": attendedBy},
                        queries: {
                            "L": queries.map(q => {
                                return {"S": q}
                            })
                        }
                    }
                }
            }]
        }
    };

    return new Promise(resolve => {
        dynamoDB.batchWriteItem(query, function (err, data){
            return err ? resolve( console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2)))
                : resolve('Success');
        })
    });
};

const recordQuery = (agent, intent) => {
    let context = agent.getContext('was-successful');
    console.log('[INFO] recordQuery: contexts');
    console.log(context);
    const firstRecord = (context && !context.parameters) || (context && context.parameters && !context.parameters.queries) ;
    if (firstRecord){
        context.parameters = {
            ...context.parameters,
            queries: [agent.query],
            attendedBy: intent,
        };
    } else{
        if(!context.parameters.queries.includes(agent.query)){
            context.parameters.queries.push(agent.query);
        }
    }
    agent.setContext(context);
};

const getHttp = (url, query, username = 'DUINNOVA', passw = 'Texeira1656') => {
    return new Promise((resolve, reject) => {
        const options = {
            host: encodeURI(url),
            path: encodeURI(query),
            headers: {
                'Authorization': 'Basic ' + Buffer.from(username + ':' + passw).toString('base64')
            }
        };

        const request = http.request(options, response => {

            response.setEncoding('binary');
            let returnData = '';

            if (response.statusCode < 200 || response.statusCode >= 300) {
                return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
            }
            response.on('data', chunk => {
                returnData += chunk;
            });
            response.on('end', () => resolve(returnData));
            response.on('error', error => {
                console.log(error);
                reject(error)});
        });
        request.end();
    });
};

const toTitleCase = (phrase) => {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace('ã', 'ñ');
};

const sendMail = async (mail, info, address) => {
    const ses = new AWS.SES({region: 'us-east-1'});
    var params = {
        Destination: {
            ToAddresses: [mail]
        },
        Message: {
            Body: {
                Text: { Data: "Test"
                },
                Html: {
                    Data: info
                },
            },
            Subject: { Data: `Tu consulta sobre ${address}`
            }
        },
        Source: "ayto.saturnolabs@gmail.com"
    };
    return ses.sendEmail(params, function (err) {
        return !err;
    });

};

const axiosRequest = async (url, token) => {
    let result = "";
    try {
        result = await axios.get(url, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token
            }
        });
    } catch (error) {
        console.log(error);
    }
    return result && result.data;
};

const getUserName = async (handlerInput) => {
    const { apiAccessToken, apiEndpoint } = handlerInput.requestEnvelope.context.System;
    const url = apiEndpoint.concat(`/v2/accounts/~current/settings/Profile.givenName`);
    return axiosRequest(url, apiAccessToken);
};

const getUserMail = async (handlerInput) => {
    const { apiAccessToken, apiEndpoint } = handlerInput.requestEnvelope.context.System;
    const url = apiEndpoint.concat(`/v2/accounts/~current/settings/Profile.email`);
    return axiosRequest(url, apiAccessToken);
};

module.exports = {
    dynamoRecord,
    recordQuery,
    getHttp,
    toTitleCase,
    sendMail,
    recordManyStreets,
    recordManyIntents,
    recordManyPetitions,
    recordStreet,
    recordIntent,
    recordPetition,
    getUserName,
    getUserMail
};
