
document.addEventListener("DOMContentLoaded", (event) => {

  
    fetch("http://localhost:1010/numberofposts")
      .then((res) => res.json())
      .then(function (result) {
        displayNumber(result);
      })
      .then(function () {
        console.log("success");
      })
      .catch(function (err) {
        console.log(err);
      });

      function displayNumber(result) {
        elem = document.getElementById("Container")
        elem.innerHTML = result
        }


      fetch("http://localhost:1010/postamountanduser")
      .then((res) => res.json())
      .then(function (result) {
        createTable(result);
      })
      .then(function() { 
        console.log("success") 
      })
      .catch(function (err) {
        console.log(err);
      });

      function createTable(result) {
        for (let i=0; i < result.recordset.length; i++) {
          let arr = Object.values(result.recordsets[0][i]);
          
          var table = document.getElementById("table");
          var row = table.insertRow(i);

          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);

          cell1.innerHTML = result.recordset[i].email;
          cell2.innerHTML = arr[1];

          table.appendChild(row);
        }
    }
    
    //for alle brugerer og sætter dem i en tabel
    fetch("http://localhost:1010/users")
      .then((res) => res.json())
      .then(function (result) {
        createUserTable(result);
      })
      .catch(function (err) {
        console.log(err);
      });

    function createUserTable(result) {
      for (let i = 0; i < result.recordset.length; i++) {


        var table = document.getElementById("userTable");
        var row = table.insertRow(i);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
       

        cell1.innerHTML = result.recordset[i].email;
        cell2.innerHTML = `<button name="btn" type="submit" value="fav_HTML" onclick='
        
      let password = prompt("Nyt kodeord til brugeren")
      if (password === "") {
        window.alert("Intet kodeord")
      } else if (password) {
      let data = {
          "email": "${result.recordset[i].email}",
          "password": password
      }
      fetch("http://localhost:1010/adminupdateuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(function() { 
        console.log("updated user") 
      })
      .then(function (result) {
        if(result){
          window.alert("brugerens kodeord blev opdateret");
        };
      })
      .catch(function (err) {
        console.log(err);
      });
      
    } else {
      window.alert("Operation cancelled")
    }
        
        '> Ny kode </button>`;
        
        cell3.innerHTML = `<button name="btn" type="submit" value="fav_HTML" onclick='
        
        if (window.confirm("vil du gøre ${result.recordset[i].email} til guld?")) {
      let data = {
          "email": "${result.recordset[i].email}"
      }
      fetch("http://localhost:1010/makegold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(function() { 
        console.log("User made gold status") 
      })
      .then(function (result) {
        if(result){
          window.alert("brugeren har fået guld status");
        };
      })
      .catch(function (err) {
        console.log(err);
      });
      
      
      }
        
        '> gør til guld </button>`;

        cell4.innerHTML = `<button name="btn" type="submit" value="fav_HTML" onclick='
        
        if (window.confirm("Er du sikker?")) {
      let data = {
          "email": "${result.recordset[i].email}"
      }
      fetch("http://localhost:1010/admindeleteuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(function() { 
        console.log("deleted user") 
      })
      .then(function (result) {
        if(result){
          window.location.reload();
        };
      })
      .catch(function (err) {
        console.log(err);
      });
      
      
      }

        '> Slet </button>`;
        
        table.appendChild(row);
      }
    }

})


