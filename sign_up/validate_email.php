<?php

    error_reporting(E_ERROR | E_PARSE);
    $serverName = "localhost";
    $serverUserName = "root";
    $serverPassword = "";

    $con = mysqli_connect($serverName, $serverUserName, $serverPassword);
    mysqli_select_db($con, "recipedia");

    $email = $_POST["email"];

    $sql = "SELECT count(*) as cnt from users where userID = '$email'";

    $res = mysqli_query($con, $sql) or die("Failed: " . mysqli_error());
    $cnt = mysqli_fetch_array($res)['cnt'];

    $obj -> singular = $cnt; 
    $json = json_encode($obj);
    echo $json;

?>