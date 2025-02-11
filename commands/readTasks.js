import fs, { read } from "fs";
import path, { parse } from "path";
import { fileURLToPath, pathToFileURL } from "url";


// File Path of JSON File
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../tasks.json');

// Read All Files
export default function readTasks() {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                console.error("Error reading file: ", err);
                reject(err);
                return;
            }

            try {
                const tasks = JSON.parse(data);
                resolve(tasks);
            } catch (parseError) {
                console.error("Error parsing JSON data: ", parseError);
                reject(parseError);
            }

        })
    })
}

// Run this only if the file is executed directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    readTasks().then(tasks => console.log("Tasks loaded: ", tasks));
}