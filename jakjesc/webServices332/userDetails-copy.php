<?php
include('config.php');


$data = json_decode(file_get_contents("php://input"));
  
if (isset($data)) {
	
$userId = $data->userId;

	 //$userSql = "SELECT * FROM `jos_jakjesc_zamowienie` where id_user = '$userId' and  potwierdzone = 1 ";

	 $userSql = "SELECT jos_jakjesc_zestaw.nazwa,jos_jakjesc_zestaw.opis,jos_jakjesc_zamowienie.name,jos_jakjesc_zamowienie.data_dod,jos_jakjesc_zamowienie.data_od,jos_jakjesc_zamowienie.data_do,jos_jakjesc_zamowienie.cena,jos_jakjesc_zamowienie.name,jos_jakjesc_zamowienie.email,jos_jakjesc_zamowienie.potwierdzone,jos_jakjesc_zamowienie.liczba_dni,jos_jakjesc_zamowienie.kolejnosc,jos_jakjesc_zamowienie.adres,jos_jakjesc_zamowienie.adres_alternatywny,jos_jakjesc_zamowienie.kod_pocztowy,jos_jakjesc_zamowienie.miejscowosc,jos_jakjesc_zamowienie.telefon,jos_jakjesc_zamowienie.cena_regularna,jos_jakjesc_zamowienie.waga,jos_jakjesc_zamowienie.wzrost,jos_jakjesc_zamowienie.waga_cel,jos_jakjesc_zamowienie.sport FROM jos_jakjesc_zamowienie LEFT JOIN jos_jakjesc_zestaw ON jos_jakjesc_zamowienie.id_zestaw = jos_jakjesc_zestaw.id_zestaw where jos_jakjesc_zamowienie.id_user = '$userId' and  jos_jakjesc_zamowienie.potwierdzone = 1"; 
	 mysql_set_charset("UTF8");
	 
	 $result=mysql_query($userSql);
	$fetchResult = mysql_fetch_array($result, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);	
	//print_r($fetchResult);
	
	if($fetchResult){	
		$getdata =array('status'=>'Success','mesg'=>'Show User Details','response'=>$fetchResult);	
	}else{
		$getdata = array('status'=>'Fail','message'=>'There is No Details found in database. Status is Pending','response'=>'Fail');	
	}
	echo json_encode($getdata); 	
	
}
?>