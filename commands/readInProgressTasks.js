import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readTasks from "./readTasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../tasks.json');

export default async function readInProgressTasks() {
    const tasks = await readTasks();
        
        console.log("Tasks In Progresss: ");
            
        tasks.filter(task => task.status === "in progress").forEach(task => console.log(`${task.title}`));
}