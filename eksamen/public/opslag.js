let base64String = "";

function imageUploaded() {
  var file = document.querySelector("input[type=file]")["files"][0];

  var reader = new FileReader();
  console.log("next");

  reader.onload = function () {
    base64String = reader.result;

    imageBase64Stringsep = base64String;

    // alert(imageBase64Stringsep);
    console.log(base64String);
  };
  reader.readAsDataURL(file);
}


document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("submit").addEventListener("click", (event) => {
    event.preventDefault();
    
    console.log()
    console.log(
      document.getElementById("pris").value,
      document.getElementById("descripton").value,
      document.getElementById("kategori").value, 
      document.getElementById("postalcode").value,
    );
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
  });
});
