import { writeFile, readdirSync } from 'fs';
import XLSX from 'xlsx';
import { exec } from 'child_process';

// Función para ejecutar un comando git
const runGitCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
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


async function  transformData(data) {
    const urlImgGit = 'https://raw.githubusercontent.com/yonnijes/InmoVisor/main/data/img/'
    try {
        return data.map((item) => {
            return {
                ...item,
                coordinate: {
                    id: item.id,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng)
                },
                amenities: item.amenities.split(',').map((amenity) => amenity.trim()),
                image:  searchImage(`data/img/${item.id}`).map((image) => `${urlImgGit}/${item.id}/${image.name}`)
                
            }
        });
    } catch (error) {
        
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
    try {
        await runGitCommand('git add data');
        await runGitCommand('git commit -m "Actualizar data_property.json"');
        await runGitCommand('git push origin main');
        console.log('Git add, commit y push completados exitosamente.');
    } catch (error) {
        console.error('Error al ejecutar los comandos de Git:', error);
    }
};

(async () => {
    // Ruta del archivo excel
    const excelFilePath = 'data/data_keytock.xlsx';
    const jsonResult = excelToJson(excelFilePath);
    const data = await transformData(jsonResult);
    createFile('data/data_property.json', data);
    gitAddCommitPush();
})();
