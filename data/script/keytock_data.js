import { writeFile, readdirSync } from 'fs';
import XLSX from 'xlsx';
import { exec } from 'child_process';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Función para ejecutar un comando git
const runCommand = (command, cwd) => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd },(error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ stdout, stderr });
        });
    });
};

// Función para leer el archivo XLSX y convertirlo en JSON
function excelToJson(filePath) {
    // Cargar el libro de trabajo (workbook)
    const workbook = XLSX.readFile(filePath);

    // Obtener la primera hoja de cálculo
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Convertir la hoja de cálculo a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    // Extraer las claves de la primera fila
    const keys = jsonData.shift()

    // Construir el objeto JSON utilizando las claves y los valores
    const jsonObj = jsonData.map((row) => {
        const obj = {};
        keys.forEach((key, index) => {
            obj[key] = row[index];
        });
        return obj;
    });

    // Devolver el JSON resultante
    return jsonObj.filter((item) => item.id !== undefined);
}


async function transformData(data) {


    const urlImgGit = 'https://raw.githubusercontent.com/yonnijes/InmoVisor/main/data/img/'
    try {
        return data?.map((item) => {

            const { images, ...resto } = item;

            return {
                ...resto,
                coordinate: {
                    id: item.id,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng)
                },
                amenities: item?.amenities?.split(',').map((amenity) => amenity.trim()),
                image: searchImage(`data/img/${item.id}`).map((image) => `${urlImgGit}/${item.id}/${image.name}`),
                storageRoom: item?.storageRoom.toUpperCase() === 'SI' ? true : false,

            }
        });
    } catch (error) {
        console.log('Error al transformar los datos')
        console.log(error);

    }
}

function searchImage(directory) {
    const files = readdirSync(directory);
    return files.map((file) => {
        return {
            name: file,
            path: `${directory}/${file}`
        }
    });
}

function createFile(nameFile, data) {
    writeFile(nameFile, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Archivo creado');
    });
}

const gitAddCommitPush = async () => {

    const hasChanges = await checkForChanges();
    if (!hasChanges)
        return console.log('No hay cambios para subir a Git.');

    try {

        const projectDir = '/Users/yonnieraleman/MyCode/typescript/InmoVisor';

       // await runCommand(`ssh-add --apple-use-keychain -q ~/.ssh/id_ed25519`);
        await runCommand(`git add data`, projectDir);
        await runCommand(`git commit -m "Actualizar data_property.json"`, projectDir);
        await runCommand(`git push origin main`, projectDir);
        console.log(`Git add, commit y push completados exitosamente.`);
    } catch (error) {
        console.error('Error al ejecutar los comandos de Git:', error);
    }


    async function checkForChanges() {
        const projectDir = '/Users/yonnieraleman/MyCode/typescript/InmoVisor';

        const { stdout } = await runCommand('git status --porcelain ./data', projectDir);
        return stdout.trim() !== '';
    }
};


async function donwloadXlsx(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const data = new Uint8Array(response.data);
    const workbook = XLSX.read(data, { type: 'array' });
    // Obtener la primera hoja de cálculo
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Convertir la hoja de cálculo a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    // Extraer las claves de la primera fila
    const keys = jsonData.shift()

    // Construir el objeto JSON utilizando las claves y los valores
    const jsonObj = jsonData.map((row) => {
        const obj = {};
        keys.forEach((key, index) => {
            obj[key] = row[index];
        });
        return obj;
    });

    // Devolver el JSON resultante
    return jsonObj.filter((item) => item.id !== undefined);

}


async function descargarImagenes(idArray, idCarpetaDestino) {

    async function descargarImg(id, idCarpetaDestino) {
        const url = `https://drive.google.com/uc?id=${id}`;
        const carpetaDestino = `/Users/yonnieraleman/MyCode/typescript/InmoVisor/data/img/${idCarpetaDestino}`;
        try {
            const response = await axios({
                method: 'get',
                url: url,
                responseType: 'stream'
            });

            if (!fs.existsSync(carpetaDestino)) {
                fs.mkdirSync(carpetaDestino, { recursive: true });
            }

            const rutaArchivo = path.join(carpetaDestino, `${id}.jpg`);
            response.data.pipe(fs.createWriteStream(rutaArchivo));
            console.log('Imagen descargada:', rutaArchivo);
        } catch (error) {
            console.log('Error al descargar la imagen:', id, carpetaDestino);
        }
    }
    await Promise.all(idArray.map(id => descargarImg(id, idCarpetaDestino)));

}

function obtenerID(url) {
    // Expresión regular para encontrar el ID del archivo en la URL de Google Drive
    const regex = /\/file\/d\/([a-zA-Z0-9_-]+)\//;
    const match = url.match(regex);

    // El ID del archivo estará en la segunda posición del array de coincidencias
    if (match && match.length >= 2) {
        return match[1];
    } else {
        // Si no se encuentra un ID válido, devuelve null o lanza un error según lo desees
        return null;
    }
}



(async () => {
    const jsonResult = await donwloadXlsx('https://docs.google.com/spreadsheets/d/1Xbg9AZeIFAa1nweJKAXNY3Bu9bNC4KUm/export?format=xlsx');



    const infoImagenes = jsonResult.map((item) => {
        return {
            id: item.images?.split(',')
            .map((image) => obtenerID(image))
            .filter((id) => id !== null),
            idCapetaDestino: item.id,
        }
    })


    await Promise.all(infoImagenes.map(async (item) => {
        await descargarImagenes(item.id, item.idCapetaDestino);
    }));


    const data = await transformData(jsonResult);
    console.log(`SE HAN DESCARGADO ${data?.length} PROPIEDADES`)

    createFile('data/data_property.json', data);
    await gitAddCommitPush();

})();
