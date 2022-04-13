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
        
      
    }
  })


  
})