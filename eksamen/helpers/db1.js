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
  async createPost(
    user_id,
    price,
    description,
    category_id,
    location_id,
    picture
  ) {
    try {
      await this.openDatabase();
      //await sql.query`SET IDENTITY_INSERT post ON`
      //Indsætter ikke post_id i opslaget
      const result =
        await sql.query`SET IDENTITY_INSERT post ON INSERT INTO post (user_id, price, description, category_id, location_id, picture) values( ${user_id}, ${price}, ${description}, ${category_id}, ${location_id}, ${picture})`;
      console.dir("Post succesfully created");

      //return false;
      console.dir(result);
      sql.close();
      return;
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

