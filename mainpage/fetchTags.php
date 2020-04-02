<?php
    
    error_reporting(E_ERROR | E_PARSE);
    $serverName = "localhost";
    $serverUserName = "root";
    $serverPassword = "";
    $serverDatabase = "recipedia";

    $con = mysqli_connect($serverName, $serverUserName, $serverPassword, $serverDatabase);
    if(!$con)
        die("MYSQL Connection Error: " . mysqli_connect_error());

    $sql = "SELECT tagName, tagType, subTag from tag_info";
    $query = mysqli_query($con, $sql) or die("Failed at tags fetching...");

    $list = array();
    while($row = mysqli_fetch_assoc($query)){
        $elem = null;
        $elem -> tagName = $row['tagName'];
        $elem -> tagType = $row['tagType'];
        $elem -> subTag = $row['subTag'];
        array_push($list, $elem);
    }

    echo json_encode($list);

?>