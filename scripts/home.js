const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = "3bd5a7563d2f1a399fa2c575c72eb467";
const latestMovies = document.querySelectorAll(".movie-container")

latestMovies.forEach(e => {
    e.lastElementChild.lastElementChild.addEventListener('click', modalWindowActivator);
})

var config;
function getConfig(){
    var url = baseUrl+"configuration?api_key="+apiKey;
    fetch(url).then(e => e.json()).then(e => {
        config = e;
        nowPlaying();
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