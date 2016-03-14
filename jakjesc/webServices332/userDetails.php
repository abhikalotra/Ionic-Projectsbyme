<?php
include('config.php');


$data = json_decode(file_get_contents("php://input"));
  
if (isset($data)) {
	
 	
$userId = $data->userId;
	 //$userSql = "SELECT * FROM `jos_jakjesc_zamowienie` where id_user = '$userId' and  potwierdzone = 1 ";
	 $userSql1 = "SELECT jos_jakjesc_zestaw.nazwa,jos_jakjesc_zestaw.opis,jos_jakjesc_zamowienie.name,jos_jakjesc_zamowienie.data_dod,jos_jakjesc_zamowienie.data_od,jos_jakjesc_zamowienie.data_do,jos_jakjesc_zamowienie.cena,jos_jakjesc_zamowienie.name,jos_jakjesc_zamowienie.email,jos_jakjesc_zamowienie.potwierdzone,jos_jakjesc_zamowienie.liczba_dni,jos_jakjesc_zamowienie.kolejnosc,jos_jakjesc_zamowienie.adres,jos_jakjesc_zamowienie.adres_alternatywny,jos_jakjesc_zamowienie.kod_pocztowy,jos_jakjesc_zamowienie.miejscowosc,jos_jakjesc_zamowienie.telefon,jos_jakjesc_zamowienie.cena_regularna,jos_jakjesc_zamowienie.waga,jos_jakjesc_zamowienie.wzrost,jos_jakjesc_zamowienie.waga_cel,jos_jakjesc_zamowienie.sport FROM jos_jakjesc_zamowienie LEFT JOIN jos_jakjesc_zestaw ON jos_jakjesc_zamowienie.id_zestaw = jos_jakjesc_zestaw.id_zestaw where jos_jakjesc_zamowienie.id_user = '$userId' and  jos_jakjesc_zamowienie.potwierdzone = 1"; 
	 mysql_set_charset("UTF8");	 
	 $result1=mysql_query($userSql1);
	$fetchResult1 = mysql_fetch_array($result1, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);	
	
	// get the id_zamowienie id 
	$userSql2 = "SELECT * FROM `jos_jakjesc_zamowienie` where id_user = '$userId'"; 
	$result2=mysql_query($userSql2);
	$fetchResult2 = mysql_fetch_array($result2);		 
	$id_zamowienie = $fetchResult2['id_zamowienie'];
	
	
	//for no. of remaining days---------
	$userSql3 = "select count(distinct dzien) as pozostalo_dni from jos_jakjesc_zamowienie left join jos_jakjesc_zamowienie_dzien on jos_jakjesc_zamowienie_dzien.id_zamowienie = jos_jakjesc_zamowienie.id_zamowienie where jos_jakjesc_zamowienie.id_zamowienie = '$id_zamowienie' and dzien > now()"; 
	$result3=mysql_query($userSql3);
	$fetchResult3 = mysql_fetch_array($result3);		 
	$pozostalo_dni = $fetchResult3['pozostalo_dni'];
	if($pozostalo_dni){
		$remaingDays = $pozostalo_dni; 
	}else{
		$remaingDays = 0; 
	}
		
	//for no. of next days name by name ---------
	$userSql4 = "select distinct dzien as dzien from jos_jakjesc_zamowienie left join jos_jakjesc_zamowienie_dzien on jos_jakjesc_zamowienie_dzien.id_zamowienie = jos_jakjesc_zamowienie.id_zamowienie where jos_jakjesc_zamowienie.id_zamowienie = '$id_zamowienie' and dzien >= CURDATE()"; 
	$result4=mysql_query($userSql4);
	
	$emparray4 = array();
	 while($fetchResult4 = mysql_fetch_array($result4, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE)){
		 
		   $emparray4[] = $fetchResult4;
	 }
		
		
		
	//for no. of Previous days name by name  Running---------
	$userSql5 = "select distinct dzien as dzien from jos_jakjesc_zamowienie left join jos_jakjesc_zamowienie_dzien on jos_jakjesc_zamowienie_dzien.id_zamowienie = jos_jakjesc_zamowienie.id_zamowienie where jos_jakjesc_zamowienie.id_zamowienie = '$id_zamowienie' and dzien < CURDATE()"; 
	$result5=mysql_query($userSql5);
	
	$emparray5 = array();
	 while($fetchResult5 = mysql_fetch_array($result5, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE)){
		 
		   $emparray5[] = $fetchResult5;
	 }
	
	
	
	// no of booking dates
	$userSql = "SELECT distinct(dzien) FROM jos_jakjesc_zamowienie_dzien zd, jos_jakjesc_posilek_rodzaj pr WHERE zd.id_posilek_rodzaj=pr.id_posilek_rodzaj AND id_zamowienie= '$id_zamowienie' order by dzien asc"; 
	mysql_set_charset("UTF8");	 
	 $result=mysql_query($userSql);
	 
	  $emparray = array();
	 while($fetchResult = mysql_fetch_array($result, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE)){
		 
		   $emparray[] = $fetchResult;
	 }
	
	
	 if($emparray4 || $emparray5){	 
		$getdata =array('status'=>'Success','mesg'=>'Show User Details','responseDate'=>$emparray4,'responsePreviousDate'=>$emparray5,'responseDetails'=>$fetchResult1,'remaingDays'=>$remaingDays);	
	}else{
		$getdata = array('status'=>'Fail','message'=>'There is No Details found in database. Status is Pending','response'=>'Fail');	
	} 
	echo json_encode($getdata); 
	
	
	
}
?>