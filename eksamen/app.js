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
  if (req.session.loggedIn || db.isAdmin(req.session.username)){   //Giver admin ret til at opdatere brugere, krav 13. Fucker mulighvis med krav 14
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

//Admin endpoint der kun giver adgang til /admin hvis brugeren er en admin
app.get("/admin", async (req, res) => {
  try {
    const result = await db.isAdmin(req.session.username);
    if (result) {
      res.sendFile(__dirname + "/public/admin.html");
    } else {
      res.sendFile(__dirname + "/public/index.html");
    }
  } catch {

  }
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

app.get("/deletedeuser", async (req, res) => {
  try {
    console.log(req.session.username);
    await db.deleteUser(req.session.username)
     console.log("User succesfully deleted")
     req.session.loggedIn = false;
     req.session.username = null; 
    res.send(true);
  } catch (err) {
    console.log(err);
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

app.get("/isadmin", async (req, res) => {
  const result = await db.isAdmin(req.session.username);
  if (result) {
    res.send(true);
  } else if(!result) {
    res.send(false);
  } else {
    console.log("something went wrong")
  }
});

app.get("/numberofposts", async (req, res) => {
  try {
    const result = await db1.numberOfPosts();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.get("/postamountanduser", async (req, res) => {
  try {
    const result = await db1.postAmountWithUser();
    let arr = Object.values(result.recordsets[0][0]);
    console.log(arr[1])
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});