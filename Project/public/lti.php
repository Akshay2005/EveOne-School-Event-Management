<?php
	$message =$_REQUEST['lti_message_type'];
	$version = $_REQUEST['lti_version'];
	$resId = $_REQUEST['resource_link_id'];
	$contextId = $_REQUEST['context_id'];
	$userId = $_REQUEST['user_id'];
	$role = $_REQUEST['roles'];
	$oauthkey = $_REQUEST['oauth_consumer_key'];
	$nonce = $_REQUEST['oauth_nonce'];
	$timestamp = $_REQUEST['oauth_timestamp'];
	$oauthSig = $_REQUEST['oauth_signature'];
	$nameFull = $_REQUEST['lis_person_name_full'];
	$emailPrimary = $_REQUEST['lis_person_contact_email_primary'];
	$outcome = $_REQUEST['lis_outcome_service_url'];
	$sjsuid = $_REQUEST['lis_person_sourcedid'];
	
	/*
	echo "Message $message <br/>";
	echo "Version $version <br/>";
	echo "Resource Id $resId <br/>";
	echo "Context Id $contextId <br/>";
	echo "User Id $userId <br/>";
	echo "Roles $role <br/>";
	echo "Key $oauthkey <br/>";
	echo "Nonce $nonce <br/>";
	echo "Timestamp $timestamp <br/>";
	echo "Oauth sig $oauthSig <br/>";
	echo "Name $nameFull <br/>";
	echo "Email $emailPrimary <br/>";
	echo "Outcome $outcome <br/>";
	echo "SJSU Id $sjsuid <br/>";
	*/
	
	if(!empty($sjsuid))
	{
		$url = "http://www.akshaysonvane.cf/global?token=" . $sjsuid;
		
		redirect($url);
	}
	
	
	
	function redirect($url)
	{
		if (headers_sent())
		{
		  die('<script type="text/javascript">window.location.href="' . $url . '";</script>');
		}
		else
		{
		  header('Location: ' . $url);
		  die();
		}
    }
?>