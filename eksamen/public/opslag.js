let base64String = "";

function imageUploaded() {
  var fileInput = document.getElementById("billede");
  const selectedFile = fileInput.files[0];  
  var reader = new FileReader();
  reader.onload = function () {
    base64String = reader.result;
  };
  reader.readAsDataURL(selectedFile);
}


document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("submit").addEventListener("click", (event) => {
    event.preventDefault();
    
      if (base64String > 8000) {
        window.alert("Billedet er for stort")
      } else {
        
      let data = {
        pris: document.getElementById("pris").value,
        descripton: document.getElementById("descripton").value,
        kategori: document.getElementById("kategori").value,
        postalcode: document.getElementById("postalcode").value,
        billede: base64String,
      };

      console.log(data);
      console.log("clicked submit login");
      fetch("http://localhost:1010/opretopslag", {
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

      function login(result) {
        if (!result) {
          window.alert("forkert data");
        } else {
          window.alert("Dit opslag blev oprettet");
        }
      }
    }
  });
});
