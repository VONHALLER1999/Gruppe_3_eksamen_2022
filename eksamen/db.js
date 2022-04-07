//SQL connection 
//Sat op med mssql
const sql = require('mssql');
/*
async function call(){
  try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect('Server=cbs1.database.windows.net,1433;Database=First;User Id=anton;Password=NiMiAn@98a;?encrypt=true')
      const result = await sql.query`select Country_id From dbo.Menu`
      console.dir(result);
      //console.log(result.rowsAffected == 0);
      console.log("Connected to SQL Server")
  } catch (err) {
      console.log(err);
  }
}
call();

*/

class DB {

  /*
  constructor() {
    this.users = this.openFile(USER_FILE);
  }

  */

 
  // LOGIN DB 
  async findUser(email) {
    try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect('Server=cbs1.database.windows.net,1433;Database=First;User Id=anton;Password=NiMiAn@98a;?encrypt=true')
      console.dir("Connected to SQL Server");
      const result = await sql.query`select * from sales.customers where first_name = ${email}`;
      //console.dir(result.recordset[0].first_name);
      //console.dir(result)
      //Tjekker om der er fundet noget i DB, hvis ikke returnere den, da 0 rowsaffected betyder intet fundet
      if (result.rowsAffected == 0) {
          console.dir ("User not found");
          sql.close();
          return;
      }
      //Hvis noget er fundet tjekker vi nu om kodeord og password matcher db info
      if(result.recordset[0].first_name == email){
          console.dir("User Found");
          sql.close();
          return;
      }
      //Error handling
      } catch(err) {
          console.log(err);
          return;
      }
  }

//Login funktion gemt i DB Klasse

async loginUser(email, password){
  try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect('Server=cbs1.database.windows.net,1433;Database=First;User Id=anton;Password=NiMiAn@98a;?encrypt=true')
      console.dir("Connected to SQL Server");

      const result = await sql.query`select * from sales.customers where first_name = ${email}`;
      //console.dir(result.recordset[0].first_name);
      //console.dir(result)
      //Tjekker om der er fundet noget i DB, hvis ikke returnere den, da 0 rowsaffected betyder intet fundet
      if (result.rowsAffected == 0) {
          console.dir ("User not found");
          sql.close();
          return;
      }

      //Hvis noget er fundet tjekker vi nu om kodeord og password matcher db info
      if(result.recordset[0].first_name == email && result.recordset[0].last_name == password){
          console.dir("User logged in successfully");
          sql.close();
          return;
      }else {
          console.dir("Email or Password is incorrect");
          sql.close();
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

