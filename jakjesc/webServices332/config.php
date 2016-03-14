<?php
$dbHost  = "localhost";
$dbLogin = "narcin_clonejj";
$dbPwd   = "hVAwi26U";
$dbName  = "narcin_clonejj";

$conn = mysql_connect($dbHost,$dbLogin,$dbPwd);

$dbConn = mysql_select_db($dbName);
if($dbConn){
	//echo "Connection Sucessfull"; 
}else{
	  echo "DB Connection failed";
}  

	 if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
		header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept'); 
		 /* header('Content-Type: application/json; charset=utf-8');  */
		 header('Content-type: text/html; charset=utf-8');
		
    }
 
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
 
        exit(0);
    } 
	
	/*   $response = new Response(json_encode(array('users' =>$user)));
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Content-Type', 'application/json'); */
	
?>