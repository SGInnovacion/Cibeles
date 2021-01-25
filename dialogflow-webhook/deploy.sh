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


#echo 'Installing dependencies...'
#npm install
echo 'Compressing deployment package...'
zip -ru webhook.zip *

if [ "$#" -eq  "0" ]; then

	echo 'Compressed.'
	echo 'Deploying Alexa to AWS Lambda...'
	aws configure set region us-east-1
	echo 'Region changed to us-east-1'
	aws lambda update-function-code --function-name ayto-webhook --zip-file fileb://./webhook.zip > /dev/null
	echo 'Done!'

	echo 'Deploying Dialogflow to AWS Lambda...'
	aws configure set region us-east-2
	echo 'Region changed to us-east-2'
	aws lambda update-function-code --function-name auto-webhook --zip-file fileb://./webhook.zip > /dev/null
	echo 'Done!'
	echo 'Deployment Complete'

else

	if [ "$1" ==  dialog ]; then

	echo 'Compressed. Deploying Dialogflow to AWS Lambda...'
	aws configure set region us-east-2
	echo 'Region changed to us-east-2'
	aws lambda update-function-code --function-name auto-webhook --zip-file fileb://./webhook.zip > /dev/null
	echo 'Deployment Complete'
	
	fi

	if [ "$1" ==  alexa ]; then

	echo 'Compressed.'
	echo 'Deploying Alexa to AWS Lambda...'
	aws configure set region us-east-1
	echo 'Region changed to us-east-1'
	aws lambda update-function-code --function-name ayto-webhook --zip-file fileb://./webhook.zip > /dev/null
	echo 'Done!'

	fi

fi
