const db = require('./helpers/db.js');
const db1 = require('./helpers/db1.js');



//db.findUser("Antn");

//db.findUser("test@1")

//db.createUser("Anton", "Anton");


//db.findUser("1234@1234.dk", "1234")

//db.deleteUser("test@1", "test")




//brug ISO-8601 date format til at indsætte med opslag
//YYYY-MM-DDTHH:MM:SS
//db1.createPost("7", "7", "7", "test1", "2", "2022-04-08T00:00:00", "1", "test1")


db1.allPosts();


//db1.deletePost("4");


//db1.updatePost("3", "6", "gg", "2", "test");

db1.postStats()