function getToken() {
    var loginUrl = "http://localhost:3000/login";
    var userElement = document.getElementById('username');
    var passwordElement = document.getElementById('password');
    var tokenElement = document.getElementById('token');

    var user = userElement.value;
    var password = passwordElement.value;

    var header = new Headers({
        "Content-Type" : 'application/json; charset=UTF-8',
    });

    var init = {
        method : 'POST',
        headers : header,
        body: JSON.stringify({name: user, password}),
    }
    fetch(loginUrl, init)
    .then(res => {
        console.log(res);
        if (res.ok) {
            return res.json();
        } else {
            console.error("Response fucked up.");
        }
    })
    .then(res => {
        tokenElement.innerText = res.token;
    })
    .catch(err => {
        console.error(err);
    })

}

function getSecret() {
    var secretUrl = "http://localhost:3000/secret";
    var tokenElement = document.getElementById('token');
    var token = tokenElement.innerHTML;
    console.log(token);
    var headers = new Headers({
        Authorization : "Bearer " + token
    });
    var resultElement = document.getElementById('result');
    var init = { headers };

    fetch(secretUrl, init)
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            console.error("Something went wrong.");
            console.log(res.status);
            console.log(res);
        }
    })
    .then( json => {
        result.innerHTML = json;
    })
    return;
}
