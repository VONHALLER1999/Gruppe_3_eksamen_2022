//SQL connection 
//Sat op med mssql
const sql = require('mssql');



class DB {

  async openDatabase() {
    try {
     await sql.connect('Server=examcbs.database.windows.net,1433;Database=thegreenpaper;User Id=vilgro;Password=Ve1lpm2b;?encrypt=true')
    }catch(err) {
      console.dir(err)
   }
  }
  // LAV BRUGER
  async createUser(email, password) {
    try {
      const result = await this.findUser(email);
      //brugeren for får en email og password, samt status koden 0 som betyder at brugeren er ikke guld status. 
      if (result == true) {
        await sql.query`INSERT INTO [User](email,psw,status_id) values(${email}, ${password}, 0)`
        console.dir("User was created");
        //sql.close()
        return true;
      }else{
        console.dir("User already exists");
        //sql.close();
        return false;
      }
    }catch(err) {
      console.log(err)
    }
  }

  // LOGIN DB 
  async findUser(userEmail) {
    try {
      // make sure that any items are correctly URL encoded in the connection string
      await this.openDatabase();
      console.dir("Connected to SQL Server");
      const result = await sql.query`select * from [User] where email = ${userEmail}`;

      //Tjekker om der er fundet noget i DB, hvis ikke returnere den, da 0 rowsaffected betyder intet fundet
      if (result.rowsAffected == 0) {
          console.dir ("User not found");
          //sql.close();
          return true;
      }else {
        console.dir("User found");
        return result;
        
      }/*
      //Hvis noget er fundet tjekker vi nu om kodeord og password matcher db info
      if(result.recordset[0].email == userEmail){
          console.dir("User Found");
          return result;
      }*/
      //Error handling
      } catch(err) {
          console.log(err);
          return;
      }
  }


//Login funktion gemt i DB Klasse
async loginUser(email, password){
  try {
      //Tjekker om der er fundet noget i DB, hvis ikke returnere den "true"
      const result = await this.findUser(email);

      if (result == true) {
          console.dir ("User not found");
          sql.close();
          return true;
      }
      //Hvis noget er fundet tjekker vi nu om kodeord og password matcher db info
      if(result.recordset[0].email == email && result.recordset[0].psw == password){
          console.dir("User logged in successfully");
          //req.session.loggedin = true;
          sql.close();
          return true;
      }else {
          console.dir("Email or Password is incorrect");
          //sql.close();
          return;
      }
      //Error handling
      } catch(err) {
          console.log(err);
          return;
      }
  }


  async deleteUser(email, password){
    try {
        //Tjekker om der er fundet noget i DB, hvis ikke returnere den "true"
        const result = await this.findUser(email);
  
        if (result == true) {
            console.dir ("User not found");
            sql.close();
            return true;
        }
        //Hvis noget er fundet tjekker vi nu om kodeord og password matcher db info
        if(result.recordset[0].email == email && result.recordset[0].psw == password){
            await sql.query`DELETE FROM [User] WHERE email = ${email} AND psw = ${password}`
            console.dir("User succesfully deleted");
            //req.session.loggedin = true;
            sql.close();
            return true;
        }else {
            console.dir("Email or Password is incorrect");
            //sql.close();
            return;
        }
        //Error handling
        } catch(err) {
            console.log(err);
            return;
        }
    }


    async updateUser(email, password, newEmail, newPassword){
      try {
          //Tjekker om der er fundet noget i DB, hvis ikke returnere den "true"
          const result = await this.findUser(email);
    
          if (result == true) {
              console.dir ("User not found");
              sql.close();
              return true;
          }
          //Hvis noget er fundet tjekker vi nu om kodeord og password matcher db info
          if(result.recordset[0].email == email && result.recordset[0].psw == password){
              await sql.query`DELETE FROM [User] WHERE email = ${email} AND psw = ${password}`
              console.dir("User succesfully deleted");
              //req.session.loggedin = true;
              sql.close();
              return true;
          }else {
              console.dir("Email or Password is incorrect");
              //sql.close();
              return;
          }
          //Error handling
          } catch(err) {
              console.log(err);
              return;
          }
      }
  
}
// exporter DB så fs metoderne kan bruges i andre sammenhæng
module.exports = new DB();

