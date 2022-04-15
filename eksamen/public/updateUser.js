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
})