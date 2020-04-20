const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = "3bd5a7563d2f1a399fa2c575c72eb467";
const latestMovies = document.querySelectorAll(".movie-container")
const topRatedMovies = document.querySelectorAll(".movie-picture-container")
latestMovies.forEach(e => {
    e.lastElementChild.lastElementChild.addEventListener('click', modalWindowActivator);
})

var config;
function getConfig(){
    var url = baseUrl+"configuration?api_key="+apiKey;
    fetch(url).then(e => e.json()).then(e => {
        config = e;
        nowPlaying();
        topRated()
    });
}
getConfig();

/*var a;
function lastMovies(){
    var url = baseUrl + "movie/latest?api_key="+apiKey;
    fetch(url).then(e => e.json()).then(e => {
        a=e
        const slika = document.getElementById("slika").src = config.images.secure_base_url+config.images.poster_sizes[2]+a.poster_path;
    });
}*/

var arrayOfNows;
function nowPlaying(){
    var url = baseUrl + "movie/now_playing?api_key="+apiKey+"&language=en-US&page=1";
    fetch(url).then(e => e.json()).then(e => {
        arrayOfNows=e.results.sort((a,b) => {
            if(a.release_date < b.release_date) return 1
            else return -1
        });
        arrayOfNows.splice(10,10)
        imageSliderTracker(9);
    })
}

var arrayOfTopRated;
function topRated(){
    var url = baseUrl + "movie/top_rated?api_key="+apiKey;
    fetch(url).then(e => e.json()).then(e => {
        arrayOfTopRated=e.results;
        // console.log(arrayOfTopRated)
        let topBoxes = document.querySelectorAll(".movie-picture-container");
        let movieTitles=document.getElementsByClassName("movie_title")
        let movieVoteAverage=document.getElementsByClassName("vote_average")
        let movieReleaseDate=document.getElementsByClassName("release_date")
        let movieRate=document.getElementsByClassName("movie_rate")
        for(let i=0;i<topBoxes.length;i++){
            topBoxes[i].firstElementChild.src="https://image.tmdb.org/t/p/w200/"+arrayOfTopRated[i].poster_path;
            movieTitles[i].innerHTML=e.results[i].title
            movieVoteAverage[i].innerHTML=e.results[i].vote_average+'<img src="images/icons/star.png" alt="">';
            movieReleaseDate[i].innerHTML='<img src="images/icons/calendar.png" alt="">'+e.results[i].release_date;
            movieRate[i].innerHTML=e.results[i].vote_average+'<img src="images/icons/star.png" alt="">';
        }
    })
}
    
let button=document.getElementById("moreButton")
button.addEventListener("click",loadMore)
function loadMore(){
    let divBoxes=document.getElementById("top-rated-boxes")
    divBoxes.innerHTML+='<div class="top-rated-movies-container"><div class="movie-picture-container"><img class="top-rated-images" src="" alt=""><div class="details"><h3 class="movie_title"></h3><h3 class="vote_average"></h3><h3 class="release_date"></h3></div><div class="rate"><h3 class="movie_rate"></h3></div></div><div class="movie-picture-container"><img height="315" class="top-rated-images" src="" alt=""><div class="details"><h3 class="movie_title"></h3><h3 class="vote_average"></h3><h3 class="release_date"></h3></div><div class="rate"><h3 class="movie_rate"></h3></div></div><div class="movie-picture-container"><img class="top-rated-images" src="" alt=""><div class="details"><h3 class="movie_title"></h3><h3 class="vote_average"></h3><h3 class="release_date"></h3></div><div class="rate"><h3 class="movie_rate"></h3></div></div></div>'
    topRated()
    let topBoxes = document.querySelectorAll(".movie-picture-container");
    if(topBoxes.length===18){
        button.style.display="none"
    }
}

function imageSliderTracker(x){
    for(var i = 0;i < 5;i++){
        let e = latestMovies[i];
        if(x > 9) x = x - 10;
        if(x < 0) x = x + 10;
        e.firstElementChild.src = config.images.secure_base_url+config.images.poster_sizes[5]+arrayOfNows[x].poster_path; 
        e.lastElementChild.firstElementChild.innerText = arrayOfNows[x].title;
        x++
    }
}


var imageTracker = 9;
function imageSliderLeft(){
    document.querySelector(".latest-movies-container").style.animation = "imageSliderLeft 0.5s"
    setTimeout(function(){
        document.querySelector(".latest-movies-container").style.animation = "";
        imageTracker--;
        if(imageTracker < 0) imageTracker = imageTracker + 10;
        imageSliderTracker(imageTracker);
    },500);
}

function imageSliderRight(){
    document.querySelector(".latest-movies-container").style.animation = "imageSliderRight 0.5s"
    setTimeout(function(){
        document.querySelector(".latest-movies-container").style.animation = "";            
        imageTracker++;
        if(imageTracker > 9) imageTracker = imageTracker - 10;
        imageSliderTracker(imageTracker);
    },500);
}

const imageWindow = document.querySelector("#window");
var windowFlag = false;
imageWindow.addEventListener('mouseover', function(){windowFlag = true});
imageWindow.addEventListener('mouseleave', function(){windowFlag = false});
window.addEventListener('keydown', keyImageTracker);

setInterval(function(){
    if (!windowFlag) {
        imageSliderRight();
    }
},3000)

function keyImageTracker(e){
    if (windowFlag) {
        if(e.keyCode == 39){
            imageSliderRight();
        } else if(e.keyCode == 37){
            imageSliderLeft();
        }
    }
}

const modalWindow = document.querySelector("#modal-window")

function modalWindowActivator(e){
    modalWindow.classList.toggle("active-modal-window");
}