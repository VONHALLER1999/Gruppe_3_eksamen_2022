//npm install tedious
var Connection = require("tedious").Connection;

//vi henter metoden Request, for at lave requests til sql server
var Request = require("tedious").Request;


//vi henter config filen
const config = require("./config.json");

//vi sætter Connect og config sammen
var connection = new Connection(config);

//callback function som bliver triggered på err
connection.on("connect", function(err){
    if (err){
        console.log(err)
    } else {
        console.log("connected");
        const response = executeSQL();
        console.log(response)
    }
});

//vi kalder function, som trigger .on function
connection.connect();