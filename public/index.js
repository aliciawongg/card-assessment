const cardsAll = document.getElementsByTagName('my-card')

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
    //console.log(json);

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
    //console.log(json);

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
            <button type="button" data-toggle="modal" data-target="#editModal" id=${card.id} onclick="retrieveCardDetails()">Edit</button>
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
        .then(data => {
            console.log(data)
            const cardDelete = document.getElementById(deleteId);
            cardDelete.remove()
        })
}

//edit card
function retrieveCardDetails() {
    const retrieveId = event.target.id
    console.log('editing',retrieveId)
    fetch('http://localhost:3000/cards/'+retrieveId)
        .then(response => response.json())
        .then((data) => {
            const cardDetail = document.querySelector('.modal-body');
            cardDetail.id = `${data.id}`;
            cardDetail.innerHTML = `
            Title: <input type="text" id="editTitle" value=${JSON.stringify(data.title)}><br/>
            Description: <input type="text" id="editDescription" value=${JSON.stringify(data.description)}><br/>
            Column: <input type="text" id="editColumnId" value=${JSON.stringify(data.columnId)}><br/>
            <button type="button" data-dismiss="modal" aria-label="Close" onclick="editCard(event)">Save changes</button>`
            console.log(cardDetail)
        })
}

function editCard(event) {
    const editId = event.target.parentNode.id
    console.log('in edit', editId)
    let title = document.getElementById('editTitle').value
    let description = document.getElementById('editDescription').value
    let columnId = document.getElementById('editColumnId').value
    fetch('http://localhost:3000/cards/'+editId, {
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
        .then(data => {
            console.log(data)
            const updateDetail = document.getElementById(editId);
            console.log(updateDetail)
            updateDetail.remove()
            updateDetail.innerHTML = `
                ${data.title}<br/>
                Description: ${data.description}<br/>
                Column: ${data.columnId}<br/>
                <button type="button" data-toggle="modal" data-target="#editModal" id=${data.editId} onclick="retrieveCardDetails()">Edit</button>
                <input type="submit" value = "Delete" onclick="deleteCard(event)"><br/>`;
            if (data.columnId == 1) {
                document.getElementById('column 1').appendChild(updateDetail);
            } else {
                document.getElementById('column 2').appendChild(updateDetail);
            }
        })
}

//search
function handleSearch(searchText) {
    do {
        for (let j=0; j<cardsAll.length; j++){
            cardsAll[j].remove()
        }
    }
    while (cardsAll.length > 0);
    
    const msg = document.getElementById('nilMsg')
    if (msg) {
        msg.remove()
    }
    //check through json for keyword
    const input = document.getElementById('searchText').value.toLowerCase()
    console.log('input word: ', input)
    fetch('http://localhost:3000/cards/')
        .then(response => response.json())
        .then((data) => {
            let noResultCount = 0
            console.log('start: ', noResultCount)
            for ( let i=0; i<data.length; i++) {
                if( data[i].title.toLowerCase().includes(input) || 
                data[i].description.toLowerCase().includes(input) ||
                JSON.stringify(data[i].columnId).includes(input) ) {
                    const searchResultCard = document.createElement('my-card');
                    searchResultCard.id = `${data[i].id}`
                    searchResultCard.draggable = 'true'
                    searchResultCard.innerHTML = `
                        ${data[i].title}<br/>
                        Description: ${data[i].description}<br/>
                        Column: ${data[i].columnId}<br/>
                        <button type="button" data-toggle="modal" data-target="#editModal" id=${data[i].id} onclick="retrieveCardDetails()">Edit</button>
                        <input type="submit" value = "Delete" onclick="deleteCard(event)">
                        <br/>`;
                    if (data[i].columnId == 1) {
                        document.getElementById('column 1').appendChild(searchResultCard);
                    } else {
                        document.getElementById('column 2').appendChild(searchResultCard);
                    }
                } 
                else {
                    noResultCount++
                    console.log('start: ', noResultCount)
                    if (noResultCount === data.length) {
                        const noResult = document.createElement('div')
                        noResult.id = 'nilMsg'
                        console.log('msg id', noResult.id)
                        noResult.innerHTML = `Couldn't find anything that matched your search`
                        document.getElementById('column 1').appendChild(noResult)
                    }
                }
            }
        })
}
//drag and drop cards

// var allCards = document.getElementsByTagName("my-card");
// //console.log(allCards);
// Array.from(allCards).forEach(addDnDHandlers);
// console.log('tagged')
// console.log(allCards);

// function addDnDHandlers(element) {   
//     element.addEventListener('drag',drag(event));
//     element.addEventListener('dragover',allowDrop(event));
//     element.addEventListener('drop',drop(event));
// }

// function drag(event) {
//     console.log('dragging');
//     event.dataTransfer.setData("text", event.target.id);
//     console.log(event);
   
// }

// function allowDrop(event) {
//     event.preventDefault();
// }
  
// function drop(event) {
//     event.preventDefault();
//     var data = event.dataTransfer.getData("text");
//     event.target.appendChild(document.getElementById(data));
// }