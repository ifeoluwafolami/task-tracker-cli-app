#!/usr/bin/env node

import addTask from "./commands/addTask.js";
import deleteTask from "./commands/deleteTask.js";
import readTasks from "./commands/readTasks.js";
import updateTask from "./commands/updateTask.js";

import { Command } from "commander";

const program = new Command();

program
.name('task-tracker')
.description('A task manager, right in your terminal!')
.version('1.0.0');

program
.command('add')
.description('Create a new task.')
.action(() => addTask());

program
.command('delete')
.description('Deletes a task.')
.action(() => deleteTask());

program
.command('list')
.description('List all tasks.')
.action(async () => {
    let tasks = await readTasks();
    console.log(tasks.length ? tasks : "No tasks found.")
});

program
.command('update')
.description('Updates a task.')
.action(() => updateTask());

program.parse();