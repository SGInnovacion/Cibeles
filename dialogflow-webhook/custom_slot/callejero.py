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



import csv

file = open('./street-slot 2.csv', newline='\n')
street_slot = open('./street-slot.csv', 'w+')

with file as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        out = []
        out.append(row[0].lower().replace(',', ''))
        out.append(row[0].lower().replace(',', ''))
        out.append(row[2].lower().replace(',', ''))
        if 'calle' in out[0]:
            out.append(row[3].lower().replace(',', ''))
        new_row = '"' + '","'.join(out) + '"\n'
        street_slot.write(new_row)
    street_slot.close()

from more_itertools import unique_everseen
with open('./street-slot.csv', 'r') as f, open('street_names_out.csv', 'w+') as out_file:
    out_file.writelines(unique_everseen(f))

print("Done my man!!!!")
