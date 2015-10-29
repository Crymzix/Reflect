var observableModule = require("data/observable");
//var validator = require("email-validator/index");

function User(info) {
    info = info || {};

    // You can add properties to observables on creation
    var viewModel = new observableModule.Observable({
        email: info.email || "",
        password: info.password || ""
    });

    viewModel.signIn = function(){
        com.parse.ParseUser.logInInBackground(viewModel.get("email"),
        viewModel.get("password"), new com.parse.LogInCallback({
                done: function(ParseUser, ParseException){
                    if (ParseUser != null){

                    } else {

                    }
                }
            }))
    };

    viewModel.register = function() {
        var user = new com.parse.ParseUser();
        user.setUsername(viewModel.get("email"));
        user.setPassword(viewModel.get("password"));
        user.setEmail(viewModel.get("email"));

        user.signUpInBackground(new com.parse.SignUpCallback({
            done: function(ParseException){
                if(ParseException == null){
                    console.log("Signup success!");
                } else {
                    console.log("Signup Failed!");
                }
            }
        }

        ))};

    //viewModel.login = function() {
    //    return fetch(config.apiUrl + "oauth/token", {
    //        method: "POST",
    //        body: JSON.stringify({
    //            username: viewModel.get("email"),
    //            password: viewModel.get("password"),
    //            grant_type: "password"
    //        }),
    //        headers: {
    //            "Content-Type": "application/json"
    //        }
    //    })
    //        .then(handleErrors)
    //        .then(function(response) {
    //            return response.json();
    //        }).then(function(data) {
    //            config.token = data.Result.access_token;
    //        });
    //};
    //
    //viewModel.register = function() {
    //    return fetch(config.apiUrl + "Users", {
    //        method: "POST",
    //        body: JSON.stringify({
    //            Username: viewModel.get("email"),
    //            Email: viewModel.get("email"),
    //            Password: viewModel.get("password")
    //        }),
    //        headers: {
    //            "Content-Type": "application/json"
    //        }
    //    })
    //        .then(handleErrors);
    //};
    //
    //viewModel.resetPassword = function() {
    //    return fetch(config.apiUrl + "Users/resetpassword", {
    //        method: "POST",
    //        body: JSON.stringify({
    //            Email: viewModel.get("email"),
    //        }),
    //        headers: {
    //            "Content-Type": "application/json"
    //        }
    //    })
    //        .then(handleErrors);
    //};
    //
    //viewModel.isValidEmail = function() {
    //    var email = this.get("email");
    //    return validator.validate(email);
    //};

    return viewModel;
}

function handleErrors(response) {
    //if (!response.ok) {
    //    console.log(JSON.stringify(response));
    //    throw Error(response.statusText);
    //}
    //return response;
}

module.exports = User;
