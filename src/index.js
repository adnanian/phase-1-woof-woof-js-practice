const URL_PREFIX = 'http://localhost:3000/pups';

const DOG_FILTER = {
    SWITCH_ON: "ON",
    SWITCH_OFF: "OFF"
}

const DOG_FILTER_PREFIX = "Filter good dogs: ";

const isGoodDogTextContext = (isGoodDog) => {
    return `${isGoodDog ? "Good" : "Bad"} Dog!`;
};

/*
When a user clicks the Good Dog/Bad Dog button, two things should happen:

The button's text should change from Good to Bad or Bad to Good
The corresponding pup object in the database should be updated to reflect the new isGoodDog value
*/
function updateDogStatus(pup) {
    console.log(pup);
    return fetch (`${URL_PREFIX}/${pup.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
            "isGoodDog": pup.isGoodDog
        })
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.isGoodDog);
        document.querySelector('.dog-status').textContent = isGoodDogTextContext(data.isGoodDog);
    });
}

/*
When a user clicks on a pup's span in the div#dog-bar, 
that pup's info (image, name, and isGoodDog status) 
should show up in the div with the id of "dog-info"
*/
function displayPup(pup) {
    const dogInfo = document.getElementById('dog-info');
    dogInfo.innerHTML =
        `<img src="${pup.image}">
        <h2>${pup.name}</h2>
        <button class="dog-status">${isGoodDogTextContext(pup.isGoodDog)}</button>
        `;
    dogInfo.querySelector('.dog-status').addEventListener('click', (e) => {
        //console.log(e.target.parentNode);
        pup.isGoodDog = !pup.isGoodDog;
        console.log(updateDogStatus(pup));
    });
}

/*When a user clicks the Good Dog/Bad Dog button, two things should happen:*/
function fetchPups() {
    return fetch(URL_PREFIX)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            const dogBar = document.getElementById('dog-bar');
            for (const dog of data) {
                const dogName = document.createElement('span');
                dogName.textContent = dog.name;
                dogName.addEventListener('click', (event) => {
                    displayPup(dog);
                });
                dogBar.appendChild(dogName);
            }
        });
}

/*
When a user clicks on the Filter Good Dogs button, two things should happen:

The button's text should change from "Filter good dogs: OFF" to "Filter good dogs: ON", or vice versa.
If the button now says "ON" (meaning the filter is on), then the Dog Bar should only show pups whose isGoodDog attribute is true. If the filter is off, the Dog Bar should show all pups (like normal).
*/
function dogFilter(dogFilterMode) {
    const dogBarArray = Array.from(document.getElementById('dog-bar').children);
    console.log(dogBarArray);
    switch (dogFilterMode) {
        case DOG_FILTER.SWITCH_ON:
            for (const dogBar of dogBarArray) {
                dogBar.style.display = 'flex';
            }
            return DOG_FILTER.SWITCH_OFF;
        case DOG_FILTER.SWITCH_OFF:
            const promise = fetch(URL_PREFIX)
                .then((response) => response.json())
                .then((data) => {
                    for (let i = 0; i < dogBarArray.length; i++) {
                        console.log(`${data[i].name} is good dog: ${data[i].isGoodDog}`);
                        if (!data[i].isGoodDog) {
                            dogBarArray[i].style.display = 'none';
                        }
                    }
                });
            console.log(promise);
            return DOG_FILTER.SWITCH_ON;
        default:
            console.error(`${dogFilterMode} is not a valid dog filter mode!`);
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log(fetchPups());
    document.getElementById('good-dog-filter').addEventListener('click', (event) => {
        let newMode = dogFilter(event.target.textContent.slice(DOG_FILTER_PREFIX.length));
        console.log(newMode);
        event.target.textContent = `${DOG_FILTER_PREFIX}${newMode}`;
    });
});

