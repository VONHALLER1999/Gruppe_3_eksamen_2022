document.addEventListener("DOMContentLoaded", (event) => {

//tjekker om brugeren er logged in
fetch("http://localhost:1010/loggedstatus")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    if (data) {
      location.href = "/index.html";
    }
  })
  .catch(() => {
    window.alert("Der skete en fejl");
  });

//login information bliver sendt til app.js hvorefter den for et false/true svar tilbage som den bruger til at   
document.getElementById("submit").addEventListener("click", (event) => {
    event.preventDefault();
    let data = {
"email": document.getElementById("email").value,
"password": document.getElementById("password").value
}
console.log(data)
    console.log("clicked submit login");
    fetch("http://localhost:1010/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(function (result) {
        login(result);
      })
      .then(function () {
        console.log("success");
      })
      .then(function () {
        console.log(data);
      })
      .catch(function (err) {
        console.log(err);
      });

      function login(result){
          if (!result) {
              window.alert("forkert data");
          } else {
                window.location.href = "/index.html";
          }
        } 
    }); 
});
