
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
})


