<?php
include('config.php');


/* $data = json_decode(file_get_contents("php://input"));
  
if (isset($data)) {
	
	$id = $data->id;
	 */
 $imagesSql = "SELECT * FROM `jos_content` where `id` = 3";	
  
	 $result=mysql_query($imagesSql);
	$fetchImagesResulta = mysql_fetch_array($result);	
  	$fetchImagesResult = $fetchImagesResulta[4];
	//print_r($specialc); 
	 //$fetchImagesResult = urlencode($specialc);
	//print_r($fetchImagesResult); die;  
	
	if($fetchImagesResult){	
		$getdata =array('status'=>'Success','mesg'=>'Show Images recipes ','response'=>$fetchImagesResult);	
	}else{
		$getdata = array('status'=>'Fail','message'=>'There is No recipes found in database.','response'=>'Fail');	
	}
	echo json_encode(encodeURIComponent($getdata));
/* }	 */

?>