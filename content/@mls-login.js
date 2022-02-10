//MLS login automatically fill in the username and password
//this file is confidential, should not be put into github repo

(function () {
  let countTimer = setInterval(checkComplete, 100);
  let loginCount = 0;

  function checkComplete() {
    console.log("auto login to server:");
    if (document.querySelector("#loginbtn")) {
      clearInterval(countTimer);
      document.getElementById("security").innerText = "Escape88";
      document.getElementById("clareity").innerText = "v70898";
      document.getElementById("form-security").value = "Escape88";
      document.getElementById("form-clareity").value = "v70898";
      if (loginCount < 1) {
        loginCount++;
        document.forms["form_login"].submit();
      } else {
        console.log("Login Failed");
      }
    }
  }
})();
