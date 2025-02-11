import readTasks from "./readTasks.js";
import inquirer from "inquirer";
import updateTask from "./updateTask.js";
import {promises as fs} from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../tasks.json');

// Check if task exists
async function doesTaskExist(entry) {
    try {
        const tasks = await readTasks();

        if (!tasks || tasks.length === 0) {
            return;
        }

        if (tasks.some(task => task.title.toLowerCase() === entry.toLowerCase())) {
            return true;
        };

        return false;

    } catch (error) {
        console.error('Failed to load tasks: ', error);
    }
}

// Add task function
export default async function addTask() {
    const newEntry = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Title of the task: "
        },

        {
            type: "input",
            name: "description",
            message: "Short description of the task: "
        },

        {
            type: "input",
            name: "status",
            message: "Task status: "
        }
    ]);

    // If there is an existing task with the same title, ask them to update or create new task
    if (await doesTaskExist(newEntry.title)) {
        const answer = await inquirer.prompt([
            {
                type: "confirm",
                name: "updateConfirm",
                message: "Task with same name exists. Update instead?"
            }
        ]);
    
        if (answer.updateConfirm) {
            return updateTask(newEntry.title);
        } else {
            const newTaskConfirm = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "confirm",
                    message: "Would you like to create a new task?"
                }
            ]);
    
            if (!newTaskConfirm.confirm){
                console.log('Bye bye bye!');
                return;
            }
        }
    } 
    // If no tasks with similar titles exist, add task to JSON file
    const tasks = await readTasks();

    const taskId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

    const newTask = {
        id: taskId,
        title: newEntry.title.replace(/\b\w/g, char => char.toUpperCase()),
        description: newEntry.description,
        status: newEntry.status
    };

    tasks.push(newTask);
    
    try {
        await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");
        console.log("Task added successfully!")
    } catch (error) {
        console.error("Failed to add task: ", error);
    }
}
    
    
    // return true;
    // {
    //     const newTask = await inquirer.prompt([
    //         {
    //             type: "confirm",
    //             name: "confirm",
    //             message: "Would you like to create a new task?"
    //         }
    //     ]);

    //     if (newTask.confirm){
    //         addTask();
    //     } else {
            
    //     }
    // }

