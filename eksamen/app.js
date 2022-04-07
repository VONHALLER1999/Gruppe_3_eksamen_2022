//require express
const express = require("express");
const PORT = 1010;
const app = express();
const bodyParser = require("body-parser") 
const path = require("path");
const session = require('express-session'); 
const db = require(".helpers/db.js");

//makes sure that the server is up and running
app.listen(PORT, () => console.log(`Server lytter på port ${PORT}`));

//middleware der parser request fra klienten så der kan bruges req.body her i serveren uden ekstra kode
app.use(bodyParser.urlencoded({ extended: false }));

//sørger for at 
app.use(express.static(path.join(__dirname, "./public")));

//session coockie                                  
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


//gå til login.html før index.html, såfremt der ikke er logged ind på en bruger                     
app.get('/', function(req, res) {
  if (req.session.loggedIn) {
    res.sendFile(__dirname + '/public/index.html');
  } else {
    res.sendFile(__dirname + '/public/login.html');
  }
});


//when signup on the signup page is clicked on the client side the server will receive the data from the client and save it to the database
app.post("/signup", async (req, res) => {
 try {

  if (db.createUser(req.body.email, req.body.password)) {
    console.log("User blev oprettet")
  } else {
    console.log("User findes allerede")
  }
 }catch (err){
  console.log(err)
 }
});


