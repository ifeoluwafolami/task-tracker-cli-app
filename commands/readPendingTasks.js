import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readTasks from "./readTasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../tasks.json');

export default async function readPendingTasks() {
    const tasks = await readTasks();
    
    console.log("Pending Tasks: ");
        
    tasks.filter(task => task.status === "pending").forEach(task => console.log(`${task.title}`));
}