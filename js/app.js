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
const tasks = [
    {
        id: 1,
        title: "JavaScript",
        description: "JavaScript is Awesome",
        priority: "low",
        isDone: false,
        isArchieved: false,
        expieredAt: 1659545990506,

    },
    {
        id: 2,
        title: "Python",
        description: "Python is good",
        priority: "medium",
        isDone: true,
        isArchieved: false,
        expieredAt: 1659474000000,
    },
    {
        id: 3,
        title: "GO",
        description: "Go is nice",
        priority: "medium",
        isDone: false,
        isArchieved: false,
        expieredAt: 1659474000000,
    },
    {
        id: 4,
        title: "Primary card title",
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        priority: "high",
        isDone: true,
        isArchieved: false,
        expieredAt: 1659474000000,
    }
]

const tasksContainer = document.querySelector('.tasks-list')

const removeBtns = document.querySelectorAll('[data-action="remove"]')

function createTaskTemplate(task, index) {
    const priorityClass = task.priority === 'low' ? 'text-bg-info' : task.priority === 'medium' ? 'text-bg-warning' : 'text-bg-danger'
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
    const index = tasks.findIndex((task) => task.id === id)
    tasks.splice(index, 1)
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
        case 'remove':
            removeTaskHandler(e)
            break
        case 'done':
            console.log('func done')
            break
        case 'reopen':
            console.log('func reopen')
            break
    }
    console.log(e.target)
})

const addTaskFormEl = document.forms['add-task']

const inputTitleEl = addTaskFormEl.elements['task-title']
const textareaDescriptionEl = addTaskFormEl.elements['task-description']
const selectPriorityEl = addTaskFormEl.elements['task-priority']


addTaskFormEl.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(selectPriorityEl)
    const newTask = {
        id: tasks.length + 1,
        title: inputTitleEl.value,
        description: textareaDescriptionEl.value,
        priority: selectPriorityEl.value,
        isDone: false,
        expiredAt: Date.now() + (1000 * 60 * 60 * 24)
    }
    tasks.push(newTask)
    
    const taskTemplate = createTaskTemplate(newTask, tasks.length - 1)
    tasksContainer.insertAdjacentHTML('beforeend', taskTemplate)

    addTaskFormEl.reset()
})

const searchFormEl = document.forms['search-form']
const searchInputEl = searchFormEl.elements['task-search']

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




