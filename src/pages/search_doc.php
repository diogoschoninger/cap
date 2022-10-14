<?php
  require_once "../config.php";

  if ( isset( $_GET["day"] ) ) {
    $day = $_GET["day"];

    $queryTotal = "SELECT SUM(valor) FROM documentos WHERE vencimento LIKE '$day' AND situacao LIKE 'Em aberto';";
    $resultTotal = exec_query( $queryTotal );
    $resultTotal = $resultTotal->fetch_array();

    $queryBL = "SELECT SUM(valor) FROM documentos WHERE vencimento LIKE '$day' AND tipo LIKE 'BL' AND situacao LIKE 'Em aberto';";
    $resultBL = exec_query( $queryBL );
    $resultBL = $resultBL->fetch_array();
    
    $queryCH = "SELECT SUM(valor) FROM documentos WHERE vencimento LIKE '$day' AND tipo LIKE 'CH' AND situacao LIKE 'Em aberto';";
    $resultCH = exec_query( $queryCH );
    $resultCH = $resultCH->fetch_assoc();
    
    $queryDB = "SELECT SUM(valor) FROM documentos WHERE vencimento LIKE '$day' AND tipo LIKE 'DB' AND situacao LIKE 'Em aberto';";
    $resultDB = exec_query( $queryDB );
    $resultDB = $resultDB->fetch_array();

    echo "
      <p class='mt-2 h4'>Total: R$ " . number_format( $resultTotal[0], 2, ',', '.') . "</p>
      <p class='mb-0'>- Boleto: R$ " . number_format( $resultBL[0], 2, ',', '.') . "</p>
      <p class='mb-0'>- Cheque: R$ " . number_format( $resultCH['SUM(valor)'], 2, ',', '.') . "</p>
      <p class='mb-0'>- Débito: R$ " . number_format( $resultDB[0], 2, ',', '.') . "</p>";
  } else return false;
?>
