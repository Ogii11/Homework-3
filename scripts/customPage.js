const ideaContainer = document.querySelector('#ideas');
var storiesArray;
fetch('https://jsonblob.com/api/jsonBlob/a5822d28-887e-11ea-a41c-37ad6c9297da')
.then(e => e.json())
.then(e => {
    storiesArray = e.results;
    storiesArray.forEach(el => {
        loadStories(el);
    })
})

function loadStories(e){
    var ideaDiv = document.createElement('div');
    ideaDiv.classList.add("idea");
    var ideaTitle = document.createElement('h3');
    ideaTitle.classList.add('story-name');
    ideaTitle.innerText = e.title; 
    var actualStory = document.createElement('p');
    actualStory.classList.add('story');
    actualStory.innerText = e.story;
    var ideaAuthor = document.createElement('h3');
    ideaAuthor.classList.add('author');
    ideaAuthor.innerText = "by " + e.author;
    ideaDiv.appendChild(ideaTitle);
    ideaDiv.appendChild(actualStory);
    ideaDiv.appendChild(ideaAuthor);
    ideaContainer.appendChild(ideaDiv);
}

function sendStory(e){
    if(e.parentNode.children[1].value == "") return
    var ntitle = document.querySelector('input[name="title"]').value;
    var nauthor = document.querySelector('input[name="author"]').value;
    var nstory = document.querySelector('#story').value;
    var toSend = {
        author: nauthor,
        title: ntitle,
        story: nstory
    }
    storiesArray.push(toSend);
    toSend = {results:storiesArray};
    let url = "https://jsonblob.com/api/jsonBlob/a5822d28-887e-11ea-a41c-37ad6c9297da";
    fetch(url,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)})
    .then((response) => response.json())
    .then((data) => console.log(data))
    //.catch((error) => console.log(error))
}
