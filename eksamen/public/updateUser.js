document.addEventListener("DOMContentLoaded", (event) => {
    
    //tjekker om brugeren er logged in
  fetch("http://localhost:1010/loggedstatus")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (!data) {
        location.href = "/index.html";
      }
    })
    .catch(() => {
      window.alert("Der skete en fejl");
    });

  document.getElementById("delete").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("clicked delete");
    if (window.confirm("Er du sikker på at du vil slette din bruger?")) {
         fetch("http://localhost:1010/deletedeuser")
           .then((res) => res.json())
           .then(function (result) {
             deleteuser(result);
           })
           .catch(function (err) {
             console.log(err);
           });
           function deleteuser(result){
            if (result) {
                window.alert("Din bruger er slettet")
                location.href = "/index.html";
            }
           }     
    }
  });

  event.preventDefault();
  fetch("http://localhost:1010/allusersposts")
    .then((res) => res.json())
    .then(function (result) {
      createTable(result);
    })
    .then(function () {
      console.log("success");
    })
    .catch(function (err) {
      console.log(err);
    });

  function createTable(result) {
      
    for (let i = 0; i < result.recordset.length; i++) {
      var table = document.getElementById("table");
      var row = table.insertRow(i);

      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      var cell8 = row.insertCell(7);

      cell1.innerHTML = result.recordset[i].post_id;
      cell2.innerHTML = result.recordset[i].postalcode;
      cell3.innerHTML = result.recordset[i].category_name;
      cell4.innerHTML = result.recordset[i].created_at;
      cell5.innerHTML = result.recordset[i].price;
      cell6.innerHTML = result.recordset[i].description;
      cell7.innerHTML = result.recordset[i].picture;
      cell8.innerHTML = `<button id="${result.recordset[i].post_id}" name="btn"type="submit" value="fav_HTML" onclick='
      
      if (window.confirm("Er du sikker?")) {
      let data = {
          "post_id": ${result.recordset[i].post_id}
      }
      fetch("http://localhost:1010/deletepost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(function() { 
        console.log("success") 
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