<?php
  require_once "../config.php";

  if ( isset( $_GET["id"] ) && !isset( $_GET["action"] ) ) {
    $id = $_GET["id"];
    exec_query( "UPDATE documentos SET situacao = 'Baixado' WHERE id = $id" );
  } else if ( isset( $_GET["id"] ) && isset( $_GET["action"] ) ) {
    $id = $_GET["id"];
    $action = $_GET["action"];

    if ( $action === "pay" ) exec_query( "UPDATE documentos SET situacao = 'Baixado' WHERE id = $id" );
    else if ( $action === "reverse" ) exec_query( "UPDATE documentos SET situacao = 'Em aberto' WHERE id = $id" );
  }

?>
