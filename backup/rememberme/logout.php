<?php
	session_start();
	session_destroy();
	if(isset($_COOKIE["userID"])){
 		{
 			setcookie ("userID", "");
 		}
 		if(isset($_COOKIE["password"])){
 			setcookie ("password", "");
 		}
	}	
	header("Location:../login/login.html");
?>