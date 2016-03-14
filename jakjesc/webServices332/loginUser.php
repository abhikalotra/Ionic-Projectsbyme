<?php
 include('config.php');

$data = json_decode(file_get_contents("php://input"));
 if (isset($data)) {
	 
$email =    $data->email;
$password = $data->password; 
	
	
define( '_JEXEC', 1 );
define('JPATH_BASE', '../' ); 
define( 'DS', DIRECTORY_SEPARATOR );
require_once('../configuration.php');
require_once ( JPATH_BASE .DS.'includes'.DS.'defines.php' );
require_once ( JPATH_BASE .DS.'includes'.DS.'framework.php' );
require_once ( JPATH_BASE .DS.'libraries'.DS.'joomla'.DS.'factory.php' );

// Hardcoded for now
$credentials['username'] = $email;
$credentials['password'] = $password;

// Get a database object
$db    = JFactory::getDbo();
$query = $db->getQuery(true)
    ->select('id, password')
    ->from('jos_users')
    ->where('username=' . $db->quote($credentials['username']));

$db->setQuery($query);
$result = $db->loadObject();

if ($result)
{
    $match = JUserHelper::verifyPassword($credentials['password'], $result->password, $result->id);

    if ($match === true)
    {
        // Bring this in line with the rest of the system
        $user = JUser::getInstance($result->id);
		$data =array('status'=>'Success','mesg'=>'User have been Successfully Login','response'=>$user);	
    }
    else
    {
      $data = array('status'=>'Fail','message'=>'Wrong Email Address or Password','response'=>'Fail');	
    }
	
	echo json_encode($data);
}

	
}

/* include('config.php');

$data = json_decode(file_get_contents("php://input"));
  
if (isset($data)) {
	
$email =    $data->email;
$password = $data->password;
	
	$sql="SELECT * FROM jos_users WHERE email='$email' and password='$password' ";
	$result=mysql_query($sql);
	$fetchResult = mysql_fetch_array($result);
	if($fetchResult){	
		$data =array('status'=>'Success','mesg'=>'User have been Successfully Login','response'=>$fetchResult);	
	}else{
		$data = array('status'=>'Fail','message'=>'Wrong Email Address or Password','response'=>'Fail');	
	}
	echo json_encode($data);
	//return $userSqlQuery;		
} */

?>