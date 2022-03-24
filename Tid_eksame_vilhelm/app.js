// dette er en test
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = 8080;
const db = require("./helper/db");
const vdb = require("./helper/vdb");
const app = express();
const store = require("store2");

//Make sure the server is running and is live on the port
app.listen(PORT, () => console.log(`Server lytter på port ${PORT}`));

//middleware der parser request fra klienten så der kan bruges req.body her i serveren uden ekstra kode
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, "./public")));

//Sørger for at der ikke ligger nogle brugere i localstorage ved opstart af server
store(false);
console.log("Der er ingen brugere loggd in: " + store("User"));

//hvis brugeren er logget ind (ligger i store) sender dette endpoint et true. Bruges i sammenhæng med SendToHome.js og SendToIndex.js, som enten sender brugen enten til home eller til index
app.get("/localstoragestatus", async (req, res) => {
  if (store.has("User")) {
    res.send(true);
  } else {
    res.send(false);
  }
});

//registerer brugeren
app.post("/signup", async (req, res) => {
  try {
    let newUser = {
      email: req.body.email,
      password: req.body.password,
    };

    const foundUser = db.findUser(newUser);

    if (!foundUser) {
      db.saveUser(newUser);

      res.send(
        "<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>"
      );
    } else {
      res.send(
        "<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./signup.html'>Register again</a></div>"
      );
    }
  } catch {
    res.send("Internal server error");
  }
});

//logger brugeren in
app.post("/login", async (req, res) => {
  //værdier sendt fra klienten bruges i et objekt
  var User = {
    email: req.body.email,
    password: req.body.password,
  };

  console.log(User);
  const foundUser = db.findUser(User);
  
  // hvis profilen findes i bruger databasen tjekkes der om brugeren har angivet den rigtige adgangskode til profilen
  if (foundUser) {
    let submittedPass = req.body.password;
    let storedPass = foundUser.password;

    const passwordMatch = submittedPass === storedPass;

    // hvis adgangskoden passer sættes profilen i localstorage og brugeren bliver sendt til hjemmesiden
    if (passwordMatch) {
      store.set("User", User.email);
      console.log("brugeren: ", store("User"), "er logget ind");

      res.sendFile(__dirname + "/public/home.html");
    } else {
      res.send(
        "<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>"
      );
    }
  } else {
    res.send(
      "<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>"
    );
  }
});

//opretter et nyt opslag
app.post("/opretopslag", async (req, res) => {
  try {
    //værdier sendt fra klienten bruges i et objekt
    let NytOpslag = {
      id: Date.now(),
      email: store("User"),
      kategori: req.body.kategori,
      pris: req.body.pris,
      billede: req.body.billede,
    };
    console.log(NytOpslag);
    
    //objektet gemmes i varedatabasen som ny vare og brugeren sendes til home
    vdb.saveVare(NytOpslag);
    res.sendFile(__dirname + "/public/home.html");
  } catch {
    res.send("Internal server error");
  }
});

//logger brugen ud
app.post("/logud", async (req, res) => {
  try {
    //sletter profil fra localstorage
    store(false);
    console.log("brugeren er logget ud", store());

    //sender brugeren til forsiden
    res.sendFile(__dirname + "/public/index.html");
  } catch {
    //hvis noget går galt
    res.send("Internal server error");
  }
});

//Opdaterer brugeren
app.post("/opdaterprofil", async (req, res) => {
  try {
    let oldUser = {
      email: store("User"),
    };

    console.log("should say true: " + store(oldUser));

    foundEmail = db.findUser(oldUser);

    if (foundEmail) {
      db.deleteUser(foundEmail);

      let opdatedUser = {
        email: store("User"),
        password: req.body.password,
      };
      console.log(opdatedUser);

      db.saveUser(opdatedUser);

      res.sendFile(__dirname + "/public/home.html");
    }
  } catch {
    res.send("Internal server error");
  }
});

//sletter brugeren
app.post("/sletprofil", async (req, res) => {
  try {
    let User = {
      email: store("User"),
    };

    console.log(store(User));

    foundUser = db.findUser(User);

    if (foundUser) {
      db.deleteUser(foundUser);
      store(false);
      console.log("brugeren blev slettet og localstorage er tomt: ", store());
      res.sendFile(__dirname + "/public/index.html");
    }
  } catch {
    res.send("Internal server error");
  }
});

//sletter et opsalg med et givne ID
app.post("/sletopslag", async (req, res) => {
  try {
    //får varens id fra frontend
    let opslag = {
      id: req.body.id,
    };

    //finder varen i vare databasen
    foundVare = vdb.findVare(opslag);

    // hvis varen fines i varedatabasen tjekkes der om varen tilhører profilen
    if (foundVare) {
      UserCurrentEmail = store("User");
      VareEmail = foundVare.email;

      //hvis id'et og profillen matcher slettets varen fra varedatabasen og brugeren sendes til hjemmesiden
      if (UserCurrentEmail == VareEmail) {
        vdb.deleteVare(foundVare);

        console.log("Varen blev slettet");
        res.sendFile(__dirname + "/public/home.html");
      } else {
        console.log("Det er ikke brugerens opslag");
        res.send(
          "<div align ='center'><h2>Du har ikke adgang til dette opslag</h2></div><br><br><div align ='center'><a href='./redigeropslag.html'>tilbage</a></div>"
        );
      }
    } else {
      console.log("vare kunne ikke findes");
      res.send(
        "<div align ='center'><h2>Opsalget findes ikke</h2></div><br><br><div align ='center'><a href='./redigeropslag.html'>tilbage</a></div>"
      );
    }
  } catch {
    res.send("Internal server error");
  }
});

//opdaterer en varer
app.post("/redigeropslag", async (req, res) => {
  try {
    //får varens id fra frontend
    let id = {
      id: req.body.id,
    };

    //finder varen i vare databasen
    foundVare = vdb.findVare(id);

    // hvis varen findes i varedatabasen tjekkes der om varen tilhører profilen
    if (foundVare) {
      UserCurrentEmail = store("User");
      VareEmail = foundVare.email;

      //hvis id'et og profillen matcher laves en ny vare med request elementerne, hvorefter den bliver gemt i varedatabasen og den fundne vare slettes.
      if (UserCurrentEmail == VareEmail) {
        let NytOpslag = {
          id: req.body.id,
          email: store("User"),
          kategori: req.body.kategori,
          pris: req.body.pris,
          billede: req.body.billede,
        };

        vdb.deleteVare(foundVare);
        vdb.saveVare(NytOpslag);

        res.send();
      } else {
        console.log("no email match");
      }
    } else {
      console.log("whups");
    }
  } catch {
    res.send("Internal server error");
  }
});

//Sender JSON med varer til endpoint /alleopsalg hvor den bliver brugt i opslag.js til at vise opslag efter kategori
app.get("/alleopslag", async (req, res) => {
  var alleopslag = vdb.openVare("/varer.json");
  res.send(alleopslag);
});

//viser alle opslag lavet af brugen der er logget ind
app.get("/allemineopslag", async (req, res) => {
  loggedInUser = {
    email: store("User"),
  };
  //finder brugerens opslag og sender dem til opslag.js med et response
  allemineopslag = vdb.findUser(loggedInUser);

  res.send(allemineopslag);
});

module.exports = app;
