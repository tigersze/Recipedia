<?php
    session_start();
    error_reporting(E_ERROR | E_PARSE);
    $serverName = "localhost";
    $serverUserName = "root";
    $serverPassword = "";
    $serverDatabase = "recipedia";

    //session
    $userID = $_SESSION["user"];

    $con = mysqli_connect($serverName, $serverUserName, $serverPassword, $serverDatabase);
    if(!$con)
        die("MYSQL Connection Error: " . mysqli_connect_error());

     $tags = explode(',', $_POST['tags']);

    if($_POST['tags']){
        $sql = 
            "SELECT distinct dish_info.dishID, dish_info.dishName, dish_info.imgscr from dish_info, tag_join_dish where ";

        $or = false;
        foreach($tags as $tag){
            if(!$or){
                $or = true;
            }else
                $sql .= " or ";
            $sql .= "(tag_join_dish.tagName = " . "'$tag' and tag_join_dish.dishID = dish_info.dishID)";
        }

        $sql .= " order by dish_info.popularity desc";
    }else 
        $sql = "SELECT distinct dishID, dishName, imgscr from dish_info order by popularity desc";

    $object -> query = $sql;

    $query = mysqli_query($con, $sql) or die("Failed at search process...");

    $list = array();
    while($row = mysqli_fetch_assoc($query)){
        $elem = null;
        $elem -> dishID = $row['dishID'];
        $elem -> dishName = $row['dishName'];
        $elem -> imgUrl = $row['imgscr'];
        array_push($list, $elem);
    }

    $object -> list = $list;
    if(strlen($userID) == 0){
        echo json_encode($object);
        exit();
    }

    foreach($list as $item){
        $dishID = $item -> dishID;
        $sql = "SELECT likes from likes_list where userID = '$userID' and dishID = $dishID";
        $query = mysqli_query($con, $sql) or die(mysqli_error($con));
        $like = 0;
        if(mysqli_num_rows($query) != 0)
            $like = (int) mysqli_fetch_array($query)['likes'];
        $item -> like = $like;
    }

    $object -> list = $list;

    echo json_encode($object);

?>