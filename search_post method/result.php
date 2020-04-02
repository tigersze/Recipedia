<?php

  $name = $_POST['find'];

  //to prevent mysql injecttion
	//$name = stripcslashes($name);

  //connect to the server and select database
	$link = mysqli_connect("localhost", "root", "", "login");

  //Query the database for dish_info
  $que_dish = "select dishName, `tag_join_dish`.tagName, `tag_join_dish`.dishID from tag_join_dish, tag_info, dish_info
                where `tag_info`.tagName = `tag_join_dish`.tagName
                and `tag_join_dish`.dishID = `dish_info`.dishID and `tag_join_dish`.tagName  = '".$name."'";


  $result = $link->query($que_dish);

  if(!$result) die("No information related to dishes");

  $result->data_seek(0);
  echo "The following are the dishes of ".$name. ":<br>";
  while($row = $result->fetch_assoc())
  {
    echo $row['dishName']."<br>";
  }
 ?>
