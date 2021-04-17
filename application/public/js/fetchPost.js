//generate a photo card
function createPhotoCard(data, containerDiv) {
    var mainDiv = document.getElementById('items-container');
    var photoCard = document.createElement('div');
    let photoId = parseInt(data.id) + fetchNum * 50;
    photoCard.setAttribute('id', 'photo-' + photoId.toString());
    photoCard.setAttribute('class', 'card');
    mainDiv.appendChild(photoCard);
    photoCard.innerHTML = `
        <img src="${data.url}" class="card-img-top" alt="No photo">
        <div class="card-body">
            <p class="card-text image-title overflow-hidden">${data.title}</p>
            <p class="card-text text-center"><small class="text-muted">comment (0)</small></p>
        </div>
    `;

    document.getElementById('photo-' + photoId.toString()).onclick = function(event) {
        console.log("onclick");
    };
}

//fetch photos and store the total number of photos
function fetchPhotos() {
    var mainDiv = document.getElementById('items-container');
    if(mainDiv) {
        let fetchURL = "https://jsonplaceholder.typicode.com/albums/2/photos";
        fetch (fetchURL)
        .then ((data) => data.json())
        .then ((photos) => {
            let innerHTML = "";
            photos.forEach((photo) => {
                createPhotoCard(photo, mainDiv);
            });
            photoNum += photos.length;
        });
    }
}

let fetchNum = 0; //for generating distinct photo ids
let photoNum = 0; //total number of photos being shown

// the first fetch
fetchPhotos();

//user can fetch more photos by clicking the button
let fetchButton = document.getElementById('fetch-photos');
fetchButton.onclick = function() {
    fetchNum++;
    fetchPhotos();
}

