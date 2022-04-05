//SQL connection 
//Sat op med mssql
const sql = require('mssql');

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


const ABSOLUTE_PATH = __dirname + "/../data";
const USER_FILE = "/users.json";

class DB {
  constructor() {
    this.users = this.openFile(USER_FILE);
  }
  // CORE 
  // Save file
  saveFile(fileName, contentString) {
    fs.writeFileSync(ABSOLUTE_PATH + fileName, contentString);
  }

  // Open file
  openDb(email) {
      const result = await sql.query`select * From User where name = ${email}`
      return result;
  }

  // LOGIN DB 
  saveUser(user) {
    this.users.push(user);
    this.saveFile(USER_FILE, JSON.stringify(this.users));
  }

  deleteUser(user) {
    this.users = this.users.filter((x) => x.email != user.email);
    this.saveFile(USER_FILE, JSON.stringify(this.users));
  }

  findUser(email) {
    const result = await sql.query`select * From User where name = ${email}`
    if(result.rowsAffected == 0){
        console.log("User not created");
    }else{
        return result;
        }
  }

  loginUser(email, password){
      var user = {
          email: user.email,
          password: user.password
      }
      if (user.email == result.Email && user.password == result.Password){
          console.log("User logged in")
      }else{
          console.log("Wrong password")
      }
  }

  
}

// exporter DB så fs metoderne kan bruges i andre sammenhæng
module.exports = new DB();

