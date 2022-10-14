<?php
  require_once "../config.php";
  require_once HEADER;

  if ( isset( $_GET["min"] ) && isset( $_GET["max"] ) ) {
    $min = $_GET["min"];
    $max = $_GET["max"];

    echo "Min: $min | Max: $max";
  } else echo "Não setado";
?>

<?php require_once FOOTER ?>
