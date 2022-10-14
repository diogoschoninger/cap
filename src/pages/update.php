<?php
  require_once "../config.php";
  require_once HEADER;

  $doc = $_POST["doc"];
  $id = $_GET["id"];
  
  $doc["valor"] = floatval( str_replace( ",", ".", $doc["valor"] ) );

  edit_doc( $id, $doc );

  header( "Location: ../../index.php" );

  require_once FOOTER;
?>
