<?php
  require_once "../config.php";

  if ( isset( $_GET["day"] ) ) {
    $day = $_GET["day"];

    $query = "SELECT beneficiario, valor FROM documentos WHERE tipo LIKE 'CH' AND vencimento LIKE '$day' AND situacao LIKE 'Em aberto';";
    $result = exec_query( $query );
    
    if ( $result->num_rows > 0 ) {
      $date = new DateTime($day);
      $date = $date->format( "d-m-Y" );
      $table = "
        <h1 class='h4'>Cheques para o dia $date</h1>
        <table class='table table-sm table-striped'>
          <thead>
            <tr>
              <td>Beneficiario</td>
              <td>Valor</td>
            </tr>
          </thead>
          <tbody>";

      while ( $ch = $result->fetch_assoc() ) {
        $table .= "
        <tr>
          <td>" . $ch["beneficiario"] . "</td>
          <td>R$ " . number_format( $ch["valor"], 2, ',', '.') . "</td>
        </tr>";
      }

      $table .= "</tbody></table>";

      echo $table;
    } else return null;
    
  } else return null;
?>
