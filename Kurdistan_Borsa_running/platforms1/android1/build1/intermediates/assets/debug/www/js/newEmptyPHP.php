<?php
//header('Content-Type: application/json');
include('connect.php');
$function = $_REQUEST['function'];

 if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
 
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");        
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
 
        exit(0);
    }



/********************User Images Path*********************************/
/*http://kurdistanborsa.com/currency_exchange/assets/images/adds*/

/********************Login Function*********************************/
/*http://kurdistanborsa.com/currency_exchange/webservices.php?function=login&email=admin@gmail.com&password=12345*/
if($function == 'login')
{
	$response = array();
	$response['status'] = 'true';
	$email = $_REQUEST['email'];
	$password = $_REQUEST['password'];
	$andriod_id = $_REQUEST['andriod_id'];
	//$andriod_device_id = $_REQUEST['android_device_id'];
	
	$result = $mysqli->query("SELECT * FROM tbl_admin WHERE email = '".$email."' AND password = md5('".$password."')");
	if($result->num_rows > 0)
	{
		$row = $result->fetch_array(MYSQLI_BOTH);
		$stmt = $mysqli->prepare("UPDATE tbl_admin SET andriod_id = ?, updated = ? WHERE id = ?");
		//date_default_timezone_set("Asia/Kolkata"); 
		$datetime = date("Y-m-d H:i:s");
		$stmt->bind_param('ssi', $andriod_id, $datetime, $row['id']);
		$stmt->execute();
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Invalid Username or Password.';
	}
	echo json_encode($response);
	
}

/********************Check user signup*********************************/
/*http://kurdistanborsa.com/currency_exchange/webservices.php?function=signupCheck*/
if($function == 'signupCheck')
{
	$response = array();
	$response['status'] = 'true';
	
	
	$result = $mysqli->query("SELECT * FROM tbl_settings WHERE setting = 'user_signup' ");
	if($result->num_rows > 0)
	{
		$row = $result->fetch_array(MYSQLI_BOTH);
		$response['active'] = $row['active'];
		/*$stmt = $mysqli->prepare("UPDATE tbl_admin SET andriod_id = ?, updated = ? WHERE id = ?");
		//date_default_timezone_set("Asia/Kolkata"); 
		$datetime = date("Y-m-d H:i:s");
		$stmt->bind_param('ssi', $andriod_id, $datetime, $row['id']);
		$stmt->execute();*/
	}
	
	echo json_encode($response);
	
}

/*http://kurdistanborsa.com/currency_exchange/webservices.php?function=signupCheckUpdate&active=*/
if($function == 'signupCheckUpdate')
{
	$response = array();
	$response['status'] = 'true';
	$active = $_REQUEST['active'];

		$stmt = $mysqli->prepare("UPDATE tbl_settings SET active = ? where setting = 'user_signup' ");
		$stmt->bind_param('i',$active);
		$stmt->execute();
	
	echo json_encode($response);
	
}

/********************Add 'adds' Function*********************************/
if($function == 'addAdds') {
        $response = array();
	$response['status'] = 'true';
	$title = $_REQUEST['title'];
	$name = $_REQUEST['name'];
	$publish_date = $_REQUEST['publish_date'];
	$expiry_date = $_REQUEST['expiry_date'];
	$id = $_REQUEST['id'];
//echo strlen($_REQUEST['image']);
//echo $_REQUEST['image'];

$_REQUEST['image'] = str_replace(" ","+",$_REQUEST['image']);

$myfile = fopen("test.txt", "w") or die("Unable to open file!");

$txt = $_REQUEST['image'];
fwrite($myfile, $txt);
fclose($myfile);
	
	if($id == '')
	{
		if(isset($_REQUEST['image']) && ($_REQUEST['image'] != ''))
		{
			$rand = rand(1,999);
			$image_user = time()."_$rand.jpeg";
			$img = imagecreatefromstring(base64_decode($_REQUEST['image']));
			$image_loc = "assets/images/adds/".$image_user;
			if($img != false)
			{
				   imagejpeg($img,$image_loc);
			} 
			$stmt = $mysqli->prepare("INSERT INTO tbl_adds(	title, name, publish_date, expiry_date, image) VALUES (?, ?, ?, ?, ?)");
			$stmt->bind_param('sssss', $title, $name, $publish_date, $expiry_date, $image_user); 
		}
		else
		{
			$stmt = $mysqli->prepare("INSERT INTO tbl_adds(	title, name, publish_date, expiry_date) VALUES (?, ?, ?, ?)");
			$stmt->bind_param('ssss', $title, $name, $publish_date, $expiry_date);
		}
		
		if($stmt->execute())
		{
			$response['status'] = 'true';
			$response['message'] = 'Data Successfully Saved.';
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Sorry! Something Went Wrong.';
		}
	}
	else
	{
		$result = $mysqli->query("SELECT * FROM tbl_adds where id = ".$id);
		if($result->num_rows > 0)
		{
			if(isset($_REQUEST['image']) && ($_REQUEST['image'] != ''))
			{
				$rand = rand(1,999);
				$image_user = time()."_$rand.jpg";
				$img = imagecreatefromstring(base64_decode($_REQUEST['image']));
				$image_loc = "assets/images/adds/".$image_user;
				if($img != false)
				{
					imagejpeg($img,$image_loc);
				}  
				$stmt = $mysqli->prepare("UPDATE tbl_adds SET title = ?, name = ?, publish_date = ?, expiry_date=?, image = ?, updated = ? WHERE id = ?");
				//date_default_timezone_set("Asia/Kolkata"); 
				$datetime = date("Y-m-d H:i:s");
				$stmt->bind_param('ssssssi', $title, $name, $publish_date, $expiry_date, $image_user, $datetime, $id);
			}
			else
			{
				$stmt = $mysqli->prepare("UPDATE tbl_adds SET title = ?, name = ?, publish_date = ?, expiry_date=?, updated = ? WHERE id = ?");
				//date_default_timezone_set("Asia/Kolkata"); 
				$datetime = date("Y-m-d H:i:s");
				$stmt->bind_param('sssssi', $title, $name, $publish_date, $expiry_date, $datetime, $id);
			}
			if($stmt->execute())
			{
				$response['status'] = 'true';
				$response['message'] = 'Data Successfully Saved.';
			}
			else
			{
				$response['status'] = 'false';
				$response['message'] = 'Sorry! Something Went Wrong.';
			}
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Something went wrong.';
		}
	}
	
	
	
	echo json_encode($response);
}


/********************Display 'Adds' Function*********************************/
if($function == 'displayAdds') {
	$response = array();
	$response['status'] = 'true';
	//$result = $mysqli->query("SELECT * FROM tbl_adds where expiry_date >= now() and publish_date <= now()");
	$result = $mysqli->query("SELECT * FROM tbl_adds");
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			$rows[] = $resultRow;
		}
		$i = 0;
		foreach($rows as $row)
		{
$response['data'][$i]['id'] = $row['id'];
			$response['data'][$i]['title'] = $row['title'];
			$response['data'][$i]['name'] = $row['name'];
			$response['data'][$i]['publish_date'] = $row['publish_date'];
			$response['data'][$i]['expiry_date'] = $row['expiry_date'];
			$response['data'][$i]['image'] = 'http://kurdistanborsa.com/currency_exchange/assets/images/adds/'.$row['image'];
			$i++;
		}		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	
	echo json_encode($response);
}


/********************Update 'Adds' Function*********************************/
if($function == 'updateAdds') {
	$response = array();
	$response['status'] = 'true';
	$id = $_REQUEST['id'];
	$title = $_REQUEST['title'];
	$name = $_REQUEST['name'];
	$publish_date = $_REQUEST['publish_date'];
	$expiry_date = $_REQUEST['expiry_date'];
	
	$result = $mysqli->query("SELECT * FROM tbl_adds where id = ".$id);
	//print_r($result);
	if($result->num_rows > 0)
	{
		if(isset($_REQUEST['image']) && ($_REQUEST['image'] != ''))
		{
			$rand = rand(1,999);
			$image_user = time()."_$rand.jpg";
			$img = imagecreatefromstring(base64_decode($_REQUEST['image']));
			$image_loc = "assets/images/adds/".$image_user;
			if($img != false)
			{
				imagejpeg($img,$image_loc);
			}  
			$stmt = $mysqli->prepare("UPDATE tbl_adds SET title = ?, name = ?, publish_date = ?, expiry_date=?, image = ?, updated = ? WHERE id = ?");
			//date_default_timezone_set("Asia/Kolkata"); 
			$datetime = date("Y-m-d H:i:s");
			$stmt->bind_param('ssssssi', $title, $name, $publish_date, $expiry_date, $image_user, $datetime, $id);
			//$stmt->execute();
		}
		else
		{
			$stmt = $mysqli->prepare("UPDATE tbl_adds SET title = ?, name = ?, publish_date = ?, expiry_date=?, updated = ? WHERE id = ?");
			//date_default_timezone_set("Asia/Kolkata"); 
			$datetime = date("Y-m-d H:i:s");
			$stmt->bind_param('sssssi', $title, $name, $publish_date, $expiry_date, $datetime, $id);
			//$stmt->execute();
		}

		if($stmt->execute())
		{
			$response['status'] = 'true';
			$response['message'] = 'Data Successfully Saved.';
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Sorry! Something Went Wrong.';
		}
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	echo json_encode($response);
}

/********************Delete 'adds' Function*********************************/
if($function == 'deleteAdds') {
	$response = array();
	$response['status'] = 'true';
	$id = $_REQUEST['id'];
	
	$stmt = $mysqli->prepare("DELETE FROM tbl_adds WHERE id = ?");
	$stmt->bind_param('i', $id);
	if($stmt->execute())
	{
		$response['message'] = 'Deleted successfully';
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Please try again!!';
	}
	
	echo json_encode($response);
}

/********************Add 'Markets' Function*********************************/
if($function == 'addMarkets') {
	$response = array();
	$response['status'] = 'true';
	$title = $_REQUEST['title'];
	//$unit_price = $_REQUEST['unit_price'];
	//$current_value = $_REQUEST['current_value'];
	//$purchase_value = $_REQUEST['purchase_value'];
	//$gain_loss = $_REQUEST['gain_loss'];
	$ask = $_REQUEST['ask'];
	$bid = $_REQUEST['bid'];
	$id = $_REQUEST['id'];
	$message = "";
	$title2 = "";

	if($id == '')
	{
		//$stmt = $mysqli->prepare("INSERT INTO tbl_markets(title, unit_price, current_value, purchase_value, gain_loss, ask, bid) VALUES (?, ?, ?, ?, ?, ?, ?)");
		//$stmt->bind_param('sdddddd', $title, $unit_price, $current_value, $purchase_value, $gain_loss, $ask, $bid);
		
		$stmt = $mysqli->prepare("INSERT INTO tbl_markets(title, ask, bid) VALUES (?, ?, ?)");
		$stmt->bind_param('sss', $title, $ask, $bid);

		if($stmt->execute())
		{
			$response['status'] = 'true';
			$response['message'] = 'Data Successfully Saved.';
			
			
			
			
			/*********************************************************************************/
			/*****************************Sending GCM starts here*****************************/
			/*********************************************************************************/
				
					define("GOOGLE_API_KEY","AIzaSyBNGrnIiZ2SGkiKj1R-gZ30JnbZw8lTjgw");
					$registatoin_ids = array();
					$user_ids = array();
					$result = $mysqli->query("SELECT * FROM tbl_users");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['andriod_id'])){
							$registatoin_id[] = $resultRow['andriod_id'];
							$user_ids_registered[] = $resultRow['id'];
							$user_ids[] = $resultRow['id'];
							}
						}		
					}

					$result = $mysqli->query("SELECT * FROM tbl_android_ids");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['android_id'])){
							$registatoin_id[] = $resultRow['android_id'];
							}
						}		
					}

					$registatoin_ids = array_unique($registatoin_id);



					//$title = $_REQUEST['title'];
					$title = 'kurdistanborsa';
					if($_REQUEST['sound'] == '0')
					{
						$sound = 'sound1';
					}
					else if($_REQUEST['sound'] == '1')
					{
						$sound = 'sound2';
					}
					else
					{
						$sound = 'sound3';
					}
					$img = 'http://www.newsread.in/wp-content/uploads/2016/06/Images-3.jpg';
					$message = 'New market added.';

					$msg = array ( 'message' => $message, 'title' => $title, 'sound' => $sound, 'soundname' => $sound, 'foreground' => false, 'coldstart' => true,'notId'=>''.time() );

						// Set POST variables
						$url = 'https://android.googleapis.com/gcm/send';

						$fields = array(
							'registration_ids' => $registatoin_ids,
							'data' => $msg,
						);

						$headers = array(
							'Authorization: key=' . GOOGLE_API_KEY,
							'Content-Type: application/json'
						);
						// Open connection
						$ch = curl_init();

						// Set the url, number of POST vars, POST data
						curl_setopt($ch, CURLOPT_URL, $url);

						curl_setopt($ch, CURLOPT_POST, true);
						curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

						// Disabling SSL Certificate support temporarly
						curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

						curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

						// Execute post	
					 $result = curl_exec($ch);
						if ($result === FALSE) {
							die('Curl failed: ' . curl_error($ch));
						}

						// Close connection
						curl_close($ch);
						//echo $result;
						$tmpRes = json_decode($result);
                                                echo $tmpRes;
						//echo $tmpRes->failure;
						/*if($tmpRes->failure==0) {
							foreach($user_ids_registered as $user_id)
							{
							$stmt = $mysqli->prepare("INSERT INTO tbl_notifications(user_id, title, message, created) VALUES (?, ?, ?, ?)");
							$created = date("Y-m-d H:i:s");
							$stmt->bind_param('isss', $user_id, $_REQUEST['title'], $_REQUEST['message'], $created); 
							$stmt->execute();
							}
						}*/
				
				
					/*********************************************************************************/
					/*****************************Sending GCM ends here*****************************/
					/*********************************************************************************/
			
			
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Sorry! Something Went Wrong.';
		}
	}
	else 
	{
		$result = $mysqli->query("SELECT * FROM tbl_markets where id = ".$id);

		if($result->num_rows > 0)
		{
			$row = $result->fetch_array();
			$ask_update = 1;
			$bid_update = 1;
			$title2 ='Market Ask/Bid Update.';
			if($ask > $row['ask']) {
				$ask_arrow = 'u';
				$message.= 'Market ask up.';	
			}else if($ask < $row['ask']) {
				$ask_arrow = 'd';
				$message.= 'Market ask down.';	
			} else {
				$ask_arrow = $row['ask_arrow'];
				$ask_update = 0;
			}
			
			
			if($bid > $row['bid']) {
				$bid_arrow = 'u';
				$message.='Market bid up.';	
			} else if($bid < $row['bid']) {
				$bid_arrow = 'd';
				$message.='Market bid down.';	
			} else {
				$bid_arrow = $row['bid_arrow'];
				$bid_update = 0;
			}
			
			
			
			$stmt = $mysqli->prepare("UPDATE tbl_markets SET title = ?, ask=?, bid=?, ask_arrow=?, bid_arrow=?, updated = ? WHERE id = ?");
			//date_default_timezone_set("Asia/Kolkata"); 
			$datetime = date("Y-m-d H:i:s");
			$stmt->bind_param('ssssssi', $title, $ask, $bid, $ask_arrow, $bid_arrow, $datetime, $id);
			//$stmt->bind_param('sddddddsi', $title, $unit_price, $current_value, $purchase_value, $gain_loss, $ask, $bid, $datetime, $id);

			if($stmt->execute())
			{
				$response['status'] = 'true';
				$response['message'] = 'Data Successfully Saved.';
				
				
				
				
				
				
				
				
				/*********************************************************************************/
				/*****************************Sending GCM starts here*****************************/
				/*********************************************************************************/
				$send_notification = 1;
				
				if($ask_update == 0 && $bid_update == 0)
				{
					$send_notification = 0;
				}
				if($send_notification == 1)
				{
					define("GOOGLE_API_KEY","AIzaSyBNGrnIiZ2SGkiKj1R-gZ30JnbZw8lTjgw");
					$registatoin_ids = array();
					$user_ids = array();
					$result = $mysqli->query("SELECT * FROM tbl_users");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['andriod_id'])){
							$registatoin_id[] = $resultRow['andriod_id'];
							$user_ids_registered[] = $resultRow['id'];
							$user_ids[] = $resultRow['id'];
							}
						}		
					}

					$result = $mysqli->query("SELECT * FROM tbl_android_ids");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['android_id'])){
							$registatoin_id[] = $resultRow['android_id'];
							}
						}		
					}

					$registatoin_ids = array_unique($registatoin_id);



					$title = 'kurdistanborsa';
					if($_REQUEST['sound'] == '0')
					{
						$sound = 'sound1';
					}
					else if($_REQUEST['sound'] == '1')
					{
						$sound = 'sound2';
					}
					else
					{
						$sound = 'sound3';
					}
					$img = 'http://www.newsread.in/wp-content/uploads/2016/06/Images-3.jpg';

					$msg = array ( 'message' => $message, 'title' => $title, 'sound' => $sound, 'soundname' => $sound, 'foreground' => false, 'coldstart' => true,'notId'=>''.time() );

						// Set POST variables
						$url = 'https://android.googleapis.com/gcm/send';

						$fields = array(
							'registration_ids' => $registatoin_ids,
							'data' => $msg,
						);

						$headers = array(
							'Authorization: key=' . GOOGLE_API_KEY,
							'Content-Type: application/json'
						);
						// Open connection
						$ch = curl_init();

						// Set the url, number of POST vars, POST data
						curl_setopt($ch, CURLOPT_URL, $url);

						curl_setopt($ch, CURLOPT_POST, true);
						curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

						// Disabling SSL Certificate support temporarly
						curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

						curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

						// Execute post	
					 $result = curl_exec($ch);
						if ($result === FALSE) {
							die('Curl failed: ' . curl_error($ch));
						}

						// Close connection
						curl_close($ch);
						//echo $result;
						$tmpRes = json_decode($result);
						//echo $tmpRes->failure;
						/*if($tmpRes->failure==0) {
							foreach($user_ids_registered as $user_id)
							{
							$stmt = $mysqli->prepare("INSERT INTO tbl_notifications(user_id, title, message, created) VALUES (?, ?, ?, ?)");
							$created = date("Y-m-d H:i:s");
							$stmt->bind_param('isss', $user_id, $_REQUEST['title'], $_REQUEST['message'], $created); 
							$stmt->execute();
							}
						}*/
					}
				
					/*********************************************************************************/
					/*****************************Sending GCM ends here*****************************/
					/*********************************************************************************/
			}
			else
			{
				$response['status'] = 'false';
				$response['message'] = 'Sorry! Something Went Wrong.';
			}
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Something went wrong.';
		}
	}
	
	echo json_encode($response);
}


/********************Display 'Markets' Function*********************************/
if($function == 'displayMarkets') {
	$response = array();
	$response['status'] = 'true';
	//$result = $mysqli->query("SELECT * FROM tbl_adds where expiry_date >= now() and publish_date <= now()");
	$result = $mysqli->query("SELECT * FROM tbl_markets");
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			$rows[] = $resultRow;
		}
		$i = 0;
		foreach($rows as $row)
		{
			$response['data'][$i]['id'] = $row['id'];
			$response['data'][$i]['title'] = $row['title'];
			/*$response['data'][$i]['unit_price'] = floatval($row['unit_price']);
			$response['data'][$i]['current_value'] = floatval($row['current_value']);
			$response['data'][$i]['purchase_value'] = floatval($row['purchase_value']);
			$response['data'][$i]['gain_loss'] =floatval($row['gain_loss']);*/
			$response['data'][$i]['ask'] =($row['ask']);
			$response['data'][$i]['bid'] =($row['bid']);
			if($row['bid_arrow']=='u') {
			$response['data'][$i]['bid_arrow'] = 1;
			} else {
			$response['data'][$i]['bid_arrow'] = 0;
			}
			
			if($row['ask_arrow']=='u') {
			$response['data'][$i]['ask_arrow'] = 1;
			} else {
			$response['data'][$i]['ask_arrow'] = 0;
			}
			$i++;
		}		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	
	echo json_encode($response);
}


/********************Update 'Markets' Function*********************************/
/*if($function == 'updateMarkets') {
	$response = array();
	$response['status'] = 'true';
	$id = $_REQUEST['id'];
	$title = $_REQUEST['title'];
	$unit_price = $_REQUEST['unit_price'];
	$current_value = $_REQUEST['current_value'];
	$purchase_value = $_REQUEST['purchase_value'];
	$gain_loss = $_REQUEST['gain_loss'];
	
	$result = $mysqli->query("SELECT * FROM tbl_markets where id = ".$id);
	//print_r($result);
	if($result->num_rows > 0)
	{
		
		$stmt = $mysqli->prepare("UPDATE tbl_markets SET title = ?, unit_price = ?, current_value = ?, purchase_value=?, gain_loss=? updated = ? WHERE id = ?"); 
		$datetime = date("Y-m-d H:i:s");
		$stmt->bind_param('siiiisi', $title, $unit_price, $current_value, $purchase_value, $gain_loss, $datetime, $id);

		if($stmt->execute())
		{
			$response['status'] = 'true';
			$response['message'] = 'Data Successfully Saved.';
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Sorry! Something Went Wrong.';
		}
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	echo json_encode($response);
}*/


/********************Update 'AllMarkets' Function*********************************/
if($function == 'updateAllMarkets') {	
	$response = array();
	$response['status'] = 'true';
	$amount = $_REQUEST['amount'];
	$isask = $_REQUEST['isask'];
	$chkMinus = substr($amount,0,1);
	$message='';
	
	$result = $mysqli->query("SELECT * FROM tbl_markets");
	
	if($isask == 1)
	{
		if($chkMinus == '-')
		{
			$updatedAmount = substr($_REQUEST['amount'], 1);
			//$stmt = $mysqli->prepare("UPDATE tbl_markets SET ask = ask - ?, ask_arrow = 'd'");
			$message.= "All market ask rate are down.";
			
			if($result->num_rows > 0)
			{
				while($resultRow = $result->fetch_array())
				{
					$amount =  $resultRow['ask']-$updatedAmount;
                                        

					
					$stmt = $mysqli->prepare("UPDATE tbl_markets SET ask = ?, ask_arrow = 'd' where id = ?");
					$stmt->bind_param('si', $amount, $resultRow['id']);
					$update = $stmt->execute();
				}		
			}
		}
		else
		{
			$updatedAmount = $_REQUEST['amount'];
			//$stmt = $mysqli->prepare("UPDATE tbl_markets SET ask = ask + ?, ask_arrow = 'u'");
			$message.= "All market ask rate are up.";
			
			if($result->num_rows > 0)
			{
				while($resultRow = $result->fetch_array())
				{
					$amount = $updatedAmount + $resultRow['ask'];
					$stmt = $mysqli->prepare("UPDATE tbl_markets SET ask = ?, ask_arrow = 'u' where id = ?");
					$stmt->bind_param('si', $amount, $resultRow['id']);
					$update = $stmt->execute();
				}		
			}
		}
	}
	else if($isask == 2)
	{
		if($chkMinus == '-')
		{
			$updatedAmount = substr($_REQUEST['amount'], 1);
			//$stmt = $mysqli->prepare("UPDATE tbl_markets SET bid = bid - ?, bid_arrow = 'd'");
			$message.= "All market bid rate are down.";
			
			if($result->num_rows > 0)
			{
				while($resultRow = $result->fetch_array())
				{
					$amount = $resultRow['bid']-$updatedAmount;
					$stmt = $mysqli->prepare("UPDATE tbl_markets SET bid = ?, bid_arrow = 'd' where id = ?");
					$stmt->bind_param('si', $amount, $resultRow['id']);
					$update = $stmt->execute();
				}		
			}
		}
		else
		{
			$updatedAmount = $_REQUEST['amount'];
			//$stmt = $mysqli->prepare("UPDATE tbl_markets SET bid = bid + ?, bid_arrow = 'u'");
			$message.= "All market bid rate are up.";
			if($result->num_rows > 0)
			{
				while($resultRow = $result->fetch_array())
				{
					$amount = $updatedAmount + $resultRow['bid'];
					$stmt = $mysqli->prepare("UPDATE tbl_markets SET bid = ?, bid_arrow = 'u' where id = ?");
					$stmt->bind_param('si', $amount, $resultRow['id']);
					$update = $stmt->execute();
				}		
			}
		}
	}



	
	$datetime = date("Y-m-d H:i:s");
	//$stmt->bind_param('s', $updatedAmount);
	if($update)
	{

		/****************GCM************************/
define("GOOGLE_API_KEY","AIzaSyBNGrnIiZ2SGkiKj1R-gZ30JnbZw8lTjgw");
					$registatoin_ids = array();
					$user_ids = array();
					$result = $mysqli->query("SELECT * FROM tbl_users");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['andriod_id'])){
							$registatoin_id[] = $resultRow['andriod_id'];
							$user_ids_registered[] = $resultRow['id'];
							$user_ids[] = $resultRow['id'];
							}
						}		
					}

					$result = $mysqli->query("SELECT * FROM tbl_users");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['android_id'])){
							$registatoin_id[] = $resultRow['android_id'];
							}
						}		
					}

					$registatoin_ids = array_unique($registatoin_id);



					$title = 'All Market Status';
					if($_REQUEST['sound'] == '0')
					{
						$sound = 'sound1';
					}
					else if($_REQUEST['sound'] == '1')
					{
						$sound = 'sound2';
					}
					else
					{
						$sound = 'sound3';
					}
					$img = 'http://www.newsread.in/wp-content/uploads/2016/06/Images-3.jpg';

					$msg = array ( 'message' => $message, 'title' => $title, 'sound' => $sound, 'soundname' => $sound, 'foreground' => false, 'coldstart' => true,'notId'=>''.time() );

						// Set POST variables
						$url = 'https://android.googleapis.com/gcm/send';

						$fields = array(
							'registration_ids' => $registatoin_ids,
							'data' => $msg,
						);

						$headers = array(
							'Authorization: key=' . GOOGLE_API_KEY,
							'Content-Type: application/json'
						);
						// Open connection
						$ch = curl_init();

						// Set the url, number of POST vars, POST data
						curl_setopt($ch, CURLOPT_URL, $url);

						curl_setopt($ch, CURLOPT_POST, true);
						curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

						// Disabling SSL Certificate support temporarly
						curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

						curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

						// Execute post	
					 $result = curl_exec($ch);
						if ($result === FALSE) {
							die('Curl failed: ' . curl_error($ch));
						}

						// Close connection
						curl_close($ch);
						//echo $result;
						$tmpRes = json_decode($result);
						if($tmpRes->failure==0) {
							foreach($user_ids_registered as $user_id)
							{
							$stmt = $mysqli->prepare("INSERT INTO tbl_notifications(user_id, title, message, created) VALUES (?, ?, ?, ?)");
							$created = date("Y-m-d H:i:s");
							$stmt->bind_param('isss', $user_id, $_REQUEST['title'], $_REQUEST['message'], $created); 
							$stmt->execute();
							}
						}

/*******************************************/

		$response['status'] = 'true';
		$response['message'] = 'Data Successfully Saved.';
		
		$result = $mysqli->query("SELECT * FROM tbl_markets");
		if($result->num_rows > 0)
		{
			while($resultRow = $result->fetch_array())
			{
				$rows[] = $resultRow;
			}
			$i = 0;
			foreach($rows as $row)
			{
				$response['data'][$i]['id'] = $row['id'];
				$response['data'][$i]['title'] = $row['title'];
				/*$response['data'][$i]['unit_price'] = floatval($row['unit_price']);
				$response['data'][$i]['current_value'] = floatval($row['current_value']);
				$response['data'][$i]['purchase_value'] = floatval($row['purchase_value']);
				$response['data'][$i]['gain_loss'] =floatval($row['gain_loss']);*/
				$response['data'][$i]['ask'] =floatval($row['ask']);
				$response['data'][$i]['bid'] =floatval($row['bid']);
				$i++;
			}	
                        
                        $response['gcm'] = $tmpRes ;
		}
		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Sorry! Something Went Wrong.';
	}
	
	echo json_encode($response);

}



/********************Delete 'Markets' Function*********************************/
if($function == 'deleteMarkets') {
	$response = array();
	$response['status'] = 'true';
	$id = $_REQUEST['id'];
	
	$stmt = $mysqli->prepare("DELETE FROM tbl_markets WHERE id = ?");
	$stmt->bind_param('i', $id);
	if($stmt->execute())
	{
		$response['message'] = 'Deleted successfully';
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Please try again!!';
	}
	
	echo json_encode($response);
}

/********************Display 'countries' Function*********************************/
if($function == 'displayCountries') {
	$response = array();
	$response['status'] = 'true';
	//$result = $mysqli->query("SELECT * FROM tbl_adds where expiry_date >= now() and publish_date <= now()");
	$result = $mysqli->query("SELECT * FROM tbl_countries");
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			$rows[] = $resultRow;
		}
		$i = 0;
		foreach($rows as $row)
		{
			$response['data'][$i]['id'] = $row['id'];
			$response['data'][$i]['name'] = $row['name'];
			$response['data'][$i]['flag'] = $row['alpha_2'].'.png';
			$response['data'][$i]['currency'] = $row['currency'];
			$response['data'][$i]['currency_code'] = $row['currency_code'];
			$i++;
		}		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	
	echo json_encode($response);
}


/********************Add 'Currencies' Function*********************************/
if($function == 'addCurrencies') {
	$response = array();
	$response['status'] = 'true';
	$title = $_REQUEST['title'];
	$from_currency_id = $_REQUEST['from_currency_id'];
	$to_currency_id = $_REQUEST['to_currency_id'];
	//$amount = $_REQUEST['amount'];
	$ask = $_REQUEST['ask'];
	$bid = $_REQUEST['bid'];
	$date = $_REQUEST['date'];
	$time = $_REQUEST['time'];
	$id = $_REQUEST['id'];
	$message = '';
	//die();
	if($id == '')
	{
		/*$stmt = $mysqli->prepare("INSERT INTO tbl_currencies(title, from_currency_id, to_currency_id, amount, date, time) VALUES (?, ?, ?, ?, ?, ?)");
		$stmt->bind_param('siidss', $title, $from_currency_id, $to_currency_id, $amount, $date, $time);*/
		
		$stmt = $mysqli->prepare("INSERT INTO tbl_currencies(title, from_currency_id, to_currency_id, ask, bid, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)");
		$stmt->bind_param('siissss', $title, $from_currency_id, $to_currency_id, $ask, $bid, $date, $time);

		if($stmt->execute())
		{
			$response['status'] = 'true';
			$response['message'] = 'Data Successfully Saved.';



/*********************************************************************************/
				/*****************************Sending GCM starts here*****************************/
				/*********************************************************************************/
				
					define("GOOGLE_API_KEY","AIzaSyBNGrnIiZ2SGkiKj1R-gZ30JnbZw8lTjgw");
					$registatoin_ids = array();
					$user_ids = array();
					$result = $mysqli->query("SELECT * FROM tbl_users");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['andriod_id'])){
							$registatoin_id[] = $resultRow['andriod_id'];
							$user_ids_registered[] = $resultRow['id'];
							$user_ids[] = $resultRow['id'];
							}
						}		
					}

					$result = $mysqli->query("SELECT * FROM tbl_android_ids");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['android_id'])){
							$registatoin_id[] = $resultRow['android_id'];
							}
						}		
					}

					$registatoin_ids = array_unique($registatoin_id);



					//$title = $_REQUEST['title'];
$title = 'kurdistanborsa';
					if($_REQUEST['sound'] == '0')
					{
						$sound = 'sound1';
					}
					else if($_REQUEST['sound'] == '1')
					{
						$sound = 'sound2';
					}
					else
					{
						$sound = 'sound3';
					}
					$img = 'http://www.newsread.in/wp-content/uploads/2016/06/Images-3.jpg';
$message='New currency added.';
					$msg = array ( 'message' => $message, 'title' => $title, 'sound' => $sound, 'soundname' => $sound, 'foreground' => false, 'coldstart' => true,'notId'=>''.time() );

						// Set POST variables
						$url = 'https://android.googleapis.com/gcm/send';

						$fields = array(
							'registration_ids' => $registatoin_ids,
							'data' => $msg,
						);

						$headers = array(
							'Authorization: key=' . GOOGLE_API_KEY,
							'Content-Type: application/json'
						);
						// Open connection
						$ch = curl_init();

						// Set the url, number of POST vars, POST data
						curl_setopt($ch, CURLOPT_URL, $url);

						curl_setopt($ch, CURLOPT_POST, true);
						curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

						// Disabling SSL Certificate support temporarly
						curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

						curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

						// Execute post	
					 	$result = curl_exec($ch);
						if ($result === FALSE) {
							die('Curl failed: ' . curl_error($ch));
						}

						// Close connection
						curl_close($ch);
						//echo $result;
						$tmpRes = json_decode($result);
						//echo $tmpRes->failure;
						/*if($tmpRes->failure==0) {
							foreach($user_ids_registered as $user_id)
							{
							$stmt = $mysqli->prepare("INSERT INTO tbl_notifications(user_id, title, message, created) VALUES (?, ?, ?, ?)");
							$created = date("Y-m-d H:i:s");
							$stmt->bind_param('isss', $user_id, $_REQUEST['title'], $_REQUEST['message'], $created); 
							$stmt->execute();
							}
						}
*/					
				
					/*********************************************************************************/
					/*****************************Sending GCM ends here*****************************/
					/*********************************************************************************/





		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Sorry! Something Went Wrong.';
		}
	}
	else 
	{
		$result = $mysqli->query("SELECT * FROM tbl_currencies where id = ".$id);

		if($result->num_rows > 0)
		{
			$row = $result->fetch_array(MYSQLI_BOTH);
			$title2 ='Currency Ask/Bid Update.';
			$message = '';
			if($ask > $row['ask']){
				$ask_arrow = 'u';
				$message.= 'Currency ask up.';
			}else if ($ask < $row['ask']){
				$ask_arrow = 'd';
				$message.= 'Currency ask down.';
			}
			else
			{
				$ask_arrow = $row['ask_arrow'];
			}
			
			if($bid > $row['bid']){
				$bid_arrow = 'u';
				$message.= 'Currency bid up.';
			}else if ($bid < $row['bid']){
				$bid_arrow = 'd';
				$message.= 'Currency bid down.';
			}
			else
			{
				$bid_arrow = $row['bid_arrow'];
			}
			
			//$stmt = $mysqli->prepare("UPDATE tbl_currencies SET title = ?, from_currency_id = ?, to_currency_id = ?, amount=?, arrow=?, date=?, time = ? WHERE id = ?");
			$stmt = $mysqli->prepare("UPDATE tbl_currencies SET title = ?, from_currency_id = ?, to_currency_id = ?, ask=?, ask_arrow=?, bid = ?, bid_arrow = ?, date=?, time = ? WHERE id = ?");
			//date_default_timezone_set("Asia/Kolkata"); 
			$datetime = date("Y-m-d H:i:s");
			$stmt->bind_param('siissssssi', $title, $from_currency_id, $to_currency_id, $ask, $ask_arrow, $bid, $bid_arrow, $date, $time, $id);
			//$stmt->bind_param('siidsssi', $title, $from_currency_id, $to_currency_id, $amount, $arrow, $date, $time, $id);

			if($stmt->execute())
			{
				$response['status'] = 'true';
				$response['message'] = 'Data Successfully Saved.';

				/*********************************************************************************/
				/*****************************Sending GCM starts here*****************************/
				/*********************************************************************************/
				$send_notification = 1;
				
				if($ask_update == 0 && $bid_update == 0)
				{
					$send_notification = 0;
				}
				if($send_notification == 1)
				{
					define("GOOGLE_API_KEY","AIzaSyBNGrnIiZ2SGkiKj1R-gZ30JnbZw8lTjgw");
					$registatoin_ids = array();
					$user_ids = array();
					$result = $mysqli->query("SELECT * FROM tbl_users");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['andriod_id'])){
							$registatoin_id[] = $resultRow['andriod_id'];
							$user_ids_registered[] = $resultRow['id'];
							$user_ids[] = $resultRow['id'];
							}
						}		
					}

					$result = $mysqli->query("SELECT * FROM tbl_android_ids");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['android_id'])){
							$registatoin_id[] = $resultRow['android_id'];
							}
						}		
					}

					$registatoin_ids = array_unique($registatoin_id);



					$title = $_REQUEST['title'];
					if($_REQUEST['sound'] == '0')
					{
						$sound = 'sound1';
					}
					else if($_REQUEST['sound'] == '1')
					{
						$sound = 'sound2';
					}
					else
					{
						$sound = 'sound3';
					}
					$img = 'http://www.newsread.in/wp-content/uploads/2016/06/Images-3.jpg';

					$msg = array ( 'message' => $message, 'title' => $title, 'sound' => $sound, 'soundname' => $sound, 'foreground' => false, 'coldstart' => true,'notId'=>''.time() );

						// Set POST variables
						$url = 'https://android.googleapis.com/gcm/send';

						$fields = array(
							'registration_ids' => $registatoin_ids,
							'data' => $msg,
						);

						$headers = array(
							'Authorization: key=' . GOOGLE_API_KEY,
							'Content-Type: application/json'
						);
						// Open connection
						$ch = curl_init();

						// Set the url, number of POST vars, POST data
						curl_setopt($ch, CURLOPT_URL, $url);

						curl_setopt($ch, CURLOPT_POST, true);
						curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

						// Disabling SSL Certificate support temporarly
						curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

						curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

						// Execute post	
					 	$result = curl_exec($ch);
						if ($result === FALSE) {
							die('Curl failed: ' . curl_error($ch));
						}

						// Close connection
						curl_close($ch);
						//echo $result;
						$tmpRes = json_decode($result);
						//echo $tmpRes->failure;
						if($tmpRes->failure==0) {
							foreach($user_ids_registered as $user_id)
							{
							$stmt = $mysqli->prepare("INSERT INTO tbl_notifications(user_id, title, message, created) VALUES (?, ?, ?, ?)");
							$created = date("Y-m-d H:i:s");
							$stmt->bind_param('isss', $user_id, $_REQUEST['title'], $_REQUEST['message'], $created); 
							$stmt->execute();
							}
						}
					}
				
					/*********************************************************************************/
					/*****************************Sending GCM ends here*****************************/
					/*********************************************************************************/
			}
			else
			{
				$response['status'] = 'false';
				$response['message'] = 'Sorry! Something Went Wrong.';
			}
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Something went wrong.';
		}
	}
	
	echo json_encode($response);
}

/********************Update 'Currencies' Function*********************************/
if($function == 'updateAllCurrencies') {
	$response = array();
	$response['status'] = 'true';
	$amount = $_REQUEST['amount'];
	$isask = $_REQUEST['isask'];
	$chkMinus = substr($amount,0,1);
	$message='';
	
	$result = $mysqli->query("SELECT * FROM tbl_currencies");
	
	if($isask == 1)
	{
		if($chkMinus == '-')
		{
			//$updatedAmount = substr($_REQUEST['amount'], 1);
			//$stmt = $mysqli->prepare("UPDATE tbl_currencies SET ask = ask - ?, ask_arrow = 'd'");
			$updatedAmount = substr($_REQUEST['amount'], 1);
			$message.= "All currencies ask rate are down.";
			if($result->num_rows > 0)
			{
				while($resultRow = $result->fetch_array())
				{
					$amount =  $resultRow['ask']-$updatedAmount;
					$stmt = $mysqli->prepare("UPDATE tbl_currencies SET ask = ?, ask_arrow = 'd' where id = ?");
					$stmt->bind_param('si', $amount, $resultRow['id']);
					$update = $stmt->execute();
				}		
			}
			
		}
		else
		{
			$updatedAmount = $_REQUEST['amount'];
			//$stmt = $mysqli->prepare("UPDATE tbl_currencies SET ask = ask + ?, ask_arrow = 'u'");
			$message.= "All currencies ask rate are up.";
			if($result->num_rows > 0)
			{
				while($resultRow = $result->fetch_array())
				{
					$amount = $updatedAmount + $resultRow['ask'];
					$stmt = $mysqli->prepare("UPDATE tbl_currencies SET ask = ?, ask_arrow = 'u' where id = ?");
					$stmt->bind_param('si', $amount, $resultRow['id']);
					$update = $stmt->execute();
				}		
			}
		}
	}
	else if($isask == 2)
	{
		if($chkMinus == '-')
		{
			$updatedAmount = substr($_REQUEST['amount'], 1);
			//$stmt = $mysqli->prepare("UPDATE tbl_currencies SET bid = bid - ?, bid_arrow = 'd'");
			$message.= "All currencies bid rate are down.";
			
			if($result->num_rows > 0)
			{
				while($resultRow = $result->fetch_array())
				{
					//$amount = $updatedAmount - $resultRow['bid'];
                                          $amount = $resultRow['bid']-$updatedAmount;
					$stmt = $mysqli->prepare("UPDATE tbl_currencies SET bid = ?, bid_arrow = 'd' where id = ?");
					$stmt->bind_param('si', $amount, $resultRow['id']);
					$update = $stmt->execute();
				}		
			}
		}
		else
		{
			$updatedAmount = $_REQUEST['amount'];
			//$stmt = $mysqli->prepare("UPDATE tbl_currencies SET bid = bid + ?, bid_arrow = 'u'");
			$message.= "All currencies bid rate are up.";
			
			if($result->num_rows > 0)
			{
				while($resultRow = $result->fetch_array())
				{
					$amount = $updatedAmount + $resultRow['bid'];
					$stmt = $mysqli->prepare("UPDATE tbl_currencies SET bid = ?, bid_arrow = 'u' where id = ?");
					$stmt->bind_param('si', $amount, $resultRow['id']);
					$update = $stmt->execute();
				}		
			}
		}
	}


	
	//date_default_timezone_set("Asia/Kolkata"); 
	$datetime = date("Y-m-d H:i:s");
	//$stmt->bind_param('s', $updatedAmount);
	if($update)
	{


	/****************GCM************************/
define("GOOGLE_API_KEY","AIzaSyBNGrnIiZ2SGkiKj1R-gZ30JnbZw8lTjgw");
					$registatoin_ids = array();
					$user_ids = array();
					$result = $mysqli->query("SELECT * FROM tbl_users");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['andriod_id'])){
							$registatoin_id[] = $resultRow['andriod_id'];
							$user_ids_registered[] = $resultRow['id'];
							$user_ids[] = $resultRow['id'];
							}
						}		
					}

					$result = $mysqli->query("SELECT * FROM tbl_android_ids");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['android_id'])){
							$registatoin_id[] = $resultRow['android_id'];
							}
						}		
					}

					$registatoin_ids = array_unique($registatoin_id);



					$title = 'All Currency Status';
					if($_REQUEST['sound'] == '0')
					{
						$sound = 'sound1';
					}
					else if($_REQUEST['sound'] == '1')
					{
						$sound = 'sound2';
					}
					else
					{
						$sound = 'sound3';
					}
					$img = 'http://www.newsread.in/wp-content/uploads/2016/06/Images-3.jpg';

					$msg = array ( 'message' => $message, 'title' => $title, 'sound' => $sound, 'soundname' => $sound, 'foreground' => false, 'coldstart' => true,'notId'=>''.time() );

						// Set POST variables
						$url = 'https://android.googleapis.com/gcm/send';

						$fields = array(
							'registration_ids' => $registatoin_ids,
							'data' => $msg,
						);

						$headers = array(
							'Authorization: key=' . GOOGLE_API_KEY,
							'Content-Type: application/json'
						);
						// Open connection
						$ch = curl_init();

						// Set the url, number of POST vars, POST data
						curl_setopt($ch, CURLOPT_URL, $url);

						curl_setopt($ch, CURLOPT_POST, true);
						curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

						// Disabling SSL Certificate support temporarly
						curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

						curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

						// Execute post	
					 $result = curl_exec($ch);
						if ($result === FALSE) {
							die('Curl failed: ' . curl_error($ch));
						}

						// Close connection
						curl_close($ch);
						//echo $result;
						$tmpRes = json_decode($result);
						//echo $tmpRes->failure;
						if($tmpRes->failure==0) {
							foreach($user_ids_registered as $user_id)
							{
							$stmt = $mysqli->prepare("INSERT INTO tbl_notifications(user_id, title, message, created) VALUES (?, ?, ?, ?)");
							$created = date("Y-m-d H:i:s");
							$stmt->bind_param('isss', $user_id, $_REQUEST['title'], $_REQUEST['message'], $created); 
							$stmt->execute();
							}
						}

/*******************************************/
		$response['status'] = 'true';
		$response['message'] = 'Data Successfully Saved.';
		$result = $mysqli->query("SELECT Cu . * , Co.alpha_2 AS from_flag, Co.currency_code AS from_currency_code, Cou.alpha_2 AS to_flag, Cou.currency_code AS to_currency_code FROM `tbl_currencies` AS Cu LEFT JOIN tbl_countries AS Co ON Cu.from_currency_id = Co.id LEFT JOIN tbl_countries AS Cou ON Cu.to_currency_id = Cou.id");
		
		if($result->num_rows > 0)
		{
			while($resultRow = $result->fetch_array())
			{
				$rows[] = $resultRow;
			}
			$i = 0;
			foreach($rows as $row)
			{
				$response['data'][$i]['id'] = $row['id'];
				$response['data'][$i]['title '] = $row['title'];
				$response['data'][$i]['from_currency_id'] = $row['from_currency_id'];
				$response['data'][$i]['from_currency_code'] = $row['from_currency_code'];
				$response['data'][$i]['to_currency_id'] = $row['to_currency_id'];
				$response['data'][$i]['to_currency_code'] = $row['to_currency_code'];
				//$response['data'][$i]['amount'] = floatval($row['amount']);
				$response['data'][$i]['ask'] = floatval($row['ask']);
				$response['data'][$i]['bid'] = floatval($row['bid']);
				$response['data'][$i]['date'] = $row['date'];
				$response['data'][$i]['time'] = $row['time'];
				$response['data'][$i]['from_flag'] = $row['from_flag'].'.png';
				$response['data'][$i]['to_flag'] = $row['to_flag'].'.png';
				$i++;
			}	

		}
		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Sorry! Something Went Wrong.';
	}
	
	echo json_encode($response);
}

/********************Delete 'Currencies' Function*********************************/
if($function == 'deleteCurrencies') {
	$response = array();
	$response['status'] = 'true';
	$id = $_REQUEST['id'];
	
	$stmt = $mysqli->prepare("DELETE FROM tbl_currencies WHERE id = ?");
	$stmt->bind_param('i', $id);
	if($stmt->execute())
	{
		$response['message'] = 'Deleted successfully';
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Please try again!!';
	}
	
	echo json_encode($response);
}


/********************Display 'Currencies' Function*********************************/
if($function == 'displayCurrencies') {
	$response = array();
	$response['status'] = 'true';
	//$result = $mysqli->query("SELECT * FROM tbl_adds where expiry_date >= now() and publish_date <= now()");
	$result = $mysqli->query("SELECT Cu . * , Co.alpha_2 AS from_flag, Co.currency_code AS from_currency_code, Cou.alpha_2 AS to_flag, Cou.currency_code AS to_currency_code
								FROM `tbl_currencies` AS Cu
								LEFT JOIN tbl_countries AS Co ON Cu.from_currency_id = Co.id
								LEFT JOIN tbl_countries AS Cou ON Cu.to_currency_id = Cou.id");
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			$rows[] = $resultRow;
		}
		$i = 0;
		foreach($rows as $row)
		{
			$response['data'][$i]['id'] = $row['id'];
			$response['data'][$i]['title '] = $row['title'];
			$response['data'][$i]['from_currency_id'] = $row['from_currency_id'];
			$response['data'][$i]['from_currency_code'] = $row['from_currency_code'];
			$response['data'][$i]['to_currency_id'] = $row['to_currency_id'];
			$response['data'][$i]['to_currency_code'] = $row['to_currency_code'];
			//$response['data'][$i]['amount'] = floatval($row['amount']);
			$response['data'][$i]['ask'] = ($row['ask']);
			$response['data'][$i]['bid'] = ($row['bid']);
			$response['data'][$i]['date'] = $row['date'];
			$response['data'][$i]['time'] = $row['time'];
			$response['data'][$i]['from_flag'] = $row['from_flag'].'.png';
			$response['data'][$i]['to_flag'] = $row['to_flag'].'.png';
			$i++;
		}
		
		
		
		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	
	$result1 = $mysqli->query("SELECT * FROM tbl_countries order by id");
		if($result1->num_rows > 0)
		{
			while($resultRow = $result1->fetch_array())
			{
				$rows1[] = $resultRow;
			}
			$i = 0;
			foreach($rows1 as $row)
			{
				$response['country'][$i]['id'] = $row['id'];
				$response['country'][$i]['name'] = $row['name'];
				$response['country'][$i]['flag'] = $row['alpha_2'].'.png';
				$response['country'][$i]['currency'] = $row['currency'];
				$response['country'][$i]['currency_code'] = $row['currency_code'];
				$i++;
			}		
		}
	
	echo json_encode($response);
}


/********************Add 'users' Function*********************************/
if($function == 'addUsers') {
    $response = array();
	$response['status'] = 'true';
	$type = $_REQUEST['type'];
	$first_name = $_REQUEST['first_name'];
	$last_name = $_REQUEST['last_name'];
	$username = $_REQUEST['username'];
	if($_REQUEST['password'] == '')
	{ $password = '';}
	else { $password = $_REQUEST['password']; }
	$contact = $_REQUEST['contact'];
	$address = $_REQUEST['address'];
	$company_name = $_REQUEST['company_name'];
	$id = $_REQUEST['id'];
	$expired = $_REQUEST['expired'];
	$is_active = $_REQUEST['is_active'];
	//echo strlen($_REQUEST['image']);
	//echo $_REQUEST['image'];

	$_REQUEST['image'] = str_replace(" ","+",$_REQUEST['image']);

	$myfile = fopen("test.txt", "w") or die("Unable to open file!");

	$txt = $_REQUEST['image'];
	fwrite($myfile, $txt);
	fclose($myfile);
	
	if($id == '')
	{
		$result = $mysqli->query("SELECT * FROM tbl_users where username = ".$username);
		if($result->num_rows <= 0)
		{
			if(isset($_REQUEST['image']) && ($_REQUEST['image'] != ''))
			{
				$rand = rand(1,999);
				$image_user = time()."_$rand.jpeg";
				$img = imagecreatefromstring(base64_decode($_REQUEST['image']));
				$image_loc = "assets/images/users/".$image_user;
				if($img != false)
				{
					   imagejpeg($img,$image_loc);
				} 
				$stmt = $mysqli->prepare("INSERT INTO tbl_users(type, first_name, last_name, username, password, contact, address, company_name, image, expired, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				$stmt->bind_param('sssssissssi', $type, $first_name, $last_name, $username, $password, $contact, $address, $company_name, $image_user, $expired, $is_active); 
			}
			else
			{
				$stmt = $mysqli->prepare("INSERT INTO tbl_users(type, first_name, last_name, username, password, contact, address, company_name, expired, is_active) VALUES (?, ?, ?, ?, ?, ?, ? , ?, ?, ?)");
				$stmt->bind_param('sssssisssi', $type, $first_name, $last_name, $username, $password, $contact, $address, $company_name, $expired, $is_active);
			}

			if($stmt->execute())
			{
				$response['status'] = 'true';
				$response['message'] = 'Data Successfully Saved.';
			}
			else
			{
				$response['status'] = 'false';
				$response['message'] = 'Sorry! Something Went Wrong.';
			}
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Sorry! User already exists.';	
		}
	}
	else
	{
		$result = $mysqli->query("SELECT * FROM tbl_users where id = ".$id);

		if($result->num_rows > 0)
		{
			if(isset($_REQUEST['image']) && ($_REQUEST['image'] != ''))
			{
				$rand = rand(1,999);
				$image_user = time()."_$rand.jpg";
				$img = imagecreatefromstring(base64_decode($_REQUEST['image']));
				$image_loc = "assets/images/adds/".$image_user;
				if($img != false)
				{
					imagejpeg($img,$image_loc);
				}  
				if($password != '')
				{
				$stmt = $mysqli->prepare("UPDATE tbl_users SET type = ?, first_name = ?, last_name = ?, username = ?, password = ?, contact = ?, address = ?, company_name = ?, image = ?, updated = ?, expired = ?, is_active = ? WHERE id = ?");
				//date_default_timezone_set("Asia/Kolkata"); 
				$datetime = date("Y-m-d H:i:s");
				$stmt->bind_param('sssssisssssii', $type, $first_name, $last_name, $username, $password, $contact, $address, $company_name, $image_user, $datetime, $expired, $is_active, $id);
				}
				else
				{
					$stmt = $mysqli->prepare("UPDATE tbl_users SET type = ?, first_name = ?, last_name = ?, username = ?, contact = ?, address = ?, company_name = ?, image = ?, updated = ?, expired = ?, is_active = ? WHERE id = ?");
				//date_default_timezone_set("Asia/Kolkata"); 
				$datetime = date("Y-m-d H:i:s");
				$stmt->bind_param('ssssisssssii', $type, $first_name, $last_name, $username, $contact, $address, $company_name, $image_user, $datetime, $expired, $is_active, $id);
				}
			}
			else
			{	
				if($password != '')
				{
				$stmt = $mysqli->prepare("UPDATE tbl_users SET type = ?, first_name = ?, last_name = ?, username=?, password = ?, contact = ?, address = ?, company_name = ?, updated = ?, expired = ?, is_active = ? WHERE id = ?");
				//date_default_timezone_set("Asia/Kolkata"); 
				$datetime = date("Y-m-d H:i:s");
				$stmt->bind_param('sssssissssii', $type, $first_name, $last_name, $username, $password, $contact, $address, $company_name, $datetime, $expired, $is_active, $id);
				}
				else
				{
				$stmt = $mysqli->prepare("UPDATE tbl_users SET type = ?, first_name = ?, last_name = ?, username=?, contact = ?, address = ?, company_name = ?, updated = ?, expired = ?, is_active =? WHERE id = ?");
				//date_default_timezone_set("Asia/Kolkata"); 
				$datetime = date("Y-m-d H:i:s");
				$stmt->bind_param('ssssissssii', $type, $first_name, $last_name, $username, $contact, $address, $company_name, $datetime, $expired, $is_active, $id);	
				}
			}
			if($stmt->execute())
			{
				$response['status'] = 'true';
				$response['message'] = 'Data Successfully Saved.';
			}
			else
			{
				$response['status'] = 'false';
				$response['message'] = 'Sorry! Something Went Wrong.';
			}
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Something went wrong.';
		}
	}
	echo json_encode($response);
}


/********************Display 'Users' Function*********************************/
if($function == 'displayUsers') {
	$response = array();
	$response['status'] = 'true';
	
	$result = $mysqli->query("SELECT * FROM tbl_users WHERE type = '".$_REQUEST['type']."'");
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			$rows[] = $resultRow;
		}
		$i = 0;
		foreach($rows as $row)
		{
			$expired = explode(' ', $row['expired']);
			$response['data'][$i]['id'] = $row['id'];
			//$response['data'][$i]['type'] = $row['type'];
			$response['data'][$i]['first_name'] = $row['first_name'];
			$response['data'][$i]['last_name'] = $row['last_name'];
			$response['data'][$i]['username'] = $row['username'];
			$response['data'][$i]['label'] = $row['username'];
			$response['data'][$i]['password'] = $row['password'];
			$response['data'][$i]['contact'] = floatval($row['contact']);
			$response['data'][$i]['address'] = $row['address'];
			$response['data'][$i]['company_name'] = $row['company_name'];
			$response['data'][$i]['is_active'] = intval($row['is_active']);
if($expired[0]=='0000-00-00'){
$expired[0]="";
 }


			$response['data'][$i]['expired'] = $expired[0];

			$response['data'][$i]['image'] = 'http://kurdistanborsa.com/currency_exchange/assets/images/users/'.$row['image'];
			$i++;
		}		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	
	echo json_encode($response);
}

/********************Delete 'Users' Function*********************************/
if($function == 'deleteUsers') {
	$response = array();
	$response['status'] = 'true';
	$id = $_REQUEST['id'];
	
	$stmt = $mysqli->prepare("DELETE FROM tbl_users WHERE id = ?");
	$stmt->bind_param('i', $id);
	if($stmt->execute())
	{
		$response['message'] = 'Deleted successfully';
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Please try again!!';
	}
	
	echo json_encode($response);
}

/********************Login Function*********************************/
/*http://kurdistanborsa.com/currency_exchange/webservices.php?function=compLogin&username=admin@gmail.com&password=12345*/
if($function == 'userLogin') {
	$response = array();
	$response['status'] = 'true';
	$username = $_REQUEST['username'];
	$password = $_REQUEST['password'];
	$andriod_id = $_REQUEST['andriod_id'];
	$uuid = $_REQUEST['uuid'];
	
	//$type = 'comp';
	//$andriod_device_id = $_REQUEST['android_device_id'];
	
	$result = $mysqli->query("SELECT * FROM tbl_users WHERE username = '".$username."' AND password = '".$password."' AND uuid = '".$uuid."'");
	//$result = $mysqli->query("SELECT * FROM tbl_users WHERE username = '".$username."' AND password = '".$password."'");
	if($result->num_rows > 0)
	{
		$row = $result->fetch_array(MYSQLI_BOTH);
		$today = date("Y-m-d H:i:s");
		//echo strtotime($row['expired']);
		//echo $row['expired'];
		//echo strtotime($today);
		
			
		if($row['is_active'] == 0)
		{
			$response['status'] = 'false';
			$response['message'] = 'Your account is no more active.';
		}else if (strtotime($row['expired']) < strtotime($today))
		{
			$response['status'] = 'false';
			$response['message'] = 'Login Expired.';
		}
		else
		{
			$stmt = $mysqli->prepare("UPDATE tbl_users SET andriod_id = ?, updated = ? WHERE id = ?");
			//date_default_timezone_set("Asia/Kolkata"); 
			$datetime = date("Y-m-d H:i:s");
			$stmt->bind_param('ssi', $andriod_id, $datetime, $row['id']);
			$stmt->execute();
			$response['data']['id'] = $row['id'];
		}
		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Invalid Username or Password.';
	}
	echo json_encode($response);
	
}


/********************Show 'Adds' Function*********************************/
if($function == 'showAdds') {
	$response = array();
	$response['status'] = 'true';
	
	$result = $mysqli->query("SELECT * FROM `tbl_adds` WHERE CURDATE( ) BETWEEN `publish_date` AND `expiry_date` Limit 0,5");
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			$rows[] = $resultRow;
		}
		$i = 0;
		foreach($rows as $row)
		{
			$response['data'][$i]['id'] = $row['id'];
			//$response['data'][$i]['type'] = $row['type'];
			$response['data'][$i]['name'] = $row['name'];
			$response['data'][$i]['publish_date'] = $row['publish_date'];
			$response['data'][$i]['expiry_date'] = $row['expiry_date'];
			$response['data'][$i]['image'] = 'http://kurdistanborsa.com/currency_exchange/assets/images/adds/'.$row['image'];
			$i++;
		}		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	
	echo json_encode($response);
}





/********************'Send Notification' Function*********************************/
if($function == 'sendNotification') {
	define("GOOGLE_API_KEY","AIzaSyBNGrnIiZ2SGkiKj1R-gZ30JnbZw8lTjgw");
	$registatoin_ids = array();
	$user_ids = array();
	if($_REQUEST['is_all'] == 'true')
	{
	//$result = $mysqli->query("SELECT * FROM tbl_users WHERE andriod_id != ''");
	$result = $mysqli->query("SELECT * FROM tbl_users");
	}
	else
	{
	$result = $mysqli->query("SELECT * FROM tbl_users WHERE id IN (".$_REQUEST['users'].")");	
	}
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			if(!empty($resultRow['andriod_id'])){
			$registatoin_id[] = $resultRow['andriod_id'];
			$user_ids[] = $resultRow['id'];
			}
		}		
	}

	$result = $mysqli->query("SELECT * FROM tbl_android_ids");
					if($result->num_rows > 0)
					{
						while($resultRow = $result->fetch_array())
						{
							if(!empty($resultRow['android_id'])){
							$registatoin_id[] = $resultRow['android_id'];
							}
						}		
					}

					$registatoin_ids = array_unique($registatoin_id);
	$registatoin_ids = array_values($registatoin_ids);
	//print_r($registatoin_ids);
	
	$title = $_REQUEST['title'];
	if($_REQUEST['sound'] == '0')
	{
		$sound = 'sound1';
	}
	else if($_REQUEST['sound'] == '1')
	{
		$sound = 'sound2';
	}
	else
	{
		$sound = 'sound3';
	}
	$img = 'http://www.newsread.in/wp-content/uploads/2016/06/Images-3.jpg';

	$msg = array ( 'message' => $_REQUEST['message'], 'title' => $_REQUEST['title'], 'sound' => $sound, 'soundname' => $sound, 'foreground' => false, 'coldstart' => true,'notId'=>''.time() );
	
        // Set POST variables
        $url = 'https://android.googleapis.com/gcm/send';
 
        $fields = array(
            'registration_ids' => $registatoin_ids,
            'data' => $msg,
        );
 
        $headers = array(
            'Authorization: key=' . GOOGLE_API_KEY,
            'Content-Type: application/json'
        );
        // Open connection
        $ch = curl_init();
 
        // Set the url, number of POST vars, POST data
        curl_setopt($ch, CURLOPT_URL, $url);
 
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 
        // Disabling SSL Certificate support temporarly
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
 
        // Execute post	
	 $result = curl_exec($ch);
        if ($result === FALSE) {
            die('Curl failed: ' . curl_error($ch));
        }
 
        // Close connection
        curl_close($ch);
        echo $result;
        $tmpRes = json_decode($result);
        //echo $tmpRes->failure;
        if($tmpRes->failure==0) {
        	foreach($user_ids as $user_id)
			{
        	$stmt = $mysqli->prepare("INSERT INTO tbl_notifications(user_id, title, message, created) VALUES (?, ?, ?, ?)");
        	$created = date("Y-m-d H:i:s");
			$stmt->bind_param('isss', $user_id, $_REQUEST['title'], $_REQUEST['message'], $created); 
			$stmt->execute();
			}
        }
     
    }


/********************Show 'searchUsers' Function*********************************/
if($function == 'searchUsers') {
	$response = array();
	$response['status'] = 'true';
	
	$search_string = $_REQUEST['search_string'];
	
	$result = $mysqli->query("SELECT * FROM `tbl_users` WHERE `username` LIKE '%".$search_string."%' OR `contact` LIKE '%".$search_string."%'");
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			$rows[] = $resultRow;
		}
		$i = 0;
		foreach($rows as $row)
		{
			$response['data'][$i]['id'] = $row['id'];
			//$response['data'][$i]['type'] = $row['type'];
			$response['data'][$i]['name'] = $row['name'];
			$response['data'][$i]['publish_date'] = $row['publish_date'];
			$response['data'][$i]['expiry_date'] = $row['expiry_date'];
			$response['data'][$i]['image'] = 'http://kurdistanborsa.com/currency_exchange/assets/images/adds/'.$row['image'];
			$i++;
		}		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'No data found.';
	}
	
	echo json_encode($response);
}
/*
SELECT *
FROM `tbl_users`
WHERE `username` LIKE '%ge%'
OR `contact` LIKE '%ge%'
*/



/********************Show 'Currencies' Function*********************************/
if($function == 'showCurrencies'){
	$response = array();
	$response['status'] = 'true';
	$user_id = $_REQUEST['user_id'];
	//$result = $mysqli->query("SELECT * FROM tbl_adds where expiry_date >= now() and publish_date <= now()");

	if($_REQUEST['logged_in'] == '0'){

		$result = $mysqli->query("SELECT * from tbl_android_ids where android_id = '".$_REQUEST['android_id']."' ");

	if($result->num_rows == 0)
		{

		$stmt = $mysqli->prepare("INSERT INTO tbl_android_ids(android_id, created) VALUES ( ?, ?)");
        	$created = date("Y-m-d H:i:s");
			$stmt->bind_param('ss',$_REQUEST['android_id'], $created); 
			$stmt->execute();
		}

	}else{
		$stmt2 = $mysqli->prepare("delete from tbl_android_ids where android_id = ? ");
			$stmt2->bind_param('s',$_REQUEST['android_id']); 
			$stmt2->execute();
	}

	$result = $mysqli->query("SELECT Cu . * , Co.alpha_2 AS from_flag, Co.currency_code AS from_currency_code, Cou.alpha_2 AS to_flag, Cou.currency_code AS to_currency_code
								FROM `tbl_currencies` AS Cu
								LEFT JOIN tbl_countries AS Co ON Cu.from_currency_id = Co.id
								LEFT JOIN tbl_countries AS Cou ON Cu.to_currency_id = Cou.id");
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			$rows[] = $resultRow;
		}
		$i = 0;
		foreach($rows as $row)
		{
			$response['data'][$i]['id'] = $row['id'];
			$response['data'][$i]['title '] = $row['title'];
			$response['data'][$i]['from_currency_id'] = $row['from_currency_id'];
			$response['data'][$i]['from_currency_code'] = $row['from_currency_code'];
			$response['data'][$i]['to_currency_id'] = $row['to_currency_id'];
			$response['data'][$i]['to_currency_code'] = $row['to_currency_code'];
			//$response['data'][$i]['amount'] = floatval($row['amount']);
			$response['data'][$i]['ask'] = floatval($row['ask']);
			$response['data'][$i]['bid'] = floatval($row['bid']);
			$response['data'][$i]['date'] = $row['date'];
			$response['data'][$i]['time'] = $row['time'];
			$response['data'][$i]['from_flag'] = $row['from_flag'].'.png';
			$response['data'][$i]['to_flag'] = $row['to_flag'].'.png';
			
			if($row['bid_arrow']=='u') {
			$response['data'][$i]['bid_arrow'] = 1;
			} else {
			$response['data'][$i]['bid_arrow'] = 0;
			}
			
			if($row['ask_arrow']=='u') {
			$response['data'][$i]['ask_arrow'] = 1;
			} else {
			$response['data'][$i]['ask_arrow'] = 0;
			}
			
			$i++;
		}

		$result2 = $mysqli->query("SELECT * FROM tbl_settings WHERE setting = 'user_signup' ");
		if($result->num_rows > 0)
	{
		$row2 = $result2->fetch_array(MYSQLI_BOTH);
		$response['signupCheck'] = $row2['active'];
	}
	if(!empty($user_id)){
		
		$result3 = $mysqli->query("SELECT * FROM tbl_users where expired >= now() and id = '$user_id' ;");
		if($result->num_rows > 0){
			$response['expired'] = 1;
		}else{
			$response['expired'] = 0;
		}
	}else{
		$response['expired'] = 0;
	}
		
		
		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	
	echo json_encode($response);
}



/********************Show 'notifications' Function*********************************/
if($function == 'showNotifications') {
	$response = array();
	$response['status'] = 'true';
	
	
	$result = $mysqli->query("SELECT * FROM `tbl_notifications` WHERE user_id = ".$_REQUEST['user_id']." ORDER BY `tbl_notifications`.`created` DESC ");
	if($result->num_rows > 0)
	{
		while($resultRow = $result->fetch_array())
		{
			$rows[] = $resultRow;
		}
		$i = 0;
		foreach($rows as $row)
		{
			
			$response['data'][$i]['title'] = $row['title'];
			//$response['data'][$i]['type'] = $row['type'];
			$response['data'][$i]['date'] = $row['created'];
			$response['data'][$i]['info'] = [];
			$response['data'][$i]['info'][0]['title'] = $row['title'];
			$response['data'][$i]['info'][0]['message'] = $row['message'];
			$response['data'][$i]['info'][0]['date'] = $row['created'];
			$i++;
		}		
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Something went wrong.';
	}
	
	echo json_encode($response);
}







/********************Add 'userSignup' Function*********************************/
if($function == 'userSignup') {
    $response = array();
	$response['status'] = 'true';
	$type = $_REQUEST['type'];
	$username = $_REQUEST['username'];
	$password = $_REQUEST['password'];
	$contact = $_REQUEST['contact'];
	$uuid = $_REQUEST['uuid'];


	$result = $mysqli->query("SELECT * FROM tbl_users where username = ".$username);
	if($result->num_rows <= 0)
	{	
		$result = $mysqli->query("SELECT * FROM tbl_users where contact = ".$contact);
		if($result->num_rows <= 0)
		{
			$stmt = $mysqli->prepare("INSERT INTO tbl_users(type, username, password, contact, uuid) VALUES (?, ?, ?, ?, ?)");
			$stmt->bind_param('sssis', $type, $username, $password, $contact, $uuid);


			if($stmt->execute())
			{
				
$response['message'] = 'Successfully registered.';				
$_REQUEST['title'] = 'Kurdistan Borsa';
				if($type == 'cust')
				{
					$_REQUEST['message'] = 'New customer is registered on Kurdistan Borsa.';
				}
				else
				{
					$_REQUEST['message'] = 'New company is registered on Kurdistan Borsa.';
				}
				
				/*************************Push notification to ADMIN starts here******************************/
				
				define("GOOGLE_API_KEY","AIzaSyBeXnP5ceSDYJO_EUddbh4OCIL3D-iLSZw");
				$registatoin_ids = array();
				$user_ids = array();
				$result = $mysqli->query("SELECT * FROM tbl_admin");
				
				if($result->num_rows > 0)
				{
					while($resultRow = $result->fetch_array())
					{
						if(!empty($resultRow['andriod_id'])){
						$registatoin_id[] = $resultRow['andriod_id'];
						}
					}		
				}
				//$img = 'http://www.newsread.in/wp-content/uploads/2016/06/Images-3.jpg';
 


				$msg = array ( 'message' => $_REQUEST['message'], 'title' => $_REQUEST['title'], 'notId'=>''.time() );

					// Set POST variables
					$url = 'https://android.googleapis.com/gcm/send';

					$fields = array(
						'registration_ids' => $registatoin_ids,
						'data' => $msg,
					);

					$headers = array(
						'Authorization: key=' . GOOGLE_API_KEY,
						'Content-Type: application/json'
					);
					// Open connection
					$ch = curl_init();

					// Set the url, number of POST vars, POST data
					curl_setopt($ch, CURLOPT_URL, $url);

					curl_setopt($ch, CURLOPT_POST, true);
					curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

					// Disabling SSL Certificate support temporarly
					curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

					curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

					// Execute post	
				 $result = curl_exec($ch);
					if ($result === FALSE) {
						die('Curl failed: ' . curl_error($ch));
					}

					// Close connection
					curl_close($ch);
					//echo $result;
					$tmpRes = json_decode($result);
					//echo $tmpRes->failure;
					/*if($tmpRes->failure==0) {
						foreach($user_ids as $user_id)
						{
						$stmt = $mysqli->prepare("INSERT INTO tbl_notifications(user_id, title, message, created) VALUES (?, ?, ?, ?)");
						$created = date("Y-m-d H:i:s");
						$stmt->bind_param('isss', $user_id, $_REQUEST['title'], $_REQUEST['message'], $created); 
						$stmt->execute();
						}
					}*/
				
				/***********************Push notification to ADMIN ends here********************************/
				
				
				
				
				
				
			}
			else
			{
				$response['status'] = 'false';
				$response['message'] = 'Sorry! Something Went Wrong.';
			}
		}
		else
		{
			$response['status'] = 'false';
			$response['message'] = 'Sorry! Phone number already exists.';	
		}
	}
	else
	{
		$response['status'] = 'false';
		$response['message'] = 'Sorry! Username already exists.';	
	}
	
	echo json_encode($response);
}
?>