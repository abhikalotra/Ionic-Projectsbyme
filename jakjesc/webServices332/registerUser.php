<?php
include('config.php');


$data = json_decode(file_get_contents("php://input"));
  
if (isset($data)) {
	
$email = $data->email;
$password = $data->password;

	$userSql = "insert into jos_users (`email`,`password`) values ('$email', '$password')";
	$userSqlQuery = mysql_query($userSql);
	
	$data = array('mesg'=>'User have been created Successfully','responce'=>$userSqlQuery);
	echo json_encode($data);
	//return $userSqlQuery;
}
?>