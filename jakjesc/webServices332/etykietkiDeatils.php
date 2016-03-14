<?php
include('config.php');


$data = json_decode(file_get_contents("php://input"));
  
if (isset($data)) {
$userId = $data->userId;
 $selectdate = $data->selectdate;	
 $getDayName = $data->getDayName;	

$exp1 = explode("T",$selectdate);
$getDate = $exp1[0];

$exp2 = explode("-",$getDate);
$finalYear = $exp2[0];
$finalMonth = $exp2[1];
$finalDate = $exp2[2]+1;

  $userSql = "select
    d.id_zamowienie,     z.kolejnosc,    d.dzien,    d.id_posilek_rodzaj,    posilek.posilek_rodzaj,    d.opis opis_dania,    d.nazwa nazwa_dania,    d.suma_kalorii,     z.id_user,    z.name,    p.imie,    p.nazwisko,    h.godzina,     z.name,     z.godzina_od,     z.godzina_do,     z.adres,     z.uwagi_do_adresu,     z.kod_pocztowy,     z.miejscowosc,     z.adres_alternatywny,     z.uwagi_do_adresu_alternatywnego,     z.drukuj_adres_alternatywny,     z.telefon,    zest.nazwa nazwa_zestawu     
from
    jos_jakjesc_zamowienie_dzien d
    join
    jos_jakjesc_zamowienie z
        on d.id_zamowienie = z.id_zamowienie
    join
    jos_users u
        on u.id = z.id_user
    join
    jos_jakjesc_zestaw zest
        on zest.id_zestaw = z.id_zestaw
    join
    jos_profil p
        on p.id = z.id_user
    join
    jos_jakjesc_posilek_rodzaj posilek
        on d.id_posilek_rodzaj = posilek.id_posilek_rodzaj
    left outer join
    jos_jakjesc_zamowienie_posilek_godzina h
        on h.id_zamowienie = z.id_zamowienie
        and
        h.id_posilek_rodzaj = posilek.id_posilek_rodzaj
        
     where    z.id_user = '$userId' and     d.dzien = '$finalYear-$finalMonth-$finalDate'"; 
	 mysql_set_charset("UTF8");
	 
	 $result=mysql_query($userSql);
	$fetchResult = mysql_fetch_array($result, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);	
	//print_r($fetchResult);
	
	if($fetchResult){	
		$getdata =array('status'=>'Success','mesg'=>'Show User Details','getDayName'=>$getDayName,'response'=>$fetchResult);	
	}else{
		$getdata = array('status'=>'Fail','message'=>'There is No Details found in database. Status is Pending','response'=>'Fail');	
	} 
	echo json_encode($getdata); 	
	
}
?>