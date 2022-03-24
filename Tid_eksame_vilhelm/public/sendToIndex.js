document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8080/localstoragestatus")
    .then((res) => res.json())
    .then((response) => {
      if (!response) {
        location.href = "/index.html";
      }
    })
    .catch(() => {
      window.alert("Der skete en fejl");
    });
   
});
