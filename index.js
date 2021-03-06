const access_token = 305007910861456;

const autoCompleteConfig = {
    renderOption(titan) {
        const imgSrc = titan.image.url === 'N/A' ? '' : titan.image.url;
         return `
            <img src="${imgSrc}" />
            ${titan.name} 
            (${titan.biography["full-name"]})
        `;
    },
    inputValue(titan) {
        return titan.name;
    },
    async fetchData(e) {
        const req = await axios.get(`https://fast-shore-92686.herokuapp.com/listofheros/${e}`);
             
        let data = req.data.results;
        let GoodData = [];
        let BadData = [];
        for (let i=0; i < data.length - 1; i++) {
            if (data[i].powerstats.combat === 'null' &&
                data[i].powerstats.durability === 'null' &&
                data[i].powerstats.intelligence === 'null' &&
                data[i].powerstats.speed === 'null' &&
                data[i].powerstats.power === 'null') 
            {
                BadData.push(data[i])
            } else {
                GoodData.push(data[i])
            }
        } 

        return GoodData
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    root : document.querySelector('#left-autocomplete'),
    onOptionSelect(titan) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onTitanSelect(titan, '#left-summary', 'left');
    }
});

createAutoComplete({
    ...autoCompleteConfig,
    root : document.querySelector('#right-autocomplete'),
    onOptionSelect(titan) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onTitanSelect(titan, '#right-summary', 'right');
    },
});

callForLoader = () => {
    return new Promise((resolve) => setTimeout(() => resolve(), 2000))
}

let leftTitan;
let rightTitan;

const onTitanSelect = async function(titan, summary, side) {
    const titanReq = await axios.get(`https://fast-shore-92686.herokuapp.com/hero/${titan.id}`);
    
    callForLoader();

    document.querySelector(`${summary}`).innerHTML = titanTemplate(titanReq.data)

    if(side === 'left') {
        leftTitan = titanReq.data;
    } else {
        rightTitan = titanReq.data;
    }
    if(leftTitan && rightTitan) {
        runComparison();
    }
};

const deleteBtn = function() {
    const rightSummary = document.querySelector('#right-summary');
    const leftSummary = document.querySelector('#left-summary');
    const leftInput = document.querySelector('#left-autocomplete .input');
    const rightInput = document.querySelector('#right-autocomplete .input');

    leftInput.value = '';
    rightInput.value = '';
    rightSummary.innerHTML = '';
    leftSummary.innerHTML = '';
}

const runComparison = () => {
    // leftSideStats is an object
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (isNaN(rightSideValue) || isNaN(leftSideValue) || leftSideValue === rightSideValue){
            rightStat.classList.remove('is-primary');
            leftStat.classList.remove('is-primary');
        } else if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
}

const titanTemplate = (titanDetail) => {
    const combat = titanDetail.powerstats.combat;
    const durability = titanDetail.powerstats.durability;
    const intelligence = titanDetail.powerstats.intelligence;
    const power = titanDetail.powerstats.power;
    const speed = titanDetail.powerstats.speed;
    return ` 
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${titanDetail.image.url}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${titanDetail.name}</h1>
                    <p>${titanDetail.biography["full-name"]}, (${titanDetail.appearance.race})</p>
                    <h4>${titanDetail.work.occupation}</h4>
                    <h5>Publisher: ${titanDetail.biography.publisher}</h5>
                </div>
            </div>
        </article>
        <article data-value=${combat} class="notification is-primary">
            <p class="title">${titanDetail.powerstats.combat}</p>
            <p class="subtitle">Combat</p>
        </article>
        <article data-value=${durability} class="notification is-primary">
            <p class="title">${titanDetail.powerstats.durability}</p>
            <p class="subtitle">Durability</p>
        </article>
        <article  data-value=${intelligence} class="notification is-primary">
            <p class="title">${titanDetail.powerstats.intelligence}</p>
            <p class="subtitle">Intelligence</p>
        </article>
        <article data-value=${power} class="notification is-primary">
            <p class="title">${titanDetail.powerstats.power}</p>
            <p class="subtitle">Power</p>
        </article>
        <article data-value=${speed} class="notification is-primary">
            <p class="title">${titanDetail.powerstats.speed}</p>
            <p class="subtitle">Speed</p>
        </article>
    `;
}


