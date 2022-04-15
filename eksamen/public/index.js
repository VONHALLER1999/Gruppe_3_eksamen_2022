document.addEventListener("DOMContentLoaded", (event) => {

  document.getElementById("postBtn").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("clicked post");
    fetch("http://localhost:1010/allposts")
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
          var table = document.getElementById("table");
          var row = table.insertRow(i);

          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          var cell5 = row.insertCell(4);
          var cell6 = row.insertCell(5);
          var cell7 = row.insertCell(6);


          cell1.innerHTML = result.recordset[i].email;
          cell2.innerHTML = result.recordset[i].postalcode;
          cell3.innerHTML = result.recordset[i].category_name;
          cell4.innerHTML = result.recordset[i].created_at;
          cell5.innerHTML = result.recordset[i].price;
          cell6.innerHTML = result.recordset[i].description;
          cell7.innerHTML = result.recordset[i].picture;

          table.appendChild(row);
      }
    }
  })
  //tjekker om brugeren er logget ind ved loggedstatus endpoint. Hvis true fetcher den på 
  document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    fetch("http://localhost:1010/loggedstatus")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log("fetch");
          fetch("http://localhost:1010/logout")
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              window.alert("Du er blevet logget ud");
            })
            .catch(function (err) {
              console.log(err);
            });
        } else {
          window.alert("Du er ikke logget ind");
        }
      })
      .catch(() => {
        window.alert("Der skete en fejl");
      });

  })

  //tjekker om brugeren er logget ind, hvis ikke fjernes knapperne logout og rediger din bruger. Hvis Brugeren derimod er logget ind fjernes login og signup knappen
     fetch("http://localhost:1010/loggedstatus")
       .then((res) => res.json())
       .then((data) => {
         if (!data) {
           let elem1 = document.getElementById("updateUser")
           let elem2 = document.getElementById("logout")
           elem1.remove();
           elem2.remove();
         } else {
          let elem1 = document.getElementById("login");
          let elem2 = document.getElementById("signup");    
          elem1.remove();
          elem2.remove();      } 
       })
       .catch(() => {
         window.alert("Der skete en fejl");
       });
})