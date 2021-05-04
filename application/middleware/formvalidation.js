const formValidation = {};

formValidation.validateUsername = function(username) {
    return /^[a-zA-Z][a-zA-Z0-9]{2,}/.test(username);
}

formValidation.validateEmail = function(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

formValidation.validatePassword = function(password) {
    return /.{8,}/.test(password) && /[0-9]+/.test(password) && /[A-Z]+/.test(password) && /[/*\-+!@#$\^&*]+/.test(password);
}

formValidation.validateConfirmPassword = function(password, confirmPassword) {
    return password == confirmPassword;
}

module.exports = formValidation;