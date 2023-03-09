const search = document.querySelector('.search');
const searchList = document.querySelector('.search_list');
const mainCards = document.querySelector('.main_cards');
const mainDetails = document.querySelector('.main_details');
const closeMainDetails = document.querySelector('.main_details-close');

const data = await fetchData();
let update = true;
console.log(data);

search.addEventListener('keyup', handleEventSearch);
closeMainDetails.addEventListener('click', handleCloseDetails);

function handleEventSearch(event) {
	findEvent();
}

function handleCloseDetails(event) {
	closeDetails();
}

export default async function fetchData(keyword) {
	const clientID = 'vHK0QjkSRoFiB3AOw0fIRNMhYfy7678t';
	const baseURL = 'https://app.ticketmaster.com/discovery/v2/';

	const URL = `${baseURL}events.json?apikey=${clientID}&sort=id,asc&keyword=${keyword}`;
	const result = await fetch(`${URL}`);
	const data = await result.json();
	if (result.ok) {
		displayEventList(data._embedded.events);
		loadEventDetails(data._embedded.events);
	}
	return data;
}


function findEvent() {
	let searchTerm = (search.value).trim();
	if (searchTerm.length > 0) {
		searchList.classList.remove('search_list-hide');
		fetchData(searchTerm);
	} else {
		searchList.classList.add('search_list-hide');
	}
}

function displayEventList(events) {
	searchList.innerHTML = "";
	for (let index = 0; index < events.length; index++) {
		let eventListItem = document.createElement('div');
		// eventListItem.dataset.id = events[index].id;
		eventListItem.classList.add('search_list-item');
		eventListItem.innerHTML = `
			<div class="search_item-thumbnail">
				<img src="${events[index].images[0].url}">
			</div>

			<div class="search_list-info">
				<h3 class="list_info-name">${events[index].name}</h3>
				<p class="list_info-date">${events[index].dates.start.localDate}</p>
			</div>
			`;
		searchList.appendChild(eventListItem);
	}
	const listItem = document.querySelectorAll('.search_list-item');
	listItem.forEach(list => {
		list.addEventListener('click', () => {
			mainDetails.classList.remove('hide_details');
			displayDetails(data._embedded.events);
		});
	});
};


function loadEventDetails(events) {
	const searchListEvents = searchList.querySelectorAll('.search_list-item');
	searchListEvents.forEach(event => {
		event.addEventListener('click', () => {
			console.log(events[0]);
			searchList.classList.add('search_list-hide');
			search.value = "";
		})
	});
}

function displayUpcomingEvents(events) {
	for (let index = 0; index < events.length; index++) {
		let eventListItem = document.createElement('div');
		eventListItem.classList.add('card');
		eventListItem.innerHTML = `
			<div class="card_image">
				<img src="${events[index].images[0].url}">
			</div>

			<div class="card_info">
				<h4 class="card_info-name">${events[index].name}</h4>
				<p class="card_info-date">${events[index].dates.start.localDate}</p>
			</div>
		`;
		mainCards.appendChild(eventListItem);
	}
	const cards = document.querySelectorAll('.card');
	cards.forEach(card => {
		card.addEventListener('click', () => {
			mainDetails.classList.remove('hide_details');
			displayDetails(data._embedded.events);
		});
	});
}
displayUpcomingEvents(data._embedded.events);


function displayDetails(event) {
	let detailsContainer = document.createElement('div');
	// detailsContainer.dataset.id = event[index].id;
	detailsContainer.classList.add('main_details-container');
	detailsContainer.innerHTML = `
	<h2>${event[index].name}</h2>
	<div class="details_container">
		<img src="${event[index].images[0].url}">
		<div class="details_container-info">
			<p class="main_details-city"><b>City: </b>${event[index]._embedded.venues[0].city.name}</p>
			<p class="main_details-venue"><b>Venue: </b>${event[index]._embedded.venues[0].name}</p>
			<p class="main_details-info">${event[index].info}</p>
		</div>
	</div>
	<a class="main_details-link" href="${event[index].url}">Buy Tickets Here</a>
	`;
	if (update) {
		mainDetails.appendChild(detailsContainer);
		console.log(event);
		update = false;
	}
};


function closeDetails() {
	mainDetails.classList.add('hide_details');
}


window.addEventListener('click', (event) => {
	if (event.target.className !== 'search') {
		searchList.classList.add('search_list-hide');
	}
});



