document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("postBtn").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("clicked post");
    fetch("http://localhost:1010/allposts")
      .then((res) => res.json())
      .then(function (result) {
        appendData(result);
      })
      .catch(function (err) {
        console.log(err);
      });

    function appendData(result) {
      var posts = "";
      for (var i = 0; i < result.recordset.length; i++) {
        posts +=
          result.recordset[i].email +
          " " +
          result.recordset[i].postal +
          " " +
          result.recordset[i].category_name +
          " " +
          result.recordset[i].created_at +
          " " +
          result.recordset[i].price +
          " " +
          result.recordset[i].description +
          " " +
          result.recordset[i].picture +
          "<br>";
      }
      console.log(posts);
      document.getElementById("Container").innerHTML = posts;
    }
  });
});