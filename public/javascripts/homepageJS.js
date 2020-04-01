//loads the images onto the homepage
getData();
async function getData() {
    const response = await fetch('/imageLoad');
    const paths = await response.json();//paths is now an array of filenames from images
    console.log(paths);
    
    function buildImageDiv(src){
        return '<a href="/viewimage/'+src+'"><div class="images" id="'+ src +'"><img src="../images/'+ src +'" width="800px" height="350px"></div></a>';
    }
    
    var count = 1;
    for(i = 0; i < paths.length; i++){
        eleDiv = buildImageDiv(paths[i]);
        switch(count){
            case 1:
                let div = document.getElementById("newImage1");
                div.innerHTML = eleDiv + div.innerHTML;
                count = 2;
                break;
            case 2:
                let div2 = document.getElementById("newImage2");
                div2.innerHTML = eleDiv + div2.innerHTML;
                count = 3;
                break;
            case 3: 
                let div3 = document.getElementById("newImage3");
                div3.innerHTML = eleDiv + div3.innerHTML;
                count = 4;
                break;
            case 4:
                let div4 = document.getElementById("newImage4");
                div4.innerHTML = eleDiv + div4.innerHTML;
                count = 1;
                break;
        }
    }
}


//Searchbar functionality
const search = document.getElementById('searchBar');
search.addEventListener('keyup', function(e){
    const term = e.target.value.toLowerCase();
    var images = document.getElementsByClassName('images');
    Array.from(images).forEach(function(image){
        const title = image.getAttribute('id');
        if(title.toLowerCase().indexOf(term) != -1){
            image.style.display = 'block';
        }else{
            image.style.display = 'none';
        }
    })
});

