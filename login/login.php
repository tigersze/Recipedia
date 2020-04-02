<?php
	session_start();
	error_reporting(E_ERROR | E_PARSE);
	//get value pass from form in the login.php file
	$username = $_POST['user'];
	$password = $_POST['password'];
	$remember = $_POST['remember'];

	//session
	$_SESSION["user"] = $username;

	//to prevent mysql injecttion
	$username= stripcslashes($username);
	$password= stripcslashes($password);

	//connect to the server and select database
	$link=mysqli_connect("localhost", "root", "");
	mysqli_select_db($link,"recipedia");

	//Query the database for user
	$result=mysqli_query($link,"select * from users where userID = '$username' and password = '$password' ")or die("Failed to query database".mysql_error());
	$json -> status = "fail";

	//if cookie set before
	//Ajax
	$row = mysqli_fetch_array($result);
	if($row['userID'] == $username&& $row['password']==$password){
				$json -> loggedUser = $username;
				$json -> status = "success";
				echo json_encode($json);
 			}	
	else{
		echo json_encode($json);
	}
?>