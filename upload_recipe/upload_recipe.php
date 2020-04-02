<?php
      error_reporting(E_ERROR | E_PARSE);
      session_start();
      $user=$_SESSION["user"];
      $in1 = $_POST['in1'];
      $in2 = $_POST['in2'];
      $in3 = $_POST['in3'];
      $in4 = $_POST['in4'];
      $in5 = $_POST['in5'];
      $intype1 = $_POST['intype1'];
      $intype2 = $_POST['intype2'];
      $intype3 = $_POST['intype3'];
      $intype4 = $_POST['intype4'];
      $intype5 = $_POST['intype5'];
      $category = $_POST['category'];
      $dishname = $_POST['dish'];
      $steps = $_POST['steps'];
      $upload_suc = 0;
      $json -> url = $target_file;
    //to prevent mysql injecttion
    //$name = stripcslashes($name);

    //connect database
    $link = mysqli_connect("localhost", "root", "", "recipedia");
      if ($link->connect_error) {
        die("Connection failed: " . $link->connect_error);
      }

    //check dishes exist or not
    $havedish_que = "Select dishID, dishname, imgscr from dish_info where dishname ='".$dishname."'";
    $havedish_result = $link->query($havedish_que);
    $exist_flag = 0;
    while($row1 = $havedish_result->fetch_assoc()){
      if($row1['dishname'] != NULL){
          if($row1['imgscr'] != NULL){
              $json -> upload_recipe = "fail";
              $json -> error = "There has been already existed a picture";
              exit;
          }
        $exist_dishID = $row1['dishID'];
        $exist_flag = 1;
      }
    }

    //handle dish name and ingredients
    //add new dishID by getting exist database info
    $exist_dish = "Select count(*) from dish_info";
    $exist_dish_result = $link->query($exist_dish);
    if(!$exist_dish_result) die("No information");
    $exist_dish_result->data_seek(0);

    while($row = $exist_dish_result->fetch_assoc())
    {
      $newDishID = $row['count(*)'];
    }
    $newDishID++;

    //upload pic
    $target_dir = "web/";
    //echo json_encode($_FILES);
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    // Check if image file is a actual image or fake image
    if(isset($_POST["submit"])) {
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if($check !== false) {
            $uploadOk = 1;
        } else {
            $json -> error = "The file is not an image";
            $uploadOk = 0;
        }
    }
    // Allow certain file formats
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif" ) {
        $uploadOk = 0;
        $json -> error = "Sorry, only JPG, JPEG, PNG & GIF files are allowed";
    }
    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        $json -> upload_recipe = "fail";
    // if everything is ok, try to upload file
    }
    else{
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file))
        {
            //upload the pic to database
              if($exist_flag == 1){
                  $sql = "Update dish_info SET imgscr ='".$target_file."'WHERE dishID = ".$exist_dishID;
              }
              else{
                  $sql = "insert INTO `dish_info`(`dishID`, `dishName`, `ingredients1`, `ingredients2`, `ingredients3`,`ingredients4`,`ingredients5`, `category`, `steps`, `popularity`, `userID`, `imgscr`)
                          VALUES (".$newDishID.",'".$dishname."','".$in1."','".$in2."','".$in3."','".$in4."','".$in5."','".$category."','".$steps."',0,'".$user."','".$target_file."');";
              }
              if (mysqli_query($link,$sql)){
                   $upload_suc = 1;
                   $json -> status = "success";
                   $json -> upload_recipe = "success";
                   ?>
                   <?php
              }
              else{
                    $json -> upload_recipe = "fail";
               }
        }
        else{
            $json -> error = "Sorry, there was an error uploading your file";
            $json -> upload_recipe = "fail";
        }
    }

    //Insert into database
    if($upload_suc == 1){
      //insert query to different tables
      //insert tag_info
      $sql_tag_info_1 = "insert INTO `tag_info`(`tagName`, `tagType`, `subTag`)
                        VALUES ('".$in1."','ingredient','".$intype1."')";
      mysqli_query($link,$sql_tag_info_1);

      if($in2 != NULL){
        $sql_tag_info_2 = "insert INTO `tag_info`(`tagName`, `tagType`, `subTag`)
                          VALUES ('".$in2."','ingredient','".$intype2."')";
        mysqli_query($link,$sql_tag_info_2);
      }

      if($in3 != NULL){
        $sql_tag_info_3 = "insert INTO `tag_info`(`tagName`, `tagType`, `subTag`)
                          VALUES ('".$in3."','ingredient','".$intype3.")";
        mysqli_query($link,$sql_tag_info_3);
      }

      if($in4 != NULL){
        $sql_tag_info_4 = "insert INTO `tag_info`(`tagName`, `tagType`, `subTag`)
                          VALUES ('".$in4."','ingredient','".$intype4.")";
        mysqli_query($link,$sql_tag_info_4);
      }

      if($in5 != NULL){
        $sql_tag_info_5 = "insert INTO `tag_info`(`tagName`, `tagType`, `subTag`)
                          VALUES ('".$in5."','ingredient','".$intype5.")";
        mysqli_query($link,$sql_tag_info_5);
      }

      //insert tag_join_dish
      $sql_tag_join_dish_1 = "insert INTO `tag_join_dish`(`tagName`, `dishID`) VALUES ('".$in1."',".$newDishID.")";
      mysqli_query($link,$sql_tag_join_dish_1);

      if($in2 != NULL){
        $sql_tag_join_dish_2 = "insert INTO `tag_join_dish`(`tagName`, `dishID`) VALUES ('".$in2."',".$newDishID.")";
        mysqli_query($link,$sql_tag_join_dish_2);
      }

      if($in3 != NULL){
        $sql_tag_join_dish_3 = "insert INTO `tag_join_dish`(`tagName`, `dishID`) VALUES ('".$in3."',".$newDishID.")";
        mysqli_query($link,$sql_tag_join_dish_3);
      }

      if($in4 != NULL){
        $sql_tag_join_dish_4 = "insert INTO `tag_join_dish`(`tagName`, `dishID`) VALUES ('".$in4."',".$newDishID.")";
        mysqli_query($link,$sql_tag_join_dish_4);
      }

      if($in5 != NULL){
        $sql_tag_join_dish_5 = "insert INTO `tag_join_dish`(`tagName`, `dishID`) VALUES ('".$in5."',".$newDishID.")";
        mysqli_query($link,$sql_tag_join_dish_3);
      }

      //insert like_list
      $sql_like_list = "insert INTO `likes_list`(`dishID`, `likes`, `userID`) VALUES (".$newDishID.",0,'".$user."')";
      mysqli_query($link,$sql_like_list);
      $json -> upload_recipe = "success";
    }
  echo json_encode($json);
?>