//require express
const express = require("express");
const PORT = 1010;
const app = express();
const bodyParser = require("body-parser") 
const path = require("path");
const session = require("express-session");

const db = require("./helpers/db.js");  //User related  
const db1 = require("./helpers/db1.js");  //Post related

//makes sure that the server is up and running
app.listen(PORT, () => console.log(`Server lytter på port ${PORT}`));

//sørger for at 
app.use(express.static(path.join(__dirname, "./public")));

app.use(express.json());

//middleware der parser request fra klienten så der kan bruges req.body her i serveren uden ekstra kode
app.use(bodyParser.urlencoded({limit:'mb', extended: false }));



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
    const result = await db1.allPosts();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});


app.post("/postcategory", async (req, res) => {
  try {
    console.log("button for posts with category: " + req.body.category + " clicked");
    const result = await db1.PostByCategory(req.body.kategori);
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

app.post("/admindeleteuser", async (req, res) => {
  try {
    console.log(req.body.email);
    await db.deleteUser(req.body.email);
    console.log("User succesfully deleted");
    
    res.send(true);
  } catch (err) {
    console.log(err);
  }
});

app.post("/makegold", async (req, res) => {
  try {
    console.log(req.body.email);
    await db.makeGold(req.body.email);
    console.log("User succesfully made gold");
    res.send(true);
  } catch (err) {
    console.log(err);
  }
});

//MANGLER FUNKTION HVIS KODEORD ER FORKERT
app.post("/updateuser", async (req, res) => {
  try {
      const result = await db.updateUser(
        req.session.username,
        req.body.password,
        req.body.newPassword
      );
   if (!result) {
     console.log("kodeord er forkert");
     res.send(false);
   } else {
     console.log("User succesfully updated")
     res.sendFile(__dirname + "/public/updateuser.html");
   }
  }catch (err){
   console.log(err)
  }
 });

app.post("/adminupdateuser", async (req, res) => {
   try {
     console.log(req.body.email, req.body.password);
     const result = await db.adminUpdateUser(
       req.body.email,
       req.body.password
     );

     if (!result) {
       console.log("noget gik galt");
       res.send(false);
     } else {
       console.log("User succesfully updated");
       res.send(true)
     }
   } catch (err) {
     console.log(err);
   }
 });

app.get("/logout", (req, res) => {
  try {
    req.session.loggedIn = false;
    req.session.username = null;
    console.log("User logged out")
    res.send(true)
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(400)
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

app.get("/opslag", async (req, res) => {
  try {
    if(req.loggedIn) {
      res.sendFile(__dirname + "/public/opslag.html");
    } else {
      res.sendFile(__dirname + "/public/index.html");
    }
  }catch (err) {
    console.log(err)
  }

})

app.post("/opretopslag", async (req, res) => {
  console.log("trying to go to opslag")
  try {
    db1.createPost(
      req.session.username,
      req.body.pris,
      req.body.descripton,
      req.body.kategori,
      req.body.postalcode,
      req.body.billede
    );
    res.send(true)
   
  } catch (err) {
    console.log(err)
  }
})

//Sender JSON med alle opslag til endpointet hvor den bliver fetched i opslag.js og herefter sat på index.html
app.get("/allusersposts", async (req, res) => {
  try {
    console.log("Showing the users post");
    const result = await db1.allUsersPosts(req.session.username);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.post("/deletepost", async (req, res) => {
  try {
    console.log("clicked deleted on post_id: " + req.body.post_id);
   
    const result = await db1.deletePost(req.body.post_id, req.session.username)
    console.log(result)
    if (result) {
      res.send(result);
    } else {
      console.log("something went wrong, User does not own post")
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await db1.allUsers();
    let arr = Object.values(result.recordsets[0][0]);
    console.log(arr[1]);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.post("/followpost", async (req, res) => {
    try {

      console.log("User pressed followed")
      if (req.session.loggedIn == true) {
          
          const result = await db1.followPost(req.session.username, req.body.post_id);

          res.send(result);
      } else {
        res.send(false)
      }
    } catch (err) {
      console.log(err);
    }
});


app.get("/usersfollowpost", async (req, res) => {
  try {
    console.log("Showing Users followed post");
    const result = await db1.showFollowedPosts(req.session.username);
    res.send(result)
  } catch (err) {
    console.log(err);
  }
});

app.post("/unfollow", async (req, res) => {
  try {
    console.log("Unfollow post id: " + req.body.post_id);
    const result = await db1.unFollow(req.session.username,req.body.post_id);
    console.log(result) 
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.get("/updatepost", async (req, res) => {
  try {
    if(req.session.loggedIn) {
      res.sendFile(__dirname + '/public/updatepost.html')
    } else {
      res.sendFile(__dirname + "/public/index.html");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/updatepost", async (req, res) => {
  try {
    const result = await db1.updatePost(
      req.body.post_id,
      req.body.pris,
      req.body.descripton,
      req.body.kategori,
      "req.body.picture",
      req.body.postalcode,
      req.session.username
    );
    console.log(
      req.body.post_id,
      req.body.pris,
      req.body.descripton,
      req.body.kategori,
      "req.body.picture",
      req.body.postalcode,
      req.session.username
    );
  } catch (err) {
    console.log(err);
  }
});

module.exports = app; 
