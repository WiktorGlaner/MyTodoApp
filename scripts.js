"use strict"; // this is a string mode that helps to write more secure code

import {API_KEY, BIN_ID} from './config.js';

let todoList = []; //declares a new array for Your todo list


let initList = function() {
    let savedList = window.localStorage.getItem("todos");
    if (savedList != null)
        todoList = JSON.parse(savedList);
    else
    //code creating a default list with 2 items
    todoList.push(
    {
        title: "Learn JS",
        description: "Create a demo application for my TODO's",
        place: "445",
        category: '',
        dueDate: new Date(2024,10,16)
    },
    {
        title: "Lecture test",
        description: "Quick test from the first three lectures",
        place: "F6",
        category: '',
        dueDate: new Date(2024,10,17)
    }

    );
}

//initList();

let req = new XMLHttpRequest();

req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
    }
};

req.open("GET", `https://api.jsonbin.io/v3/b/${BIN_ID}/<BIN_VERSION | latest>`, true);
req.setRequestHeader("X-Master-Key", API_KEY);
req.send();

let updateTodoList = function() {
    let todoListDiv =
    document.getElementById("todoListView");

    //remove all elements
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    //add all elements
    let filterInput = document.getElementById("inputSearch");   
    for (let todo in todoList) {
    if (
        (filterInput.value == "") ||
        (todoList[todo].title.includes(filterInput.value)) ||
        (todoList[todo].description.includes(filterInput.value))
    )   {
        let newElement = document.createElement("p");
        let newContent = document.createTextNode(todoList[todo].title + " " +
                                                todoList[todo].description);

        //add delete button
        let newDeleteButton = document.createElement("input");
        newDeleteButton.type = "button";
        newDeleteButton.value = "x";
        newDeleteButton.addEventListener("click",
            function() {
                deleteTodo(todo);
            });
        newElement.appendChild(newContent);
        newElement.appendChild(newDeleteButton);
        todoListDiv.appendChild(newElement);
        }
    }
    /*
    //add all elements
    for (let todo in todoList) {
        let newElement = document.createElement("div");
        let newContent = document.createTextNode(
            todoList[todo].title + " " + todoList[todo].description);

        //add delete button
        let newDeleteButton = document.createElement("input");
        newDeleteButton.type = "button";
        newDeleteButton.value = "x";
        newDeleteButton.addEventListener("click",
            function() {
                deleteTodo(todo);
            });
        newElement.appendChild(newContent);
        newElement.appendChild(newDeleteButton);
        todo ListDiv.appendChild(newElement);
    } */

}

setInterval(updateTodoList, 1000); //update the list every second

let deleteTodo = function(index) {
    todoList.splice(index,1);
}

let addTodo = function() {
    //get the elements in the form
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");
    //get the values from the form
    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);
    //create new item
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        category: '',
        dueDate: newDate
    };
    //add item to the list
    todoList.push(newTodo);
    //saving the list to the clients local storage
    window.localStorage.setItem("todos", JSON.stringify(todoList));
  }