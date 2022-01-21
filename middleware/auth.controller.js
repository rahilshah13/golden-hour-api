const jwtService = require('./helpers/jwt');

function authenticate() {
    console.log("authentiate middlware");
}

function register() {
    // validate email 
    // validate password
    console.log("authentiate middlware");
}

module.exports = {
    register,
    authenticate,
};