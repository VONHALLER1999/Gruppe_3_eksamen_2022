document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("BilerBtn").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("clicked");
    fetch("http://localhost:8080/alleopslag")
      .then((res) => res.json())
      .then(function (data) {
        appendData(data);
      })
      .catch(function (err) {
        console.log(err);
      });

      function appendData(data) {
        console.log(sel.value);

        //finder de varer med den angivet kategori fra brugeren
        const found = data.filter((x) => x.kategori == sel.value);
        console.log(found);

        //fjerner de tidligere divs
        var element = document.getElementById("alleopslag");
        element.innerHTML = "";

        //går alle opslag igennem med min angivet kategori og smider dem
        for (let i = 0; i < found.length; i++) {
          var mainContainer = document.getElementById("alleopslag");

          var div = document.createElement("div");
          div.setAttribute("id", "vare");
          div.innerHTML =
            "Kategori: " +
            found[i].kategori +
            " Pris: " +
            found[i].pris +
            " Billede: " +
            found[i].billede;
          mainContainer.appendChild(div);
        }
      }
  });

  document.getElementById("mineopslag").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("clicked mineopslag");
    fetch("http://localhost:8080/allemineopslag")
      .then((res) => res.json())
      .then(function (data) {
        createTable(data);
      })
      .catch(function (err) {
        console.log(err);
      });

    //fjerner de tidligere divs
   

    function createTable(data) {
      
      for (let i = 0; i < data.length; i++) {

        var table = document.getElementById("table");
        var row = table.insertRow(i);

        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);

        cell0.innerHTML = data[i].email;
        cell1.innerHTML = data[i].kategori;
        cell2.innerHTML = data[i].pris;
        cell3.innerHTML = data[i].billede;
        cell4.innerHTML = data[i].id;

        table.appendChild(row);
      }
    }
  });
});
