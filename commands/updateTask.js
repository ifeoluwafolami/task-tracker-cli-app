import inquirer from "inquirer";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readTasks from "./readTasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../tasks.json');


export default async function updateTask(taskTitle=null) {
    try {
        const tasks = await readTasks();

        if (!tasks || tasks.length === 0) {
            console.log("No tasks available to update.");
            return;
        }

        let taskToUpdate;
        // If optional parameter is included
        if (taskTitle) {
            taskToUpdate = tasks.find(task => task.title.toLowerCase() === taskTitle.toLowerCase());
            if (!taskToUpdate) {
                console.log(`No tasks found with title ${taskTitle}.`);
                return;
            }
            console.log('Task found');
        } else {
            const { selectedTitle } = await inquirer.prompt([
                {
                    type: "list",
                    name: "selectedTitle",
                    message: "Select a task to update",
                    choices: tasks.map(task => task.title),
                }
            ]);

            taskToUpdate = tasks.find(task => task.title === selectedTitle);
        }

        const update = await inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Input updated title. Leave blank if you do not want to update this field"
            },
            {
                type: "input",
                name: "description",
                message: "Input updated description. Leave blank if you do not want to update this field"
            },
            {
                type: "input",
                name: "status",
                message: "Input updated status. Leave blank if you do not want to update this field"
            }
        ]);

        const updatedTask = {
            id: taskToUpdate.id,
            title: update.title ? update.title.replace(/\b\w/g, char => char.toUpperCase()) : taskToUpdate.title,
            description: update.description ? update.description : taskToUpdate.description,
            status: update.status ? update.status : taskToUpdate.status
        };

        tasks[taskToUpdate.id - 1] = updatedTask;

        try {
            await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");
            console.log("Task updated successfully!");
        } catch (error) {
            console.error("Failed to update task, error: ", error);
        }

    } catch (error) {
        console.error(error);
    }
}

