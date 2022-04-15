//SQL connection 
//Sat op med mssql
const sql = require('mssql');



class DB {
  async openDatabase() {
    try {
      await sql.connect(
        "Server=examcbs.database.windows.net,1433;Database=thegreenpaper;User Id=vilgro;Password=Ve1lpm2b;?encrypt=true"
      );
    } catch (err) {
      console.dir(err);
    }
  }
  // LAV BRUGER
  async createUser(email, password) {
    try {
      const result = await this.findUser(email);
      //brugeren bliver lavet med en email og et password, samt status koden 0 som betyder at brugeren ikke er guld eller admin status status.
      if (!result) {
        await sql.query`INSERT INTO [User](email,psw,status_id) values(${email}, ${password}, 3)`;
        console.dir("User was created");
        //sql.close()
        return true;
      } else {
        console.dir("email already exists");
        //sql.close();

        //Videre udvikling her så man får en fejlbesked i frontend

        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  //Finder bruger i DB
  async findUser(userEmail) {
    try {
      // Henter data fra DB
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      const result =
        await sql.query`select * from [User] where email = ${userEmail}`;

      //Tjekker om der er fundet noget i DB, hvis ikke returnere den, da 0 rowsaffected betyder intet fundet
      if (result.rowsAffected == 0) {
        console.dir("User not found");
        //sql.close();
        return false;
      } else {
        console.dir("User found");
        return result;
      }
      //Error handling
    } catch (err) {
      console.log(err);
      return;
    }
  }

  //Login funktion
  async loginUser(email, password) {
    try {
      //Tjekker om der er fundet noget i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);

      if (!result) {
        console.dir("User not found");
        sql.close();
        return false;
      }
      //Hvis noget er fundet tjekker vi nu om kodeord og password matcher db info
      if (
        result.recordset[0].email == email &&
        result.recordset[0].psw == password
      ) {
        console.dir("Users email ann password is correct");
        //req.session.loggedin = true;
        sql.close();
        return true;
      } else {
        //hvis email findes men kodeordet ikke stemmer overens
        console.dir("Email or Password is incorrect");
        //sql.close();

        //Videre udvikling her så man får en fejlbesked i frontend

        return false;
      }
      //Error handling
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async deleteUser(email) {
    try {
      //Tjekker om der er fundet noget i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);

      if (!result) {
        console.dir("User not found");
        sql.close();
        return false;
      } else {
        await sql.query`DELETE FROM [User] WHERE email = ${email}`;
        console.dir("User succesfully deleted");
        //req.session.loggedin = true;
        sql.close();
        return true;
      }
      //Error handling
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async isAdmin(email) {
    try {
      //Tjekker om der er fundet noget i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);
      if (!result) {
        return false;
        //tjekker om den fundne bruger har admin rettigheder gennem deres status id i databasen
      } else if (result.recordset[0].status_id === 1) {
        console.dir("User is admin");
        //req.session.loggedin = true;
        sql.close();
        return true;
      } else {
        console.dir("User is not admin")
        return false;
      }
      //Error handling
    } catch (err) {
      console.log(err);
      return;
    }
  }
}
// exporter DB så metoderne kan bruges i andre sammenhæng
module.exports = new DB();

