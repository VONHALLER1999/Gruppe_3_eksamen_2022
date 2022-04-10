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
          cell2.innerHTML = result.recordset[i].postal;
          cell3.innerHTML = result.recordset[i].category_name;
          cell4.innerHTML = result.recordset[i].created_at;
          cell5.innerHTML = result.recordset[i].price;
          cell6.innerHTML = result.recordset[i].description;
          cell7.innerHTML = result.recordset[i].picture;

          table.appendChild(row);
      }
    }
  })
})