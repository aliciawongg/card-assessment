class MyColumn extends HTMLElement {
    constructor() {
        super();
        
    }
}

customElements.define('my-column', MyColumn)

const url1 = 'http://localhost:3000/columns'

window.addEventListener('load', ()=> {
    createColumn();
})

async function createColumn() {
    const response = await fetch(url1);
    const json = await response.json();
    console.log(json);

    json.forEach((column) => {
        console.log(column.title);
        const newColumn = document.createElement('my-column');
        newColumn.id = `${column.title}`;
        newColumn.innerHTML = `<h2>${column.title}</h2>`;
        document.body.appendChild(newColumn);
    })
}

class MyCard extends HTMLElement {
    constructor() {
        super();
        
    }
}

customElements.define('my-card', MyCard)

const url2 = 'http://localhost:3000/cards'

window.addEventListener('load', ()=> {
    getCardInfo();
})

async function getCardInfo() {
    const response = await fetch(url2);
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
