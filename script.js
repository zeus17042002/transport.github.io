// Code to be executed when the page loads
window.onload = function() {
    // Get the current date and time
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var time = hours + ':' + minutes + ':' + seconds;
    var date = dd + '/' + mm + '/' + yyyy;
  
    // Display the current date and time in the header
    document.getElementById("date").innerHTML = date;
    document.getElementById("time").innerHTML = time;
  
    // Add event listeners to the menu items
    var menuItems = document.querySelectorAll("#menu ul li a");
    for (var i = 0; i < menuItems.length; i++) {
      menuItems[i].addEventListener("click", function() {
        // Get the href attribute of the menu item
        var href = this.getAttribute("href");
  
        // Load the content of the href into the content div
        var content = document.getElementById("content");
        var xhr = new XMLHttpRequest();
        xhr.open("GET", href, true);
        xhr.onload = function() {
          if (xhr.status === 200) {
            content.innerHTML = xhr.responseText;
          } else {
            content.innerHTML = "Error loading content";
          }
        };
        xhr.send();
      });
    }
    document.getElementById("content").style.opacity = 1;
  };