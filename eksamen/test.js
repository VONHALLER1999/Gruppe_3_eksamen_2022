const { SSL_OP_NO_TLSv1_1 } = require('constants');
const db = require('./helpers/db.js');
const postDB = require('./helpers/db1.js');



//db.findUser("test@2");

//db.findUser("test@1")

//db.createUser("Anton", "Anton");


//db.findUser("1234@1234.dk", "1234")

//db.deleteUser("test@1", "test")


//db.updateUser("b@b", "hej", "test");

//brug ISO-8601 date format til at indsætte med opslag
//YYYY-MM-DDTHH:MM:SS
//db1.createPost("7", "7", "7", "test1", "2", "2022-04-08T00:00:00", "1", "test1")


//db1.allPosts();


//db1.deletePost("4");


//db1.updatePost("3", "6", "gg", "2", "test");

//postDB.numberOfPosts()
let username = 'test@1'

postDB.createPost(username, 100,'beskrivelse', 'stole', 2020,'billede her' )