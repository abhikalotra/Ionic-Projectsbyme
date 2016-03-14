<?php
include('config.php');


$data = json_decode(file_get_contents("php://input"));
  
if (isset($data)) {
$userId = $data->userId;
 $selectdate = $data->selectdate;	
 $getDayName = $data->getDayName;	
 $DrugiesniadanieId = $data->DrugiesniadanieId;	

$exp1 = explode("T",$selectdate);
$getDate = $exp1[0];

$exp2 = explode("-",$getDate);
$finalYear = $exp2[0];
$finalMonth = $exp2[1];
$finalDate = $exp2[2]+1;


 

 $finalGetdate = date("Y-m-d");
 //$finalGetdate = "2016-03-07";


 // get the id_zamowienie id 
	$userSql2 = "SELECT * FROM `jos_jakjesc_zamowienie` where id_user = '$userId'"; 
	$result2=mysql_query($userSql2);
	$fetchResult2 = mysql_fetch_array($result2);		 
	$id_zamowienie = $fetchResult2['id_zamowienie'];
	
	
	//for no. of remaining days---------
	$userSql3 = "select distinct dzien as pozostalo_dni from jos_jakjesc_zamowienie left join jos_jakjesc_zamowienie_dzien on jos_jakjesc_zamowienie_dzien.id_zamowienie = jos_jakjesc_zamowienie.id_zamowienie where jos_jakjesc_zamowienie.id_zamowienie = '$id_zamowienie' and dzien < now() order by pozostalo_dni desc "; 
	$result3=mysql_query($userSql3);
	$fetchResult3 = mysql_fetch_array($result3);		 
 	$pozostalo_dni = $fetchResult3['pozostalo_dni'];
	
	if($pozostalo_dni == $finalGetdate){		
		$remaingDays = $pozostalo_dni; 
		
		
	$userSql4 = "select distinct dzien as pozostalo_dni  from jos_jakjesc_zamowienie left join jos_jakjesc_zamowienie_dzien on jos_jakjesc_zamowienie_dzien.id_zamowienie = jos_jakjesc_zamowienie.id_zamowienie where jos_jakjesc_zamowienie.id_zamowienie = '$id_zamowienie' and dzien < now() order by pozostalo_dni desc limit 1,1"; 
	$result4=mysql_query($userSql4);
	$fetchResult4 = mysql_fetch_array($result4);
	$pozostalo_dni4 = $fetchResult4['pozostalo_dni'];
	
	//Get day name Start
	$Getdaysql5 = " SELECT distinct dzien as pozostalo_dni, DAYNAME('$pozostalo_dni4') as dayName FROM jos_jakjesc_zamowienie left join jos_jakjesc_zamowienie_dzien on jos_jakjesc_zamowienie_dzien.id_zamowienie = jos_jakjesc_zamowienie.id_zamowienie where jos_jakjesc_zamowienie.id_zamowienie = '$id_zamowienie' and dzien < now() order by pozostalo_dni desc limit 1,1 "; 
	$Getdayresult5=mysql_query($Getdaysql5);
	$GetdayfetchResult5 = mysql_fetch_array($Getdayresult5);
	$dayName = $GetdayfetchResult5['dayName'];	
		 $dayGet = $dayName;
		  $a = array(	
			"niedziela" => "Sunday",
			"poniedzialek" => "Monday",
			"wtorek" => "Tuesday",
			"sroda" => "Wednesday",
			"czwartek" => "Thursday",
			"piątek" => "Friday",
			 "sobota" => "Saturday",	
			 );
		$getDayNames =  array_search($dayGet, $a);
	

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
        
     where    z.id_user = '$userId' and  d.dzien = '$pozostalo_dni4' and d.id_posilek_rodzaj = '$DrugiesniadanieId'";
	 
	 mysql_set_charset("UTF8");
	 
	 $result=mysql_query($userSql);
	$fetchResult = mysql_fetch_array($result, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);	
			if($fetchResult){	
				$getdata =array('status'=>'Success','mesg'=>'Show Second breakfast Details','getDay'=>$getDayNames,'response'=>$fetchResult);	
				}else{
					$underDevelopement = "Twoje Menu jest w trakcie opracowywania";
					$getdata = array('status'=>'SuccessUnder','message'=>'Your menu is under development','response'=>$underDevelopement);	
				} 	
	
			
	}else{
		
		
		$userSql4 = "select distinct dzien as pozostalo_dni  from jos_jakjesc_zamowienie left join jos_jakjesc_zamowienie_dzien on jos_jakjesc_zamowienie_dzien.id_zamowienie = jos_jakjesc_zamowienie.id_zamowienie where jos_jakjesc_zamowienie.id_zamowienie = '$id_zamowienie' and dzien < now() order by pozostalo_dni desc limit 0,1"; //1,1
	$result4=mysql_query($userSql4);
	$fetchResult4 = mysql_fetch_array($result4);
	$pozostalo_dni4 = $fetchResult4['pozostalo_dni'];
	
	//Get day name Start
	$Getdaysql5 = " SELECT distinct dzien as pozostalo_dni, DAYNAME('$pozostalo_dni4') as dayName FROM jos_jakjesc_zamowienie left join jos_jakjesc_zamowienie_dzien on jos_jakjesc_zamowienie_dzien.id_zamowienie = jos_jakjesc_zamowienie.id_zamowienie where jos_jakjesc_zamowienie.id_zamowienie = '$id_zamowienie' and dzien < now() order by pozostalo_dni desc limit 0,1 "; //1,1
	$Getdayresult5=mysql_query($Getdaysql5);
	$GetdayfetchResult5 = mysql_fetch_array($Getdayresult5);
	$dayName = $GetdayfetchResult5['dayName'];	
		 $dayGet = $dayName;
		  $a = array(	
			"niedziela" => "Sunday",
			"poniedzialek" => "Monday",
			"wtorek" => "Tuesday",
			"sroda" => "Wednesday",
			"czwartek" => "Thursday",
			"piątek" => "Friday",
			 "sobota" => "Saturday",	
			 );
		$getDayNames =  array_search($dayGet, $a);
	

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
        
     where    z.id_user = '$userId' and  d.dzien = '$pozostalo_dni4' and d.id_posilek_rodzaj = '$DrugiesniadanieId'";
	 
	 mysql_set_charset("UTF8");
	 
	 $result=mysql_query($userSql);
	$fetchResult = mysql_fetch_array($result, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);	
			if($fetchResult){	
				$getdata =array('status'=>'Success','mesg'=>'Show Second breakfast Details','getDay'=>$getDayNames,'response'=>$fetchResult);	
				}else{
					$Unfortunately = 	"Niestety Twoje zamówienie nie obejmuje dzisiejszego dnia";
					$getdata = array('status'=>'fail','message'=>'Unfortunately, your order does not include the day today','response'=>$Unfortunately);	
				} 
				
	}
	echo json_encode($getdata); 
	
}
?>