const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = "3bd5a7563d2f1a399fa2c575c72eb467";
const latestMovies = document.querySelectorAll(".movie-container")
const bestMoviesContainer = document.querySelectorAll(".best")

latestMovies.forEach(e => {
    e.lastElementChild.lastElementChild.addEventListener('click', modalWindowActivator);
})

var config;
function getConfig(){
    var url = baseUrl+"configuration?api_key="+apiKey;
    fetch(url).then(e => e.json()).then(e => {
        config = e;
        nowPlaying();
        backgroundBaseUrl = config.images.secure_base_url + config.images.backdrop_sizes[1];
        bestMovies();
    });
}
getConfig();

var arrayOfBests,backgroundBaseUrl;;
function bestMovies(){
    var url = baseUrl + "trending/movie/day?api_key="+apiKey;
    fetch(url).then(e => e.json()).then(e => {
        arrayOfBests = e.results.sort((a,b) =>{
            if(a.vote_average > b.vote_average) return -1;
            else return 1;
        });
        arrayOfBests.splice(3,17);
        bestMoviesContainer.forEach((e,i) => {
            e.firstElementChild.src = backgroundBaseUrl + arrayOfBests[i].backdrop_path;
            e.lastElementChild.firstElementChild.innerText = arrayOfBests[i].original_title;
        })
    });
}

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

const imageWindow = document.querySelector("#latest");
var windowFlag = false;
imageWindow.addEventListener('mouseover', function(){windowFlag = true});
imageWindow.addEventListener('mouseleave', function(){windowFlag = false});
window.addEventListener('keydown', keyImageTracker);

setInterval(function(){
    if (!windowFlag) {
        imageSliderRight();
    }
},3000);

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
var test;
function modalWindowActivator(e){
    if(e.target.dataset.moviearray == "arrayOfNows"){
        test = e.target
        var movieName = e.target.parentNode.firstElementChild.innerText;
        modalWindow.children[1].innerText = movieName;

        modalWindow.children[2].src = config.images.secure_base_url + config.images.backdrop_sizes[1] + arrayOfNows.find(e => e.title == movieName).backdrop_path; 

        modalWindow.children[3].innerText = arrayOfNows.find(e => e.title == movieName).overview; 
    }
    modalWindow.classList.toggle("active-modal-window");
}
function closeModalWindow(){
    modalWindow.classList.toggle("active-modal-window");
}

function activateMenu(e){
    document.querySelector(".menu").firstElementChild.classList.toggle("active");
    e.classList.toggle("menu-button-active");
}

window.addEventListener('resize',menuUpdate);

var mflag = true,kflag = true;
function menuUpdate(e){
    if(e == undefined && window.innerWidth <= 600){
        document.querySelector(".menu").firstElementChild.classList.remove("active");
    } else {
        if(e.originalTarget.innerWidth <= 600){
            if(mflag){
                document.querySelector(".menu").firstElementChild.classList.remove("active");
                mflag = false;
                kflag = true;
            }
        } else {
            if(kflag){
                document.querySelector(".menu").firstElementChild.classList.add("active");
                mflag = true;
                kflag = false;
            }
        }
    }
}
menuUpdate();