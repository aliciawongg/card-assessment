class MyCard extends HTMLElement {
    constructor() {
        super();
        
    }
}

customElements.define('my-card', MyCard)

const url = 'http://localhost:3000/cards'

window.addEventListener('load', ()=> {
    getCardInfo();
})

async function getCardInfo() {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);

    json.forEach((card) => {
        console.log(card.title);
        const newCard = document.createElement('my-card');
        newCard.innerHTML = `<p>${card.title} ${card.description} ${card.columnId}</p>`;
        document.body.appendChild(newCard);
    })
}

