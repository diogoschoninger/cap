<?php
  setlocale(LC_TIME, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
  date_default_timezone_set('America/Sao_Paulo');
  setlocale(LC_ALL, NULL);
  setlocale(LC_ALL, 'pt_BR');

  // Constantes utilizadas
  define( "DB_SERVER", "localhost" );
  define( "DB_USER", "root" );
  define( "DB_PASSWORD", "" );
  define( "DB_NAME", "contas_a_pagar" );

  define( "ABS_PATH", dirname(__FILE__) . "/" );
  define( "BASE_URL", "/contas-a-pagar/" );

  define( "HEADER", ABS_PATH . "partials/header.php" );
  define( "FOOTER", ABS_PATH . "partials/footer.php" );

  // Funções do Banco de Dadoss

  function open_db() {
    $conn = new mysqli( DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME ) or die ( "Erro ao conectar ao banco de dados." );

    return $conn;
  }

  function close_db( $conn ) {
    mysqli_close( $conn );
  }
  
  function exec_query( $query ) {
    $conn = open_db();
    $result = $conn->query( $query );
    close_db( $conn );
    return $result;
  }

  function insert( $table, $data ) {
    $columns = null;
    $values = null;

    foreach ( $data as $key => $value ) {
      $columns .= trim($key, "'") . ", ";
      $values .= "'$value', ";
    }

    $columns = rtrim($columns, " ,");
    $values = rtrim($values, " ,");

    $query = "INSERT INTO $table ($columns) VALUES ($values);";
    
    exec_query( $query );
  }
  
  function update( $table, $data, $id ) {
    $queryUpdate = null;

    foreach ( $data as $key => $value ) {
      $queryUpdate .= $key . " = '" . $value . "', ";
    }

    $queryUpdate = rtrim($queryUpdate, ", ");

    $query = "UPDATE $table SET $queryUpdate WHERE id = $id;";
    
    exec_query( $query );
  }

  // Funções da aplicação
  function add_doc( $data ) {
    $keys = array();
    $values = array();

    foreach ( $data as $key => $value ) {
      array_push( $keys, $key );
      array_push( $values, $value );
    }

    array_push( $keys, "situacao");
    array_push( $values, "Em aberto");

    $newData = array_combine( $keys, $values );

    insert( "documentos", $newData );
  }

  function edit_doc( $id, $data ) {
    $keys = array();
    $values = array();

    foreach ( $data as $key => $value ) {
      array_push( $keys, $key );
      array_push( $values, $value );
    }

    $newData = array_combine( $keys, $values );

    update( "documentos", $newData, $id );
  }
?>
