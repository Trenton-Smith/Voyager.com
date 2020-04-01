const title = document.getElementById('title');
const description = document.getElementById('description');
const userImage = document.getElementById('userImage');
const postImageForm = document.getElementById('postImageForm');
const errorMessages =  document.getElementById('error');
var letters = /^[0-9a-zA-Z ]+$/;//used to validate form characters
var info = [];//used for recording input fields


postImageForm.addEventListener('submit', (e) => {//overrides submit button to stop auto accept/refresh
    let messages = [];//used to display error messages and to stop the form from accepting blank fields

    if(title.value === "" || title.value == null || title.value.length < 1){//if title is left blank, push error
        messages.push('There needs to be a title');
    }else if(!title.value.match(letters)){//if title includes non-alphanumeric chars, push error
        messages.push('Title can only contain alphanumeric characters');
    }

    if(description.value === "" || description.value == null || description.value.length < 1){//if description is blank, push error
        messages.push('There needs to be a description');
    }

    //following block is used to separate the file type specifiers i.e. <fileName.type> returns <type>
    var ext = /^.+\.([^.]+)$/.exec(userImage.value);
    var extension = ext == null ? "" : ext[1];

    switch(extension){//checks to see if the extension acquired above is an image type listed, if it is, continue, if not, push error
        case 'png': break;
        case 'jpg': break;
        case 'bmp':break;
        case 'gif': break;
        case '':
            messages.push('There is no file');
            break;
        default:
            messages.push('The file needs to be either .png .jpg .bmp or .gif');
    }

    if(messages.length > 0){//if there are any error messages, prevent the default functionality of submit: don't refresh or accept data
        e.preventDefault();
        errorMessages.innerText = messages.join(', ');//this is just a clunky little code to connect error messages, in the future look into a better display option for user
    }else{//if there are no errors, push all the user's data into our stored array
        info.push({
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            userImage: document.getElementById('userImage').value,
        });
        console.log(JSON.stringify(info));//print all the saved data to the console
        //console.log(extension);//test code to verify extension type
    }
    //console.log('hello world');//test code to verify console functionality
});//end
