
//getter and setter of the task array in the local storage
const getTasks = ()=>JSON.parse(localStorage.getItem('tasks')) || [];
const setTasks = (array)=>localStorage.setItem("tasks", JSON.stringify(array));
//push new task to local storage
const pushTask = (value) => {
    const array = getTasks()
    array.push(value)
    setTasks(array)
}
//event to dispatch when the tasks are updated
const myEvent = new CustomEvent('taskUpdated');

//update saved tasks from html list
const updateTasks = () => {
    const list = document.querySelectorAll(".list-tasks li.task-item");
    const array = []
    list.forEach((child) => {
        const taskTxt = child.querySelector("label").innerText;
        const taskStatus = child.querySelector("input[type='checkbox']").checked;
        array.push({
            text: taskTxt,
            checked: taskStatus
        });
    })
    setTasks(array);
    document.dispatchEvent(myEvent)
}
let idSeq = 0;
const getIdSeq = ()=> ++idSeq;

//delete single task
const deleteTask = (e) => {
    const parent = e.target.parentElement;
    parent.parentElement.removeChild(parent);
    updateTasks()
}



const checked_changed = ((e) => {
    const lbl = e.target.parentElement.querySelector("label");
    lbl.classList.toggle("barred-text");
    document.dispatchEvent(myEvent)
    updateTasks()
})

function addTask() {
    const task = document.querySelector("#task-txt");

    task.checkValidity()
    //check if the task text is valid
    if(task.validity.valid) {
        const value = {
            text:task.value,
            checked: false
        }

        //save task to local storage
        pushTask(value)

        const li = createTask(value, getIdSeq())
        const list = document.querySelector(".list-tasks")
        list.appendChild(li);

        //
        task.value = '';
        document.dispatchEvent(myEvent)

    }
}

const createTask = (task, id) => {

   /* //create list item
    const li = document.createElement("li");
    li.classList.add("task-item");

    //create input element
    const elem = document.createElement("input");
    elem.type = "checkbox";
    elem.addEventListener('change', checked_changed)
    elem.checked = task.checked;
    elem.classList.add("task", "task-box")
    elem.id = "task"+id;
    //append input to list item
    li.appendChild(elem);

    //create label
    const lbl = document.createElement("label")
    lbl.classList.add("task", "task-lbl")
    if(task.checked)
        lbl.classList.add("barred-text")
    lbl.setAttribute("for", "task"+id);
    lbl.innerText = task.text;
    //append label to list item
    li.appendChild(lbl);


    const btn = document.createElement("button");
    btn.classList.add("task", "task-del");
    btn.innerText = "X";
    btn.addEventListener("click", deleteTask);
    //append button to list item
    li.appendChild(btn);*/
    
    const li1 = document.querySelector('#task-item-sample').cloneNode(true);

    li1.id = "task-item"+id;
    li1.querySelector('input').id = "task"+id;
    li1.querySelector('input').checked = task.checked;
    li1.querySelector('label').innerText = task.text;
    li1.querySelector('label').setAttribute("for", "task"+id);
    li1.querySelector('button').setAttribute("aria-describedby", "task"+id);
    if(task.checked)
        li1.querySelector('label').classList.add("barred-text")
    return li1;
}



//load tasks stored in the local storage
getTasks().forEach(task => {
    const li = createTask(task, getIdSeq())
    const list = document.querySelector(".list-tasks")
    list.appendChild(li);
}, (rst) => {
    document.dispatchEvent(myEvent)
})


const updateStatis = () => {
    const totalBtn = document.querySelector(".toolbar #total");
    totalBtn.querySelector("span")
        .innerText = getTasks().length;

    const doneBtn = document.querySelector(".toolbar #done");
    doneBtn.querySelector("span")
        .innerText = getTasks().filter(value => value.checked).length;

    const restBtn = document.querySelector(".toolbar #rest");
    restBtn.querySelector("span")
        .innerText = getTasks().filter(value => !value.checked).length;
}


//add new task on add button click
const addBtn = document.querySelector("#add-btn");
addBtn.addEventListener("click", addTask);






document.addEventListener("taskUpdated", updateStatis)


updateStatis();

document.querySelector(".toolbar #selectAll")
    .addEventListener("click", () => {
        const boxs = document
            .querySelectorAll(".list-tasks input[type='checkbox']:not(:checked)");
        boxs.forEach(value => value.click())
    });

document.querySelector(".toolbar #deselectAll")
    .addEventListener("click", () => {
        const boxs = document
            .querySelectorAll(".list-tasks input[type='checkbox']:checked");
        boxs.forEach(value => value.click())
    });

document.querySelector(".toolbar #deleteAll")
    .addEventListener("click", () => {
        const btns = document
            .querySelectorAll(".list-tasks .task-del");
        btns.forEach(value => value.click())
    });

const sortable = new Sortable(document.querySelector(".list-tasks"));

