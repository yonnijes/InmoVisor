import { readFile, writeFile } from 'fs';

// Ruta del archivo JSON
const filePath = 'data/data_property.json';

function getArchivoJSON() {
    return new Promise((resolve, reject) => {
        // Lee el contenido del archivo
        readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo:', err);
                reject(err);
                return;
            }

            try {
                // Parsea el contenido del archivo como JSON y resuelve la promesa con los datos
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (error) {
                console.error('Error al parsear el archivo JSON:', error);
                reject(error);
            }
        });
    });
}

function generateMockData(numDataMok, teplateDataMok) {
    const dataMok = [];
    for (let i = 0; i < numDataMok; i++) {
        const { id, coordinate, price } = teplateDataMok;

        const lat = coordinate.lat + (Math.random() - 0.5) * 0.1;
        const lng = coordinate.lng + (Math.random() - 0.5) * 0.1;
        const data = { 
            ...teplateDataMok, 
            price: price + (Math.random() - 0.5) * 1000,
            id: ((id * 1) + i).toString(), 
            coordinate: { lat: lat, lng: lng } 
        };
        dataMok.push(data);
    }
    return dataMok;
}

function createFile(nameFile, data) {
    writeFile(nameFile, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Archivo creado');
    });
}



(async () => {
    const jsonData = await getArchivoJSON();
    const dataMok = generateMockData(200, jsonData[jsonData.length-1]);
    createFile('data/data_property.json', [...jsonData, ...dataMok]);

})();
