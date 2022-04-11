//require express
const express = require("express");
const PORT = 1010;
const app = express();
const bodyParser = require("body-parser") 
const path = require("path");
const session = require("express-session");
//const session = require('express-session'); 
const db = require("./helpers/db.js");
const db1 = require("./helpers/db1.js");

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
//MANGLER SESSION UDVIKLING                   
app.get('/', function(req, res) {
  if (req.session.loggedIn) {
    res.sendFile(__dirname + '/public/index.html');
  } else {
    res.sendFile(__dirname + '/public/login.html');
  }
});

//login endpoint
app.post("/login", async (req, res) => {
  try {
    const result = await db.loginUser(req.body.email, req.body.password);
    if (!result) {
      console.log("Email eller kodeord er forkert");
      res.send("Error");
    } else {
      console.log("User login succes");
      res.sendFile(__dirname + "/public/index.html");
    }
  } catch (err) {
    console.log(err);
  }
});

//when signup on the signup page is clicked on the client side the server will receive the data from the client and save it to the database
app.post("/signup", async (req, res) => {
 try {
      const result = await db.createUser(req.body.email, req.body.password)
  if (result) {
    res.sendFile(__dirname + '/public/login.html');
    console.log("User blev oprettet")
    req.session.username = email; 
    req.session.loggedin = true; 
  } else {
    console.log("User findes allerede");
  }

 }catch (err){
  console.log(err)
 }
});

app.get('/deleteuser', function(req, res) {
    res.sendFile(__dirname + '/public/deleteuser.html');
});

app.get('/updateuser', function(req, res) {
  res.sendFile(__dirname + '/public/updateuser.html');
});

//Sender JSON med alle opslag til endpointet hvor den bliver fetched i opslag.js og herefter sat på index.html
app.get("/allposts", async (req, res) => {
  try {
    console.log("button for all posts clicked");
    const result = await db1.allPosts();
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.post("/deleteuser", async (req, res) => {
  try {
      const result = await db.deleteUser(req.body.email, req.body.password)
   if (result == true) {
     console.log("Email eller kodeord er forkert");
     res.send("Error");
   } else {
     console.log("User succesfully deleted")
     req.session.loggedin = false;
     req.session.username = null; 
     res.status(200);
     res.redirect("eksamen/public/index.html");
   }
  }catch (err){
   console.log(err)
  }
 });

app.post("/updateuser", async (req, res) => {
  try {
      const result = await db.updateUser(req.body.email, req.body.password);
      console.log()
   if (result) {
     console.log("Email eller kodeord er forkert");
     res.send("Error");
   } else {
     console.log("User succesfully updated")
     res.sendFile(__dirname + "/public/index.html");
   }
  }catch (err){
   console.log(err)
  }
 });

app.get("/logoutUser", (req, res) => {
  req.session.loggedin = false;
  req.session.username = null; 
  res.status(200);
  res.redirect("eksamen/public/index.html");
});


