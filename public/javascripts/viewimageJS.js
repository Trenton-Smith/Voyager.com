const imageTitle = document.getElementById('title');
const imageDescription = document.getElementById('description');
const imageId = document.getElementById('imageId');

//Parses the URL to get the path, then changes the image src to display it
var url = window.location.pathname;
let fileName = url.substring( url.lastIndexOf('/')+1);
let fileName2 = fileName.replace(/%2/,' ');
let fileName3 = fileName2.replace(/0+/,'');
console.log(fileName3);


const imageSource = document.getElementById('image');
imageSource.setAttribute("src", "../images/"+fileName3);


const data = {route: fileName3};
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};

getData();
async function getData() {
    const response = await fetch('/fetchData', options);
    const pageDetails = await response.json();//should be returned values for title, description, id
    console.log(pageDetails);
    let title = pageDetails.title;
    let description = pageDetails.description;
    let id = pageDetails.id;
    let comments = pageDetails.comments;
    console.log(">>>>>>>>>>>>>>>>"+title);
    console.log(">>>>>>>>>>>>>>>>"+description);
    console.log(">>>>>>>>>>>>>>>>"+id);
    console.log(">>>>>>>>>>>>>>>>"+comments);
    console.log("*******************"+comments[0]);
    
    imageTitle.innerText = title;
    imageDescription.innerText = description;
    imageId.value = id;
    //console.log(imageId.value);
    
    //build Divs for comments
    function buildCommentDiv(src){
        return '<div class="newComment" id="newComment">'+src+'</div>';
    }
    var count = 1;
    for(i = 0; i < comments.length; i++){
        eleDiv = buildCommentDiv(comments[i]);
        let div = document.getElementById("newComment");
        div.innerHTML = eleDiv + div.innerHTML;
    }
}


//comments functionality
var commentsForm = document.getElementById('commentsForm');
var comments = document.getElementById('comments');

//overrides submit button to stop auto accept/refresh
commentsForm.addEventListener('submit', (e) => {
    if(comments.value === ""){
        e.preventDefault();
    }else{
        console.log(">>>>>>>>>>>>we are successful at submit");        
    }
});




