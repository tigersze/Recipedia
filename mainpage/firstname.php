<?php
    session_start();
    error_reporting(E_ERROR | E_PARSE);
    $serverName = "localhost";
    $serverUserName = "root";
    $serverPassword = "";
    $serverDatabase = "recipedia";

    $con = mysqli_connect($serverName, $serverUserName, $serverPassword, $serverDatabase);
    if(!$con)
        die("MYSQL Connection Error: " . mysqli_connect_error());

    $userID = $_SESSION["user"];
    $sql = "SELECT first_name,pic from users where userID = '$userID'";
    $query = mysqli_query($con, $sql) or die(mysqli_error($con));

    $row = mysqli_fetch_assoc($query);

    $json -> first_name = $row['first_name'];
    $json -> pic = $row['pic'];
    echo json_encode($json);

?>