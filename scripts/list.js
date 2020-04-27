const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = "3bd5a7563d2f1a399fa2c575c72eb467";

var config;
function getConfig(){
    var url = baseUrl+"configuration?api_key="+apiKey;
    fetch(url).then(e => e.json()).then(e => {
        config = e;
    });
}
getConfig();

function searchIfEnter(e){
    if (e.keyCode == 13) {
        search(true);
    }
}

var nameSort = 0,genreSort = false;

function activeSortAZ(){
    nameSort = 1;
    rateWay = "none";
}
function activeSortZA(){
    nameSort = 2;
    rateWay = "none"
}
function disableSort(){
    nameSort = 0;
}

document.querySelectorAll('a[onclick], a[data-way]').forEach(e =>{
    e.addEventListener('click', activeTracker);
})
var previusActive = document.querySelector('.active-sort-option');
function activeTracker(e){
    previusActive.classList.remove('active-sort-option')
    e.target.classList.add('active-sort-option');
    previusActive = e.target;
}

document.querySelectorAll('a[data-id]').forEach(e => {
    e.addEventListener('click', genreTracker);
})
var previousGenre = document.querySelector('a[data-id="all');
previousGenre.classList.add('active-sort-option');
function genreTracker(e){
    previousGenre.classList.remove('active-sort-option')
    e.target.classList.add('active-sort-option');
    previousGenre = e.target;
}




document.querySelectorAll('a[data-id]').forEach(e => {
    e.addEventListener('click', genrePicker);
});
document.querySelectorAll('a[data-way]').forEach(e => {
    e.addEventListener('click', ratePicker);
})

var genre = "all";
function genrePicker(e){
    genre = e.target.dataset.id;
}
var rateWay = "none";
function ratePicker(e){
    rateWay = e.target.dataset.way;
    disableSort();
}

var currentPage = 1, maxPage;
function search(state = false){
    if (state) currentPage = 1;
    document.getElementById('top-rated-boxes').innerHTML = "";
    var searchValue = document.querySelector('input[name="search"]').value;
    var url = baseUrl + "search/movie?api_key=" + apiKey + "&language=en-US&query="+searchValue+"&page="+currentPage;
    fetch(url).then(e => e.json())
    .then(e => {
        maxPage = e.total_pages;
        e.results = e.results.filter(e => {
            return e.vote_average > Number(document.querySelector('input[type="range"]').value);
        })
        if (genre != "all") {
            e.results = e.results.filter(e => {
                return e.genre_ids.some(e =>{
                    return e == genre;
                })
            })
        }
        if(nameSort == 1){
            e.results.sort((a,b)=>{
                if (a.original_title > b.original_title) return 1;
                else return -1;
            })
        } else if(nameSort == 2){
            e.results.sort((a,b)=>{
                if (a.original_title > b.original_title) return -1;
                else return 1;
            })
        }
        if(rateWay != "none"){
            if(rateWay == "low"){
                e.results.sort((a,b)=>{
                return a.vote_average - b.vote_average;
                })
            } else if(rateWay == "high") {
                e.results.sort((a,b)=>{
                return b.vote_average - a.vote_average;
                })
            }          
        }
        e.results.forEach(e => {
            document.getElementById('top-rated-boxes').innerHTML += '<div class="movie-picture-container"><div class="details-relative"><img class="top-rated-images" src="" alt=""><div class="details"><h3 class="movie_title"></h3><h3 class="vote_average"></h3><h3 class="release_date"></h3></div> </div><p class="title">Title</p><div class="rate"><h3 class="movie_rate"></h3></div></div>'
        })
        var images = document.querySelectorAll('.top-rated-images');
        images.forEach((elem,i) => {
            if(e.results[i].poster_path != null){
                elem.src = config.images.secure_base_url+config.images.poster_sizes[4]+e.results[i].poster_path;
            } else {
                elem.src = "../res/images/noImageAvailable.jpg";
            }
            elem.parentNode.children[1].children[0].innerText = e.results[i].original_title;
            elem.parentNode.children[1].children[1].innerText = e.results[i].vote_average;
            elem.parentNode.children[1].children[2].innerText = e.results[i].release_date;
            elem.parentNode.parentNode.lastElementChild.firstElementChild.innerText = e.results[i].vote_average;
        })
        document.querySelectorAll('.title').forEach((elem,i) => {
            elem.innerText = e.results[i].original_title;
        })
        updatePages();
    })
}

var plusOne = document.createElement('button');
plusOne.innerText = "+1";
plusOne.classList.add('page');
plusOne.setAttribute('onclick','oneUp()');
var minusOne = document.createElement('button');
minusOne.innerText = "-1";
minusOne.classList.add('page');
minusOne.setAttribute('onclick','oneDown()');
var plusTen = document.createElement('button');
plusTen.innerText = "+10";
plusTen.classList.add('page');
plusTen.setAttribute('onclick','tenUp()');
var minusTen = document.createElement('button');
minusTen.innerText = "-10";
minusTen.classList.add('page');
minusTen.setAttribute('onclick','tenDown()');
var currentPageBtn = document.createElement('button');
currentPageBtn.classList.add("page");
currentPageBtn.classList.add("current");

function updatePages(){
    var buttonContainer =  document.querySelector('.pages');
    currentPageBtn.innerText = currentPage;    
    for (let i = 0; i < buttonContainer.children.length; i++) {
        buttonContainer.children[i].remove();
    }
     if(Number(currentPageBtn.innerText) > 10){
        buttonContainer.appendChild(minusTen);
        buttonContainer.appendChild(minusOne)
        buttonContainer.appendChild(currentPageBtn);
        buttonContainer.appendChild(plusOne);
        buttonContainer.appendChild(plusTen)
    } else if(Number(currentPageBtn.innerText) > 1){
        buttonContainer.appendChild(minusOne)
        buttonContainer.appendChild(currentPageBtn);
        buttonContainer.appendChild(plusOne);
        buttonContainer.appendChild(plusTen)
    } else if(Number(currentPageBtn.innerText) > 0){
        buttonContainer.appendChild(currentPageBtn);
        buttonContainer.appendChild(plusOne);
        buttonContainer.appendChild(plusTen)
    }
    if(currentPage + 10 > maxPage) buttonContainer.lastElementChild.remove();
    if(currentPage + 1 > maxPage) buttonContainer.lastElementChild.remove();
    console.log(maxPage)
}
function oneUp(){
    currentPage++;
    search();
}
function oneDown(){
    currentPage--;
    search();
}
function tenUp(){
    currentPage+=10;
    search();
}
function tenDown(){
    currentPage-=10;
    search();
}