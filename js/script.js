let ID = localStorage.ID ? localStorage.getItem('ID') : 1;
let form = document.getElementById('todoForm');
const STORE_ID = 'todoItems';
const TODO_CONTAINER =  document.getElementById('todoItems');

function mainParent(el){
    if (el.getAttribute('data-id')){
        return el
    }
    return mainParent(el.parentElement);
}

function findElement(todoItems, id){
    return todoItems.find(function (item){
        if (item.id === id) return item;
    })
}

const clear = document.querySelector('button[type=button]')
// console.log(clear);

clear.addEventListener('click', function (e){
    localStorage.removeItem(STORE_ID);
    TODO_CONTAINER.innerHTML = '';
})




TODO_CONTAINER.addEventListener('click', function (e) {
    if (!e.target.classList.contains("delete-btn")) return;

    const todoItems = JSON.parse(localStorage[STORE_ID]);
    const todoIt = mainParent(e.target);
    const todoItemId = +todoIt.getAttribute('data-id');

    let uppItems = todoItems.filter(function (singleTodoItem){
       if (singleTodoItem.id === todoItemId) return singleTodoItem;
    });

    localStorage.setItem(STORE_ID ,JSON.stringify(uppItems));

    todoIt.parentElement.remove();

})


TODO_CONTAINER.addEventListener('change', function (e) {
    const todoIt = mainParent(e.target);
    const todoItemId = +todoIt.getAttribute('data-id');

    const status = e.target.checked;
    const todoItems = JSON.parse(localStorage[STORE_ID]);

    let current = findElement(todoItems, todoItemId);

    current.status = status;
    localStorage.setItem(STORE_ID ,JSON.stringify(todoItems));

    // console.log(e.target);
    // console.log(current);
})





document.addEventListener('DOMContentLoaded', function () {
    if(!localStorage[STORE_ID]) return;

    const data = JSON.parse(localStorage[STORE_ID]);

    data.forEach(function (item) {
        // document.getElementById('todoItems')
        const template = createTemplate(item.heading, item.content, item.id, item.status);
        TODO_CONTAINER.prepend(template);
    })

});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const heading = e.target.querySelector('input[name=title]');
    const content = e.target.querySelector('textarea[name=description]');

    if(!heading.value || !content.value) {
        alert('Заполните все поля !!!!');
        return;
    }

    const template = createTemplate(heading.value, content.value, ID);
    useStorage(heading.value, content.value)

    // document.getElementById('todoItems')
    TODO_CONTAINER.prepend(template);

    e.target.reset();
});



function useStorage(heading, content, status = false) {
    // localStorageArray  = 'todoItems'

    const todoItem = {
        id: ID,
        heading,
        content,
        status
    }
    ++ID
    localStorage.setItem('ID', ID);

    if(localStorage[STORE_ID]) {
        const storeData = JSON.parse(localStorage.getItem(STORE_ID));
        storeData.push(todoItem);

        localStorage.setItem(STORE_ID, JSON.stringify(storeData));
        return;
    }

    const arr = JSON.stringify([todoItem]);
    localStorage.setItem(STORE_ID, arr);
    return todoItem;
}

function createTemplate(title, taskBody, id, status = false) {
    const mainWrp = document.createElement('div');
    mainWrp.className = 'col-4';

    const taskWrp = document.createElement('div');
    taskWrp.className = 'taskWrapper';
    taskWrp.setAttribute('data-id', id);

    const heading = document.createElement('div');
    heading.className = 'taskHeading';
    heading.innerText = title;

    const taskDesc = document.createElement('div');
    taskDesc.className = 'taskDescription';
    taskDesc.innerText = taskBody;

    const label = document.createElement('label');
    label.innerText = 'Completed ?';


    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'completed';

    checkbox.setAttribute('data-id', id);

    if (status){
        checkbox.checked = true;
        checkbox.setAttribute('checked', 'checked');
    }

    label.prepend(checkbox);

    const btn = document.createElement('button');
    btn.className = 'btn btn-danger delete-btn';
    btn.innerText = 'Deleted';




    mainWrp.append(taskWrp);
    taskWrp.append(heading);
    taskWrp.append(taskDesc);
    taskWrp.append(label);
    taskWrp.append(btn);




    return mainWrp;
}

