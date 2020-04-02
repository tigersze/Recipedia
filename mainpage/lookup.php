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

    $dishID = $_POST['dishID'];
    $sql = "SELECT imgscr, steps, dishName from dish_info where dishID = $dishID";
    $query = mysqli_query($con, $sql) or die("Failed at tags fetching...");

    $row = mysqli_fetch_assoc($query);

    $json -> imgURL = $row['imgscr'];
    $json -> dishName = $row['dishName'];
    $json -> steps = $row['steps'];

    $sql = "UPDATE dish_info set popularity = popularity + 1 where dishID = $dishID";
    $query = mysqli_query($con, $sql) or die("Failed at popularity stage...");

    echo json_encode($json);

?>