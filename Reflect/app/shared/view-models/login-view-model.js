var observableModule = require("data/observable");
var http = require("http");
var applicationSettings = require("application-settings");


function User(info) {

    info = info || {};


    // You can add properties to observables on creation
    var viewModel = new observableModule.Observable({
        email: info.email || "",
        password: info.password || ""
    });

    viewModel.signIn = function(){
        var ret = validateLogin(viewModel.get("email"),viewModel.get("password"));
        if(ret == null) {
            return http.getJSON({
                url: "https://api.parse.com/1/login?username=" + viewModel.get("email") + "&password=" +
                viewModel.get("password"),
                method: "GET",
                headers: {
                    "X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
                    "X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6",
                    "X-Parse-Revocable-Session": "1"
                }
            }).then(function (response) {
                console.log(JSON.stringify(response));
                applicationSettings.setString("currentUser", response.objectId);
            }, function (e) {
                console.log(e);
            });
        } else if (ret != null){
            throw new Error("Login failed");
        }
    };

    viewModel.register = function() {
        var ret = validateSignup(viewModel.get("email"),viewModel.get("password"));
        if (ret == null) {
            return http.getJSON({
                url: "https://api.parse.com/1/users",
                method: "GET",
                headers: {
                    "X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
                    "X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6"
                }
            }).then(function (response) {
                var that = [];
                that = response.results;
                var duplicate = checkDuplicate(viewModel.get("email"), that, response.results.length);

                if (duplicate != null){
                    throw new Error("username taken");
                }

                http.request({
                    url: "https://api.parse.com/1/users",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
                        "X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6",
                        "X-Parse-Revocable-Session": "1"
                    },
                    content: JSON.stringify({"username": viewModel.get("email"), "password": viewModel.get("password")})
                }).then(function (response) {
                    result = response.content.toJSON();
                    console.log(result);
                }, function (e) {
                    console.log("Error occurred " + e);
                });
            }, function (e) {
                console.log(e);
            });
        } else if (ret != null) {
            throw new Error("Signup failed");
        }


    };

    //viewModel.signIn = function(){
    //    return http.getJSON({
    //        url:"https://api.parse.com/1/login?username=" + viewModel.get("email") + "&password=" +
    //            viewModel.get("password"),
    //        method: "GET",
    //        headers: {
    //            "X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
    //            "X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6",
    //            "X-Parse-Revocable-Session": "1"
    //        }
    //    }).then(function (response) {
    //        console.log(JSON.stringify(response));
    //        applicationSettings.setString("currentUser",response.objectId);
    //    }, function (e) {
    //        console.log(e);
    //    });
    //};
    //
    //viewModel.register = function() {
    //    var result;
    //    return http.request({
    //        url: "https://api.parse.com/1/users",
    //        method: "POST",
    //        headers: {"Content-Type": "application/json",
    //            "X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
    //            "X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6",
    //            "X-Parse-Revocable-Session": "1"},
    //        content:JSON.stringify({"username": viewModel.get("email"), "password": viewModel.get("password")})
    //    }).then(function (response) {
    //        result = response.content.toJSON();
    //        if(response.error != null) {
    //            applicationSettings.setString("errorCode", response.error);
    //        }
    //        console.log(result);
    //    }, function (e) {
    //        console.log("Error occurred " + e);
    //    });
    //};

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

    // Android Parse way of signing up
    //var user = new com.parse.ParseUser();
    //user.setUsername(viewModel.get("email"));
    //user.setPassword(viewModel.get("password"));
    //user.setEmail(viewModel.get("email"));
    //
    //user.signUpInBackground(new com.parse.SignUpCallback({
    //        done: function(ParseException){
    //            if(ParseException == null){
    //                console.log("Signup success!");
    //            } else {
    //                console.log("Signup Failed!");
    //                applicationSettings.setString("errorCode","Failed Signup");
    //            }
    //        }
    //    }
    //
    //))

    return viewModel;
}

function handleErrors(response) {
    //if (!response.ok) {
    //    console.log(JSON.stringify(response));
    //    throw Error(response.statusText);
    //}
    //return response;
}

function validateLogin(username,password){
    if(!username || !password){
        return "Please ensure that both fields are filled in";
    }
    return null;
}

function validateSignup(username,password){
    if(!username || !password){
        return "Please ensure that both fields are filled in";
    }
    return null;
}

function checkDuplicate(name,response,responselength){
    for (var i = 0; i < responselength; i++) {
        if (response[i].username == name) {
            return "Username taken";
        }
    }

    return null;
}

module.exports = {
    User: User,
    validateLogin: validateLogin,
    validateSignup: validateSignup,
    checkDuplicate: checkDuplicate,
	
};
