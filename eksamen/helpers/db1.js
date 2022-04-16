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
  async createPost(username,price,description,category,postalcode,picture
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
      let postalcodeInt = Number(postalcode)

      //tjekker om postalcode eksiterer i databasen, hvis ikke laves et ny postalcode med ID i databasen
      var locationQuery =
        await sql.query`select location_id from location where postalcode=${postalcodeInt}`;
      if (locationQuery.rowsAffected == 0) {
        let newLocationQuery = await sql.query`INSERT INTO location (postalcode) values (${postalcodeInt})`;
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

  // SLET POST
  async deletePost(post_id) {
    try {
      // make sure that any items are correctly URL encoded in the connection string
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      const result =
        await sql.query`select * from post where post_id = ${post_id}`;

      //Tjekker om der er fundet noget i DB, hvis ikke returnere den, da 0 rowsaffected betyder intet fundet
      if (result.rowsAffected == 0) {
        console.dir("Post does not exist");
        sql.close();
        return true;
      } else {
        await sql.query`DELETE FROM post WHERE post_id = ${post_id}`;
        console.dir("Post deleted");
        sql.close();
        return false;
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  //OPDATER POST
  //Virker ikke

  //BUG - UPDATE SQL QUERY virker åbenbart ikke ordentlig, kan godt opdatere en værdi, men ikke flere på en gang
  async updatePost(post_id, price, description, category_id, picture) {
    try {
      // make sure that any items are correctly URL encoded in the connection string
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      const result =
        await sql.query`select * from post where post_id = ${post_id}`;

      //Tjekker om der er fundet noget i DB, hvis ikke returnere den, da 0 rowsaffected betyder intet fundet
      if (result.rowsAffected == 0) {
        console.dir(
          "Unable to update post, because post id is incorrect or post does not exist"
        );
        sql.close();
        return true;
      } else {
        await sql.query`UPDATE post SET price = ${price}, description = ${description}, category_id = ${category_id}, picture = ${picture} WHERE post_id = ${post_id}`;
        console.dir("Post Updated");
        sql.close();
        return false;
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
        await sql.query`select b.email, c.postalcode, d.category_name, a.created_at, a.price, a.description, a.picture, b.status_id from post as a join [User] as b on a.user_id = b.user_id join location as c on c.location_id = a.location_id join Category as d on d.category_Id = a.category_Id join User_status as e on b.status_id = e.status_id order by b.status_id asc`;
      console.log("All posts have been found");
      console.log(result);
      return result;
    } catch (err) {
      console.dir(err);
      return;
    }
  }

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
      console.log(result)
      
      return result;
    } catch (err) {
      console.dir(err);
      return;
    }
  }
}
// exporter DB så fs metoderne kan bruges i andre sammenhæng
module.exports = new postDB();

