//SQL connection 
//Sat op med mssql
const sql = require('mssql');

class postDB {
  async openDatabase() {
    try {
      await sql.connect(
        "Server=examcbs.database.windows.net,1433;Database=thegreenpaper;User Id=vilgro;Password=Ve1lpm2b;?encrypt=true"
      );
    } catch (err) {
      console.dir(err);
    }
  }

  // LAV POST
  //MANGLER FUNKTIONALITET TIL BILLEDE
  async createPost(
    username,
    price,
    description,
    category,
    postalcode,
    picture
  ) {
    try {
      await this.openDatabase();

      //henter brugeren user_id ved at finde det user_id der matcher med hans email gennem sgl
      const userQuery = await sql.query`select user_id from [User]
        where email= ${username}`;
      const user_id = userQuery.recordset[0].user_id;

      //henter kategoriens id ved at finde det id der matcher med kategorinavnet gennem sgl
      const categoryquery =
        await sql.query`SELECT category_id FROM Category WHERE category_name=${category}`;
      const category_id = categoryquery.recordset[0].category_id;

      //parser input price til et int, så det kan bruges til at lave et opslag
      let priceInt = Number(price);

      //parser input postalcode til et int, så det kan bruges i en SQL query
      let postalcodeInt = Number(postalcode);

      //tjekker om postalcode eksiterer i databasen, hvis ikke laves et ny postalcode med ID i databasen
      var locationQuery =
        await sql.query`select location_id from location where postalcode=${postalcodeInt}`;
      if (locationQuery.rowsAffected == 0) {
        let newLocationQuery =
          await sql.query`INSERT INTO location (postalcode) values (${postalcodeInt})`;
        console.log(newLocationQuery);
        //henter det nye ID som matcher postnummeret fra databasen
        locationQuery =
          await sql.query`select location_id from location where postalcode=${postalcodeInt}`;
      }

      //trækker location_id værdien ud af overstående SQL query
      let location_id = locationQuery.recordset[0].location_id;

      //laver en ny annonce med alle de nødvendige værdier
      const newPost =
        await sql.query`insert into post (user_id, price, description, category_Id, location_id, picture) 
      VALUES (${user_id}, ${priceInt}, ${description}, ${category_id}, ${location_id}, ${picture})`;
      console.dir("Post succesfully created");

      return newPost;
    } catch (err) {
      console.log(err);
    }
  }

  //VIRKER IKKE DATABASE UNDEFIND DONT KNOW...
  async deleteUserPost(post_id, user) {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");

      const result = await sql.query`select a.price from post as a
      join [User] as b
      on a.user_id = b.user_id
      where b.email = ${user} and a.post_id = ${post_id}`;
      console.dir(result);

      //Tjekker om der er fundet noget i DB, hvis ikke returnere den, da 0 rowsaffected betyder intet fundet
      if (result.rowsAffected == 0) {
        console.dir("Post does not exist");

        return false;
      } else if (result.rowsAffected == 1) {
        //await sql.query`DELETE FROM post WHERE post_id = ${post_id}`;
        console.dir("Post deleted");

        return true;
      } else {
      }
    } catch (err) {
      console.dir(err);
      return;
    }
  }

  //OPDATER POST
  //Virker ikke
  //BUG - UPDATE SQL QUERY virker åbenbart ikke ordentlig, kan godt opdatere en værdi, men ikke flere på en gang
  async updatePost(post_id, price, description, categoryname, picture, postnummer, username) {
    try {
      // make sure that any items are correctly URL encoded in the connection string
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      
      //Tjekker om brugeren ejer annoncen
      const result = await sql.query`
      select a.post_id, b.user_id
      from post as a
      join [User] as b
      on a.user_id = b.user_id
      where a.post_id = ${post_id} and b.email = ${username}`;

      //Hvis brugeren enten ikke ejer annoncen eller post_id'et er forkert returners false
      if (result.rowsAffected == 0) {
        console.dir(
          "Unable to update post, because post id is incorrect or post does not exist"
        );
        
        return false;
      } else {
        //opdaterer anonncen med de nye input og retunerer true 
        await sql.query`UPDATE post
        SET price = ${price}, description = ${description},
        category_id = b.category_Id,
        picture = ${picture},
        location_id =  c.location_id
        from post as a
        join Category as b
        on category_name = ${categoryname}
        join location as c
        on c.postalcode = ${postnummer}
        WHERE post_id = ${post_id};`;
        console.dir("Post Updated");

        return true;
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  //SE ALLE OPSLAG
  //Indeholder både location_id og category_id som er foreign keys og sorterer efter guld status
  async allPosts() {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");

      const result =
        await sql.query`select b.email, c.postalcode, d.category_name, a.created_at, a.price, a.description, a.picture, b.status_id, a.post_id from post as a join [User] as b on a.user_id = b.user_id join location as c on c.location_id = a.location_id join Category as d on d.category_Id = a.category_Id join User_status as e on b.status_id = e.status_id order by b.status_id asc`;
      console.log("All posts have been found");
      return result;
    } catch (err) {
      console.dir(err);
      return;
    }
  }

  //funktion der henter alle annoncer med en givne category
  async PostByCategory(category) {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      const result =
        await sql.query`select b.email, c.postalcode, d.category_name, a.created_at, a.price, a.description, a.picture, b.status_id
        from post as a
        join [User] as b
        on a.user_id = b.user_id
        join location as c
        on c.location_id = a.location_id
        join Category as d
        on d.category_Id = a.category_Id
        join User_status as e
        on b.status_id = e.status_id
        where d.category_name = ${category}
        order by b.status_id desc`;
      console.log(`All posts with the category: ${category} been found`);
      return result;
    } catch (err) {
      console.dir(err);
      return;
    }
  }

  //Funktionen der retunerer antal af anonncer i databasen
  async numberOfPosts() {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      const result = await sql.query`select count(post_id)
      from [dbo].[post]`;
      console.log("Number of posts found");
      let numberOfPosts = Object.values(result.recordsets[0][0]);
      console.log(numberOfPosts);
      return numberOfPosts;
    } catch (err) {
      console.dir(err);
      return;
    }
  }

  async postAmountWithUser() {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      const result = await sql.query`
      select a.email, count(b.post_id)
      from [User] as a
      join post as b
      on a.user_id = b.user_id
      group by a.email`;
      console.log("post amount for each user found");
      console.log(result);

      return result;
    } catch (err) {
      console.dir(err);
      return;
    }
  }

  async allUsersPosts(username) {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      const result =
        await sql.query`select a.post_id, c.postalcode, d.category_name, a.created_at, a.price, a.description, a.picture
        from post as a
        join [User] as b
        on a.user_id = b.user_id
        join location as c
        on c.location_id = a.location_id
        join Category as d
        on d.category_Id = a.category_Id
        join User_status as e
        on b.status_id = e.status_id
        where b.email = ${username}
        order by created_at desc`;
      console.log("All posts have been found");
      return result;
    } catch (err) {
      console.dir(err);
      return;
    }
  }
  async deletePost(post_id, user) {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      //tjekker om brugeren ejer den pågældende post
      const result =
        await sql.query`select a.price from post as a join[User] as b on a.user_id = b.user_id where b.email = ${user} and a.post_id = ${post_id}`;

      //hvis brugeren ejer annoncen slettes den
      if (result.rowsAffected == 1) {
        await sql.query`DELETE FROM post where post_id = ${post_id}`;
        console.dir(`post with ID: ${post_id}" + " is deleted`);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.dir(err);
      return;
    }
  }

  //BURDE BLIVE FLYTTET TIL DB OG IKKE DB1
  async allUsers() {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      const result = await sql.query`select email,user_id from [User]`;
      console.log("all users found");
      let numberOfPosts = Object.values(result.recordsets[0][0]);
      console.log(numberOfPosts);
      return result;
    } catch (err) {
      console.dir(err);
      return;
    }
  }

  //FØLG ANNONCE
  //hent bruger id og  post id
  //derefter indsæt det i followed table
  async followPost(userEmail, post_id) {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");

      //tjek om brugeren allerede følger det givne post
      const result = await sql.query`select * from Followed
      join [User] U on Followed.user_id = U.user_id
      where email = ${userEmail} and post_id = ${post_id}`;
      console.dir("Checking if user is already follows that post");

      //hvis brugeren allerede følger post retuneres false, hvis ikke indsættes brugerens id og annoncens id i followed i databasen
      if (result.rowsAffected == 1) {
        console.dir("User does allready follow that post");
        return false;
      } else {
        const user_id =
          await sql.query`select user_id from [User] where email = ${userEmail} `;
        //let user_id = result.recordset[0].user_id;
        await sql.query`insert into Followed (user_id, post_id) VALUES (${user_id.recordset[0].user_id},${post_id})`;
        console.dir("User follows post now");
        return true;
      }
    } catch (err) {
      console.dir(err);
    }
  }

  //HENT FOLLOWED
  //skal returnerer alle post som brugeren følger
  //tager bruger emailen og søger på
  async showFollowedPosts(userEmail) {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");

      //henter alle post som brugeren følger
      const result =
        await sql.query`select f.email, d.postalcode, e.category_name, c.created_at, c.price, c.description,  c.picture, a.post_id
        from Followed as a
        join [User] as b
        on a.user_id = b.user_id
        join post c on a.post_id = c.post_id
        join Category as e on e.category_Id = c.category_Id
        join location as d on d.location_id = c.location_id
        join [User] as f on f.user_id = c.user_id
        where b.email =${userEmail}`;
      console.dir("all post that: " + userEmail + " follows found");
      return result;
    } catch (err) {
      console.dir(err);
    }
  }

  async unFollow(userEmail,post_id) {
    try {
      await this.openDatabase();
      console.dir("Connected to SQL Server");

      //henter alle post som brugeren følger
      await sql.query`delete Followed
      from Followed
      join [User]
      on [User].user_id = Followed.user_id
      where post_id = ${post_id} and  [User].email =${userEmail}`;
      console.dir("all post that: " + userEmail + " follows found");
      return true;
    } catch (err) {
      console.dir(err);
    }
  }
}
// exporter DB så fs metoderne kan bruges i andre sammenhæng
module.exports = new postDB();

