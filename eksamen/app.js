//require express
const express = require("express");
const PORT = 1010;
const app = express();
const bodyParser = require("body-parser") 
const path = require("path");
const session = require('express-session'); 

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

//SQL connection 
//npm install tedious
var Connection = require("tedious").Connection;

//vi henter metoden Request, for at lave requests til sql server
var Request = require("tedious").Request;


//vi henter config filen
const config = require("./config.json");
const { response } = require("./config.json");

//vi sætter Connect og config sammen
var connection = new Connection(config);

//callback function som bliver triggered på err
connection.on("connect", function(err){
    if (err){
        console.log(err)
    } else {
        console.log("connected to azure sql server");
        const response = executeSQL();
        console.log(response)
    }
});

//vi kalder function, som trigger .on function
connection.connect();

//gå til login.html før index.html, såfremt der ikke er logged ind på en bruger                     
app.get('/', function(req, res) {
  if (req.session.loggedIn) {
    res.sendFile(__dirname + '/public/index.html');
  } else {
    res.sendFile(__dirname + '/public/login.html');
  }
});

function executeSQL(){

    //Query her
    request = new Request("select * from category", function (err) {
      if (err) {
        console.log(err);
      }
    });

    connection.execSql(request)
    var counter = 1
    SGLresponse = {}
    request.on('row', function(columns){
        SGLresponse[counter] = {}
        columns.forEach(function(column){
            SGLresponse[counter][column.metadata.colName] = column.value
        });
        counter += 1
    });
    return SGLresponse
};

//when signup on the signup page is clicked on the client side the server will receive the data from the client and save it to the database
app.post("/signup", async (req, res) => {
  try {
    request = new Request("", function (err) {
      if (err) {
        console.log(err);
      }
    });

} catch {
    console.log("noget gik galt");
  }
});