<!DOCTYPE html>
<html>
  <head>
    <title>Search</title>
  </head>
  <body>
      <fieldset name="searchForm" method="post">
        <p>
        <label> Search: </label>
        <input type="text" name="find" id="find" >
        </p>
        <p>
        <input type="button" value="search" onclick="showInfo()" />
        </p>
      </fieldset>
      <div id = "disInfo"></div>
      <script>
        function showInfo()
        {
          // action="result.php"
            disInfo.innerHTML = "";
            var input = document.getElementById("find").value;

            //checkValid
            if(input == "")
            {
              document.getElementById("disInfo").innerHTML = "Please input";
              return;
            }

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if(this.readyState == 4 && this.status == 200)
              {
                disInfo.innerHTML = this.responseText;
              }
            }
            var url = 'result.php'
            var send = 'find='+input;
            xhttp.open('POST', url, true);
            xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhttp.send(send);
        }
      </script>
  </body>
</html>
