const uname = document.getElementById('uname');
const pword = document.getElementById('pword');
const pwordc = document.getElementById('pwordc');
const registrationForm = document.getElementById('registrationForm');
const errorMessages =  document.getElementById('error');


//block used to validate form characters
var letters = /^[0-9a-zA-Z]+$/;
var numbers = /[0-9]/;
var specChars = /[!@#$%^&*/()]/;
var uppCase = /[A-Z]/;

var info = [];//used for recording input fields


registrationForm.addEventListener('submit', (e) => {//overrides submit button to stop auto accept/refresh
    let messages = [];//used to display error messages and to stop the form from accepting blank fields

    if(uname.value === "" || uname.value == null || uname.value.length < 3){//if username is blank or under 3 alphanumeric chars, push error
        messages.push('Username needs to be at least 3 alphanumeric characters');
    }else if(!uname.value.match(letters)){
        messages.push('Username can only contain alphanumeric characters');
    }

    if(pword.value === "" || pword.value == null || pword.value.length < 8){//if password is blank or under 8 chars, push error
        messages.push('Password needs to be at least 8 characters');
    }else if(!pword.value.match(uppCase) || !pword.value.match(numbers) || !pword.value.match(specChars)){//also if password does not include at least 1 of each char type, push error
        messages.push('Password needs to include at least 1 upper case character, one number, and 1 special character');
    }

    if(pwordc.value !== pword.value){//check to see if password and password confirmation match, if not, push error
        messages.push('Passwords do not match');
    }

    if(messages.length > 0){//if there are any error messages, prevent the default functionality of submit: don't refresh or accept data
        e.preventDefault();
        errorMessages.innerText = messages.join(', ');//this is just a clunky little code to connect error messages, in the future look into a better display option for user
    }else{//if there are no errors, push all the user's data into our stored array
        info.push({
            username: document.getElementById('uname').value,
            email: document.getElementById('email').value,
            password: document.getElementById('pword').value,
            passwordc: document.getElementById('pwordc').value
        });
        //console.log(JSON.stringify(info));//print all the saved data to the console
    }
    //console.log('hello world');

});//end
