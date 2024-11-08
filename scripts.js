"use strict"; // this is a string mode that helps to write more secure code

import {API_KEY, BIN_ID, BIN_VERSION, API_KEY_GROQ} from "./config.js";

let todoList = []; //declares a new array for Your todo list


let generateCategory = async function (title, description) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY_GROQ}` 
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{ role: "user", content: "jaką z dostępnych kategorii(uczelnia, zakupy, prywatne, inne) przypisałbyś do zadania'" +title+ "," +description+ "'? Użyj tylko jednego słowa z tej listy." }],
            })
        });

        if (!response.ok) {
            throw new Error('Błąd sieci lub API');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        return 'Wystąpił błąd: ';
    }
}
console.log(generateCategory("nauka", "matematyki"));

let updateTodoList = function() {

    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            let response = JSON.parse(req.responseText);
            todoList = response.record;
        }
    };

    req.open("GET", `https://api.jsonbin.io/v3/b/${BIN_ID}/${BIN_VERSION}`, true);
    req.setRequestHeader("X-Master-Key", API_KEY);
    req.send();
    //console.log(BIN_ID);
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
        let newContent = document.createTextNode("tytuł:" + todoList[todo].title + "  opis:" +
                                                todoList[todo].description + "  kategoria:" + 
                                                todoList[todo].category);

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
}

setInterval(updateTodoList, 1000); //update the list every second

let deleteTodo = function(index) {
    todoList.splice(index,1);
    //update the list
    updateJSONbin();
}

let addTodo = async function() {
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
        category: await generateCategory(newTitle, newDescription),
        dueDate: newDate
    };
    //add item to the list
    todoList.push(newTodo);
    //saving the list to the clients local storage
    //window.localStorage.setItem("todos", JSON.stringify(todoList));
    //update the list
    updateJSONbin();
}
const addButton = document.getElementById("addButton");
addButton.addEventListener("click", addTodo);

let updateJSONbin = function() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);
    }
    };

    req.open("PUT", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", API_KEY);
    //req.send('{"sample": "Hello World"}');

    let data = JSON.stringify(todoList);
    req.send(data);
}

let saveList = function() {
    window.localStorage.setItem("todos", JSON.stringify(todoList));
    updateJSONbin();
};

//saveList();