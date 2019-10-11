// column component
class MyColumn extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define('my-column', MyColumn)

window.addEventListener('load', ()=> {
    createColumn();
})

async function createColumn() {
    const response = await fetch('http://localhost:3000/columns');
    const json = await response.json();
    console.log(json);

    json.forEach((column) => {
        console.log(column.title);
        const newColumn = document.createElement('my-column');
        newColumn.classList.add('col');
        newColumn.id = `column ${column.id}`
        newColumn.innerHTML = `<h2>${column.title}</h2>`;
        document.querySelector('.row').appendChild(newColumn);
        
    })
}

// card component
class MyCard extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define('my-card', MyCard)

window.addEventListener('load', ()=> {
    getCardInfo();
})

async function getCardInfo() {
    const response = await fetch('http://localhost:3000/cards');
    const json = await response.json();
    console.log(json);

    json.forEach((card) => {
        console.log(card.title);
        const newCard = document.createElement('my-card');
        // const shadowRoot = newCard.attachShadow({mode: 'open'});
        newCard.id = `${card.id}`
        newCard.draggable = 'true'
        newCard.innerHTML = `
            ${card.title}<br/>
            Description: ${card.description}<br/>
            Column: ${card.columnId}<br/>
            <button type="button" // data-toggle="modal" data-target="#editModal">Edit</button>
            <input type="submit" value = "Delete" onclick="deleteCard(event)">
            <br/>`;
        if (card.columnId == 1) {
            document.getElementById('column 1').appendChild(newCard);
        } else {
            document.getElementById('column 2').appendChild(newCard);
        }
    })
}

// create card
function createCard(event) {

    let title = document.getElementById('title').value
    let description = document.getElementById('description').value
    let columnId = document.getElementById('columnId').value

    fetch('http://localhost:3000/cards', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method: 'POST',
        body: JSON.stringify({
          title: title,
          description: description,
          columnId: columnId
        }),
        
      })
      .then(response => response.json())
      .then(data => console.log(data))
}

//delete card
function deleteCard(event) {
    //console.log(event)
    const deleteId = event.target.parentNode.id
    console.log('in delete', deleteId)
    fetch('http://localhost:3000/cards/'+deleteId, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method: 'DELETE',
        body: JSON.stringify({
          id: deleteId,
        }),    
    })
        .then(response => response.json())
        .then(data => console.log(data))
}

//edit card
function editCard(event) {
    console.log(event)
    const editId = event.target.parentNode.id
    console.log('in edit', editId)
    fetch('http://localhost:3000/cards'+editId, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method: 'PUT',
        body: JSON.stringify({
          title: title,
          description: description,
          columnId: columnId
        }),
        
      })
      .then(response => response.json())
      .then(data => console.log(data))
}

//drag and drop cards

var allCards = document.getElementsByTagName("my-card");
//console.log(allCards);
Array.from(allCards).forEach(addDnDHandlers);
console.log('tagged')
console.log(allCards);

function addDnDHandlers(element) {   
    element.addEventListener('drag',drag(event));
    element.addEventListener('dragover',allowDrop(event));
    element.addEventListener('drop',drop(event));
}

function drag(event) {
    console.log('dragging');
    event.dataTransfer.setData("text", event.target.id);
    console.log(event);
   
}

function allowDrop(event) {
    event.preventDefault();
}
  
function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
}