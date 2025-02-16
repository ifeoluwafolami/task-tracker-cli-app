import inquirer from "inquirer";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readTasks from "./readTasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../tasks.json');


export default async function deleteTask(taskTitle=null) {
    try {
        const tasks = await readTasks();

        if (!tasks || tasks.length === 0) {
            console.log("No tasks available to delete.");
            return;
        }

        let taskToDelete;
        // If optional parameter is included
        if (taskTitle) {
            taskToDelete = tasks.find(task => task.title.toLowerCase() === taskTitle.toLowerCase());
            if (!taskToDelete) {
                console.log(`No tasks found with title ${taskTitle}.`);
                return;
            }
            console.log('Task found');
        } else {
            const { selectedTitle } = await inquirer.prompt([
                {
                    type: "list",
                    name: "selectedTitle",
                    message: "Select a task to delete",
                    choices: tasks.map(task => task.title),
                }
            ]);

            taskToDelete = tasks.find(task => task.title === selectedTitle);
        }

        tasks.splice((taskToDelete.id - 1), 1);   
        
        // Reorder IDs
        tasks.forEach((task, index) => {
            task.id = index + 1;
        });


        try {
            await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");
            console.log("Task deleted successfully!");
        } catch (error) {
            console.error("Failed to delete task, error: ", error);
        }

    } catch (error) {
        console.error(error);
    }
}
