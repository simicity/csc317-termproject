function setFlashFadeOut(flashMessageElement) {
	setTimeout(() => {
		let currentOpacity = 1.0;
		let timer = setInterval(() => {
			if(currentOpacity < 0.05) {
				clearInterval(timer);
				flashMessageElement.remove();
			}
			currentOpacity -= .05;
			flashMessageElement.style.opacity = currentOpacity;
		}, 50);
	}, 1300);
}

function addFlashFromFrontEnd(message, level) {
	let flashMessageDiv = document.createElement('div');
	let innerFlashDiv = document.createElement('div');
	let innerTextNode = document.createTextNode(message);
	innerFlashDiv.appendChild(innerTextNode);
	flashMessageDiv.appendChild(innerFlashDiv);
	flashMessageDiv.setAttribute('id', 'flash-message');
	innerFlashDiv.setAttribute('class', `alert alert-${level}`);
	document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
	setFlashFadeOut(flashMessageDiv);
}

function createCard(postData) {
	return `<div id="post-${postData.id}" class="card mb-3">
		<img class="card-image-top" src="${postData.thumbnail}" alt="No Image">
		<div class="card-body">
			<p class="card-text image-title">${postData.title}</p>
			<p class="card-text">${postData.description}</p>
			<a href="/post/${postData.id}" class="card-text"><small class="text-muted">comment (0)</small></a>
		</div>
	</div>`;	
}

function executeSearch() {
	let searchTerm = document.getElementById('search-text').value;
	if(!searchTerm) {
		location.replace('/');
		return;
	}
	let mainContent = document.getElementById('main-content');
	let searchURL = `/posts/search?search=${searchTerm}`;
	fetch(searchURL)
	.then((data) => {
		return data.json();
	})
	.then((data_json) => {
		let newMainContentHTML = '';
		data_json.results.forEach((row) => {
			newMainContentHTML += createCard(row);
		});
		mainContent.innerHTML = newMainContentHTML;
		if(data_json.message) {
			addFlashFromFrontEnd(data_json.message, data.status);
		}
	})
	.catch((err) => console.log(err));
}

let flashElement = document.getElementById('flash-message');
if(flashElement) {
	setFlashFadeOut(flashElement);
}

let searchButton = document.getElementById('search-btn');
if(searchButton) {
	searchButton.onclick = executeSearch;
}