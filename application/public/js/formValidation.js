var inputUsername = document.getElementById('username');
var inputPassword = document.getElementById('password');
var inputConfirmPassword = document.getElementById('confirm-password');
var inputEmail = document.getElementById('email');
var inputConfirmAge = document.getElementById('confirm-age');
var inputConfirmPolicy = document.getElementById('confirm-policy');
var submitRegistration = document.getElementById('submit-registration');

function beginsWithChar(text) {
    return /^[a-zA-Z]/.test(text);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function containsMoreThan3AlphaNumeric(text) {
    return /[a-zA-Z0-9]{3,}/.test(text);
}

function containsNumber(text) {
    return /[0-9]+/.test(text);
}

function containsUpperCase(text) {
    return /[A-Z]+/.test(text);
}

function containsSpecialChar(text) {
    return /[/*\-+!@#$\^&*]+/.test(text);
}

function containsMoreThan8Char(text) {
    return /.{8,}/.test(text);
}

function validateUsername(username) {
    var valid = true;

    if (beginsWithChar(username)) {
        document.getElementById('validation-alert-username1').style.display = "none";
    } else {
        console.log("Username must begins with a character.");
        document.getElementById('validation-alert-username1').style.display = "block";
        valid = false;
    }

    if (containsMoreThan3AlphaNumeric(username)) {
        document.getElementById('validation-alert-username2').style.display = "none";
    } else {
        console.log("Username must contain 3+ alphanumeric characters.");
        document.getElementById('validation-alert-username2').style.display = "block";
        valid = false;
    }

    return valid;
}

function validateEmail(email) {
    var valid = true;

    if (isValidEmail(email)) {
        document.getElementById('validation-alert-email').style.display = "none";
    } else {
        console.log("Email must be valid.");
        document.getElementById('validation-alert-email').style.display = "block";
        valid = false;
    }

    return valid;
}

function validatePassword(password) {
    var valid = true;

    if (containsMoreThan8Char(password)) {
        document.getElementById('validation-alert-password1').style.display = "none";
    } else {
        console.log("Password must contain 8+ characters.");
        document.getElementById('validation-alert-password1').style.display = "block";
        valid = false;
    }

    if ((containsNumber(password))
     && (containsUpperCase(password))
     && (containsSpecialChar(password))) {
        document.getElementById('validation-alert-password2').style.display = "none";
    } else {
        console.log("Password must contain at least 1 upper case letter, 1 number and 1 special characters.");
        document.getElementById('validation-alert-password2').style.display = "block";
        valid = false;
    }

    return valid;
}

function validateConfirmPassword(confirmPassword) {
    var valid = true;

    if (containsMoreThan8Char(confirmPassword)) {
        document.getElementById('validation-alert-confirm-password1').style.display = "none";
    } else {
        console.log("Password must contain 8+ characters.");
        document.getElementById('validation-alert-confirm-password1').style.display = "block";
        valid = false;
    }

    if ((containsNumber(confirmPassword))
     && (containsUpperCase(confirmPassword))
     && (containsSpecialChar(confirmPassword))) {
        document.getElementById('validation-alert-confirm-password2').style.display = "none";
    } else {
        console.log("Password must contain at least 1 upper case letter, 1 numebr and 1 special characters.");
        document.getElementById('validation-alert-confirm-password2').style.display = "block";
        valid = false;
    }

    if (inputPassword.value == confirmPassword) {
        document.getElementById('validation-alert-confirm-password3').style.display = "none";
    } else {
        console.log("Password must match to comfirmpassword.");
        document.getElementById('validation-alert-confirm-password3').style.display = "block";
        valid = false;
    }

    return valid;
}

function validateConfirmAge(checked) {
    var valid = true;

    if (checked) {
        document.getElementById('validation-alert-confirm-age').style.display = "none";
    } else {
        console.log("User must select the checkbox1.");
        document.getElementById('validation-alert-confirm-age').style.display = "block";
        valid = false;
    }

    return valid;
}

function validateConfirmPolicy(checked) {
    var valid = true;

    if (checked) {
        document.getElementById('validation-alert-confirm-policy').style.display = "none";
    } else {
        console.log("User must select the checkbox2.");
        document.getElementById('validation-alert-confirm-policy').style.display = "block";
        valid = false;
    }

    return valid;
}

function validateForm() {
    var valid = true;
    
    valid &= validateUsername(inputUsername.value);
    valid &= validateEmail(inputEmail.value);
    valid &= validatePassword(inputPassword.value);
    valid &= validateConfirmPassword(inputConfirmPassword.value);
    valid &= validateConfirmAge(inputConfirmAge.checked);
    valid &= validateConfirmPolicy(inputConfirmPolicy.checked);

    return valid;
}

inputUsername.onchange = function(event) {
    validateUsername(event.target.value);
}

inputEmail.onchange = function(event) {
    validateEmail(event.target.value);
}

inputPassword.onchange = function(event) {
    validatePassword(event.target.value);
}

inputConfirmPassword.onchange = function(event) {
    validateConfirmPassword(event.target.value);
}

submitRegistration.onclick = function(event) {
    var valid = validateForm();
    console.log("final validation=" + valid);
    return valid;
}
