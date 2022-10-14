<?php
  require_once "../config.php";

  if ( isset($_GET["id"]) ) {
    $id = $_GET["id"];
    exec_query( "DELETE FROM documentos WHERE id = $id" );
  }
?>
