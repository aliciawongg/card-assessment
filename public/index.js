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
        newColumn.id = `${column.title}`
        newColumn.innerHTML = `<h2>${column.title}</h2>`;
        document.querySelector('.container').appendChild(newColumn);
        
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
        const shadowRoot = newCard.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `<p>${card.title}<br/>${card.description}<br/>Column: ${card.columnId}</p>`;
        if (card.columnId == 1) {
            document.getElementById('Column 1').appendChild(shadowRoot);
        } else {
            document.getElementById('Column 2').appendChild(shadowRoot);
        }
    })
}
// create card
//document.getElementById('createCard').addEventListener('submit', createCard);
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
