const express = require('express')
const app = express();

const jwt = require('jsonwebtoken');   
const bodyParser = require('body-parser');
//const exjwt = require('express-jwt');
var { expressjwt: exjwt } = require("express-jwt");


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 3000;
const secretKey = "Secret";
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
}); 

let users = [
    {
        id: 1,
        username: 'sai',
        password: '123'
    },
    {
        id: 2,
        username: 'abc',
        password: '456'
    },

];

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
        if(users.some(user => user.username === username && user.password === password)){
            let token = jwt.sign({ username: username}, secretKey, {expiresIn: 180});
            return res.status(200).json({
                success: true,
                err: null,
                token
            });
            //console.log("Token : " + token);
        }
        else{
            res.status(401).json({
                success: false,
                err: 'Username or password is incorrect from for',
                token: null
            });
        }
    console.log("username : ", username, "Password : " , password);
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    console.log("from server dashboard");
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see!!!'
    });
});


app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'View Settings here'
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function(err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password incorrect 2'
        });
    }
    else{
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});