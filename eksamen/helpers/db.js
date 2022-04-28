//Sat op med mssql
const sql = require('mssql');


//Class 
class DB {
  //Etablerer en forbindelse til databasen med MS SGL
  async openDatabase() {
    try {
      //Bruger confiq 
      await sql.connect(
        "Server=examcbs.database.windows.net,1433;Database=thegreenpaper;User Id=vilgro;Password=Ve1lpm2b;?encrypt=true"
      );
      console.dir("Connected to SQL Server");
    } catch (err) {
      console.dir(err);
    }
  }

  //husk at bruge await 
  async funktionnavn(){
    try {

      await sql.query`Query her`;

    }catch{

    }
  }

  //BRUGER FINDER FUNKTION
  //Tager 1 input (useremail) og tjekker om brugeren findes i vores database
  async findUser(userEmail) {
    try {
      //Åbner en forbindelse til databasen
      await this.openDatabase();
      
      //Leder efter en bruger der svarer til input
      const result =
        await sql.query`select * from [User] where email = ${userEmail}`;

      //Tjekker om der er fundet noget i DB, hvis ikke returnere den false, da 0 rowsaffected betyder intet fundet
      if (result.rowsAffected == 0) {
        console.dir("User not found");

        return false;

      //Hvis brugeren findes returner funktionen resultatet af linje 32 
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

  // LAV BRUGER FUNKTION
  // Tager 2 inputs (email og adgangskode). Email bruges først til at finde ud af om vores bruger i for vejen eksiterer i databasen. Hvis ikke, opretter den en bruger med de 2 inputs og et status på 3 svarende til standard bruger uden nogle særlige rettigheder.
  async createUser(email, password) {
    try {
      //Tjekker om brugeren er fundet i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);

      //brugeren bliver lavet med en email og et password, samt status koden 3 som betyder at brugeren ikke er guld eller admin status status.
      if (!result) {
        await sql.query`INSERT INTO [User](email,psw,status_id) values(${email}, ${password}, 3)`;
        console.dir("User was created");

        //retunerer true som bruges af vores api til at bekræfte at en bruger blev oprettet
        return true;
      } else {
        console.dir("email already exists");

        //retunerer false som bruges af vores api til at afkræfte at en bruger blev oprettet
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  //LOGIN FUNKTION
  //Tager 2 inputs som 
  async loginUser(email, password) {
    try {
      //Tjekker om brugeren er fundet i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);

      //hvis overstående er false retunerer loginUser false
      if (!result) {
        console.dir("User not found");
        return false;
      }
      //Hvis en bruger er fundet tjekker den om kodeord og password matcher i DB. Hvis et match findes retuneres true
      if (result.recordset[0].email == email && result.recordset[0].psw == password) {
        console.dir("Users email ann password is correct");
        return true;

        //Hvis email findes men kodeordet ikke stemmer overens retuneres false
      } else {
        console.dir("Email or Password is incorrect");
        return false;
      }
      //Error handling
    } catch (err) {
      console.log(err);
      return;
    }
  }
  
  //DELETE BRUGER FUNKTION
  //Tager 1 input (email)
  async deleteUser(email) {
    try {
      //Tjekker om brugeren er fundet i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);

      //Hvis findUser = false retunerer hele funktionen false
      if (!result) {
        console.dir("User not found");
        return false;
        //Hvis brugeren bliver fundet slettes først alle annoncer associeret med brugeren og derefter selve brugeren
      } else {
        //SQL: Joiner Post tabel med User tabel så vi kan bruge brugerens email som condition i vores sletningen
        await sql.query`delete post from post as a
        join [User] as b
        on a.user_id = b.user_id
        where b.email = ${email}`;

        //SQL: Sletter kolonne i Post tabel hvor brugerens email er
        await sql.query`DELETE FROM [User] WHERE email = ${email}`;
        console.dir("User succesfully deleted");

        //retunerer true
        return true;
      }
      //Error handling
    } catch (err) {
      console.log(err);
      return;
    }
  }

  //ER ADMIN FUNKTION
  //Tager 1 input som er med til at afgøre om brugeren har admin rettigheder eller ej.
  async isAdmin(email) {
    try {

      //Tjekker om brugeren er fundet i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);
      if (!result) {
        return false;

        //tjekker om den fundne bruger har admin rettigheder gennem deres status id i databasen. Hvis brugeren har admin rettigheder retuneres true, hvis ikke retuneres false
      } else if (result.recordset[0].status_id === 1) {
        console.dir("User is admin");
        return true;
      } else {
        console.dir("User is not admin");
        return false;
      }
      //Error handling
    } catch (err) {
      console.log(err);
      return;
    }
  }

  //STANDARD BRUGERENS OPDATERING AF BRUGER FUNKTION
  //Tager 3 inputs (email, kodeord og det nye kodeord). Hvis de første 2 inputs stemmer overens i databasen, opdateres kodeordet hos brugeren med det nye kodeord
  async updateUser(email, password, newPassword) {
    try {
      //Tjekker om brugeren er fundet i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);
      console.log(result);
      if (!result) {
        console.dir("User not found");
        return false;

        //Tjekker om brugernes kodeord stemmer overens med brugerens email
      } else if (result.recordset[0].email === email && result.recordset[0].psw === password) {

        //opdaterer User tabel med det nye kodeord i kollonen med den givne email og retunerer true
        await sql.query`update [User]
              set psw = ${newPassword}
              where email = ${email}`;
        console.dir("User succesfully updated");
        return true;

        //Hvis brugeren findes men det er det forkerte kodeord retuneres false
      } else {
        console.dir("Password is incorrect");
        return false;
      }
      //Error handling
    } catch (err) {
      console.log(err);
      return;
    }
  }

  //ADMINS OPDATERING AF BRUGERS KODEORD FUNKTION
  //Admin har specielle rettigheder og behøver derfor ikke at kende til en brugeres kodeord. Funktionen tager 2 inputs (brugerens kodeord og brugerens nye kodeord)
  async adminUpdateUser(email, newPassword) {
    try {
      //Tjekker om brugeren er fundet i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);
      if (!result) {
        console.dir("User not found");
        return false;

        //Hvis brugerens findes 
      } else {
        await sql.query`update [User]
              set psw = ${newPassword}
              where email = ${email}`;
        console.dir("User succesfully updated");
        return true;
      }

      //Error handling
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async makeGold(email) {
    try {
      //Tjekker om der er fundet noget i DB, hvis ikke returnere den "false"
      const result = await this.findUser(email);
      console.log(result);
      if (!result) {
        console.dir("User not found");
        return false;
      } else {
        //gører brugeren til "guld status" ved at ændre status_id til 2
        await sql.query`update [User]
              set status_id = 2
              where email = ${email}`;
        console.dir("User succesfully updated");
        return true;
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

