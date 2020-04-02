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
    
    //UserID Validation, only a registered user can perform like operations
    $sql = "SELECT count(*) as cnt from users where userID = '$userID'";

    //Predefine valid to false
    $object -> valid = 'F';

    $query = mysqli_query($con, $sql) or die("Failed: " . mysqli_error());
    if(mysqli_fetch_array($query)['cnt'] != 1){
        echo json_encode($object);
        exit();
    }

    //Usser validated, set valid to true
    $object -> valid = 'T';

    //Fetch dishID and like from POST for processing
    $dishID = (int)$_POST['dishID'];
    $like = (int) $_POST['like'];

    $sql = "SELECT likes from likes_list where userID = '$userID' and dishID = $dishID";
    $query = mysqli_query($con, $sql) or die("Failed at fetch like process...");
    $rows = mysqli_fetch_array($query);

    //Initialise currentLike
    $currentLike = 0;
    $popularityDelta = 0;

    if(mysqli_num_rows($query) == 1){
        //When user already have liked or disliked
        $previousLike = $rows['likes'];
        if($like != $previousLike){
            $currentLike += $like;
            $popularityDelta = $like * 6;
        }else
            $popularityDelta = - $like * 3;

    }else{

        $currentLike = $like;
        $popularityDelta = $like * 3;
        $sql = "INSERT into likes_list (userID, dishID, likes) values ('$userID', $dishID, $currentLike)";
        $query = mysqli_query($con, $sql) or die("Failed at insert like row process...");

    }

    if($currentLike == 0){

        $sql = "DELETE from likes_list where userID = '$userID' and dishID = $dishID";
        $query = mysqli_query($con, $sql) or die("Failed at delete row process...");

    }else{

        $sql = "UPDATE likes_list set likes = $currentLike where userID = '$userID' and dishID = $dishID";
        $query = mysqli_query($con, $sql) or die("Failed at update row process...");

    }

    $sql = "UPDATE dish_info set popularity = popularity + $popularityDelta where dishID = $dishID";
    $query = mysqli_query($con, $sql) or die("Failed at update popularity process...");

    $object -> status = $currentLike;
    echo json_encode($object);

    exit();
?>