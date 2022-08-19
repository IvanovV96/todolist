/**
 * id - String
 * title - String
 * description - String 
 * priority - String 
 * done - boolean
 * isArchieved - boolean
 * deadline - string
 */

// TODO
import { getTasks, addNewTask, removeTask } from "./tasksService"
import { debounce } from 'lodash'
import { TaskPriorityTypes, TaskActionTypes } from "./constants";
import UiElements from "./elements"
import Toastify from "toastify-js"

const {
    tasksContainer,
    addTaskFormEl,
    inputTitleEl,
    textareaDescriptionEl,
    selectPriorityEl,
    searchInputEl
} = UiElements

const tasks = getTasks()

function createTaskTemplate(task, index) {
    
    const priorityClass = task.priority === TaskPriorityTypes.Low 
        ? 'text-bg-info' : task.priority === TaskPriorityTypes.Medium 
        ? 'text-bg-warning' : 'text-bg-danger'
    let borderClass
    let textBgClass

    if(task.isDone) {
        borderClass = 'border-success'
        textBgClass = 'text-bg-success'
    }

    const date = new Date(task.expieredAt)
    const dateText = task.isDone ? 'Done' : `Should be done: ${date.toLocaleString('en-EU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })}`
    
    const template = `
        <div class="card mb-3 ${borderClass}" data-task-id = "${task.id}">
            <div class="card-header d-flex justify-content-between ${textBgClass}">
                <span>Task #${index + 1}</span>
                <span>${dateText}</span>
            </div>
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <div>
                    <span class="badge ${priorityClass}">${task.priority}</span>
                </div>
            </div>
            <div class="card-footer bg-transparent d-flex justify-content-end ${borderClass}">
            ${task.isDone ? '<button class="btn btn-outline-primary me-2" data-action = "reopen">Reopen</button>'
                         : '<button class="btn btn-success me-2" data-action = "done">Mark as done</button>' }
            ${task.isArchieved ? '' : '<button class="btn btn-danger" data-action = "remove">Remove</button>'}
            </div>
        </div>
    `
    return template
}

function removeTaskHandler(e) {
    const { target } = e
    const taskEl = target.closest('[data-task-id]')
    const id = Number(taskEl.dataset.taskId)
    taskEl.remove()
    
    removeTask(id)

    Toastify({
        text: 'Task has been removed success',
        duration: 5000,
        close: true
    }).showToast()
}


function renderAllTasks(tasksArr) {
   const fullTemplate = tasksArr.reduce((acc, task, index) =>  `${acc} ${createTaskTemplate(task, index)}`, '')
    tasksContainer.insertAdjacentHTML('beforeend', fullTemplate)
}

renderAllTasks(tasks)

tasksContainer.addEventListener('click', (e) => {
    const action = e.target.dataset.action
    if(!action) return 
    switch(action) {
        case TaskActionTypes.Remove:
            removeTaskHandler(e)
            break
        case TaskActionTypes.Done:
            console.log('func done')
            break
        case TaskActionTypes.Reopen:
            console.log('func reopen')
            break
    }
    console.log(e.target)
})


addTaskFormEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const newTask = addNewTask({
        title: inputTitleEl.value,
        description: textareaDescriptionEl.value,
        priority: selectPriorityEl.value
    })
    const taskTemplate = createTaskTemplate(newTask, tasks.length - 1)
    tasksContainer.insertAdjacentHTML('beforeend', taskTemplate)
    Toastify({
        text: 'Task has been added success',
        duration: 5000,
        close: true
    }).showToast()
    addTaskFormEl.reset()
})


function clearTasksMarkup() {
    tasksContainer.innerHTML = ''
}

function searchTask(value, type = '') {
  console.log(type, 'search task:', value)
  const filteredTasks = tasks.filter(({ title, description }) => 
    title.toLowerCase().includes(value.toLowerCase()) 
    || description.toLowerCase().includes(value.toLowerCase()))
    clearTasksMarkup()
    renderAllTasks(filteredTasks)
}

const searchTaskDebounced = _.debounce((e) => {
    searchTask(searchInputEl.value)
}, 200)

searchInputEl.addEventListener('input', searchTaskDebounced)




