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

app.use(express.json());

//session coockie                                  
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//endpoint med loggedin status som bruges i scripts til HTML siderne til at bestemme om brugeren er logged in
app.get("/loggedstatus", async (req, res) => {
  if (req.session.loggedIn) {
    res.send(true);
  } else {
    res.send(false);
  }
});

//gå til login.html før index.html, såfremt der ikke er logged ind på en bruger  
//MANGLER SESSION UDVIKLING                   
app.get('/', function(req, res) {
  if (req.session.loggedIn) {
    res.sendFile(__dirname + '/public/index.html');
    console.log("Already logged in");
  } else {
    res.sendFile(__dirname + '/public/login.html');
    console.log("Not logged in");
  }
});

//login endpoint
app.post("/login", async (req, res) => {
  try {
    const result = await db.loginUser(req.body.email, req.body.password);
    if (!result) {
      console.log("Email eller kodeord er forkert");
      res.send(result);
    } else {
      console.log("User login succes");
      req.session.username = req.body.email;
      req.session.loggedIn = true;
      console.log(req.session.loggedIn);
      res.send(result);
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
    console.log("User blev oprettet") 
    res.sendFile(__dirname + "/public/login.html");
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
      const result = await db.updateUser(
        req.body.email,
        req.body.password,
        req.body.newPassword
      );
   if (!result) {
     console.log("Email eller kodeord er forkert");
     res.send(false);
   } else {
     console.log("User succesfully updated")
     res.sendFile(__dirname + "/public/index.html");
   }
  }catch (err){
   console.log(err)
  }
 });

app.get("/logout", (req, res) => {
  try {
    req.session.loggedIn = false;
    req.session.username = null;
    console.log("User logged out")
    res.send(true)
  } catch (err) {
    console.log(err);
  }
});


