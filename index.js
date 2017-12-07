var _ = require('lodash');
var express = require("express");
var bp = require("body-parser");
var jwt = require("jsonwebtoken");

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
/* A strategy is a middleware. A request will go through the strategy
 * before it goes to your route.
 */
var JwtStrategy = passportJWT.Strategy;

var users = [
  {
    id: 1,
    name: 'jonathanmh',
    password: '%2yx4'
  },
  {
    id: 2,
    name: 'test',
    password: 'test'
  }
];

var jwtOptions = {}
/* Q: Can we change this? Does this decide where the token is placed
 * in a request, and does this mean that there are other options for
 * places to store the token in a request?
 * NOTE: To use this, the header must be:
 * Authorization: Bearer {TOKEN}
 */
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'buttawhuttafug';

/* payload : The JSONWebToken.
 * next : The next route to call. This is what makes this function a
 * middleware. The function does something first, then passes the
 * request off to another route.
 *
 * It's more likely that this function gets called inside some larger
 * middleware. The 'next' function gets passed inside, allowing this
 * callback to control what ultimately happens to the request. Either
 * some next thing is performed with the defined user, or we stop
 * short now because the given user doesn't exist.
 */
var strategy = new JwtStrategy(jwtOptions, (payload, next) => {
    console.log("Payload received", payload);
    var user = users[_.findIndex(users, {id: payload.id})];
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);

var app = express();
/* Q: What's the point of this initialize function? Why is passport
 * itself not the middleware?
 * Q: We want to use the passport middleware *first*? Before any other
 * forms of middleware? Can unsafe things be injected in parts of the
 * parsed request or something?
 * Q: How does this mix with explictly using a function as
 * authentication middleware, as we do with the `/secret` route? Are
 * they really both required? Is our strategy just for validating a
 * token, and then the actual protection function is something that we
 * do on a per-route basis?
 */
app.use(passport.initialize());
app.use(bp.urlencoded({extended : true}));
app.use(bp.json());
/* Serves the JS file. */
app.use(express.static('public'));


app.get("/", function(req, res) {
    res.sendFile(process.cwd() + '/public/index.html');
});

app.post("/login", (req, res) => {
    console.log(req.headers);
    console.log(req.body);
    console.log(req.query);
    if (req.body.name && req.body.password) {
        var {name, password} = req.body;
    }
    var user = users[_.findIndex(users, {name})];
    if (!user) {
        res.status(401).json({message: "No such user found."});
        return;
    }
    if (user.password === password) {
        var payload = {id: user.id};
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({message: "ok", token});
    } else {
        res.status(401).json({message: "Invalid Password."});
    }
});

/* So, to use this, we make passport.authenticate a handler before
 * other handlers. I guess this is the exact same thing as using a
 * middleware.
 */
app.get('/secret', passport.authenticate('jwt', {session : false}),
        (req, res) => {
    res.json("Success! You cannot see this without a valid token.");
});

app.listen(3000, function() {
  console.log("Express running");
});

/* Remaining Questions:
 * Q: How do I access the token itself? How do I examine the claims?
 * A: For some reason, this just seems like the most clear description
 * of the structure of the JWT:
 * <https://www.toptal.com/web/cookie-free-authentication-with-json-web-tokens-an-example-in-laravel-and-angularjs>.
 * The diagram here works. The header and payload are just base64
 * encoded. I guess that the header and payload are not meant to be
 * private. This doesn't seem to be for privacy. I'm not actually sure
 * what's going on with that.
 */

/* Sources:
 * Server-Side : <https://jonathanmh.com/express-passport-json-web-token-jwt-authentication-beginners/>
 * Client-side: <http://jonathanmh.com/example-json-web-tokens-vanilla-javascript/>
 */
