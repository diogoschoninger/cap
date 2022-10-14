<?php
  require_once "../config.php";
  require_once HEADER;
  // Busca os totais na base de dados
  $total_documentos = exec_query( "SELECT SUM(valor) FROM documentos" )->fetch_array();
  $total_documentos = doubleval( $total_documentos["0"] );
  
  $total_baixado = exec_query( "SELECT SUM(valor) FROM documentos WHERE situacao LIKE 'Baixado'" )->fetch_array();
  $total_baixado = doubleval( $total_baixado["0"] );

  $total_em_aberto = exec_query( "SELECT SUM(valor) FROM documentos WHERE situacao like 'Em aberto'")->fetch_array();
  $total_em_aberto = doubleval( $total_em_aberto["0"] );
  

  // Busca o total em aberto até o dia atual
  $today = new DateTime();
  $today = $today->format( "Y-m-d") ;
  
  $documents = exec_query( "SELECT SUM(valor) FROM documentos WHERE vencimento <= '$today' AND situacao like 'Em aberto'" );
  $document = $documents->fetch_array();
  $until_today = $document[0];


  //Busca o total em aberto para o dia seguinte
  $tomorrow = new DateTime( "+1 day" );
  $tomorrow = $tomorrow->format( "Y-m-d" );
  
  $documents = exec_query( "SELECT SUM(valor) FROM documentos WHERE vencimento LIKE '$tomorrow' AND situacao like 'Em aberto'" );
  $document = $documents->fetch_array();
  $for_tomorrow = $document[0];


  //Busca o total em aberto para o restante da semana
  $week = new DateTime( "+7 day" );
  $week = $week->format( "Y-m-d" );
  
  $documents = exec_query( "SELECT SUM(valor) FROM documentos WHERE vencimento <= '$week' AND situacao like 'Em aberto'" );
  $document = $documents->fetch_array();

  $total_week = $document[0];
  $rest_of_the_week = $total_week - $until_today - $for_tomorrow;
?>

<div class="container">
  <h1 class="h3 my-3">Totais</h1>

  <div class="jumbotron bg-light p-3" style="display: flex; justify-content: space-between">
    <div class="card-body">
      <h5 class="card-title text-center">Total documentos</h5>
      <p class="card-text text-center">R$ <?php echo number_format($total_documentos, 2, ',', '.') ?></p>
    </div>
    <div class="card-body">
      <h5 class="card-title text-center">Total baixado</h5>
      <p class="card-text text-center">R$ <?php echo number_format($total_baixado, 2, ',', '.') ?></p>
    </div>
    <div class="card-body">
      <h5 class="card-title text-center">Total em aberto</h5>
      <p class="card-text text-center">R$ <?php echo number_format($total_em_aberto, 2, ',', '.') ?></p>
    </div>
  </div>

  <div class="jumbotron bg-light p-3" style="display: flex; justify-content: space-between">
    <div class="card-body">
      <h5 class="card-title text-center">Até hoje</h5>
      <p class="card-text text-center">R$ <?php echo number_format($until_today, 2, ',', '.') ?></p>
    </div>
    <div class="card-body">
      <h5 class="card-title text-center">Para amanhã</h5>
      <p class="card-text text-center">R$ <?php echo number_format($for_tomorrow, 2, ',', '.') ?></p>
    </div>
    <div class="card-body">
      <h5 class="card-title text-center">Restante da semana</h5>
      <p class="card-text text-center">R$ <?php echo number_format($rest_of_the_week, 2, ',', '.') ?></p>
    </div>
    <div class="card-body">
      <h5 class="card-title text-center">Total até próx. <?php echo utf8_encode(strToLower(ucfirst(gmstrftime('%A')))) ?></h5>
      <p class="card-text text-center">R$ <?php echo number_format($total_week, 2, ',', '.') ?></p>
    </div>
  </div>

  <div class="jumbotron bg-light p-3" style="display: flex; justify-content: space-between">
    <div class="card-body">
      <div class="form-inline">
        <input id="input_date" class="form-control mx-3" type="date">
        <button class="btn btn-primary" onclick="search_doc()">Buscar</button>
      </div>
      <div id="result" class="pl-3"></div>
    </div>

    <div class="card-body">
      <div id="result_ch"></div>
    </div>
  </div>

  <?php
    $conn = open_db();
    $resultados = $conn->query("select max(vencimento) from documentos");
    close_db($conn);

    $resultado = $resultados->fetch_array(MYSQLI_NUM);
    
    $ultimo = new DateTime($resultado[0]);
    $diferenca_ultimo = $ultimo->format("d") - 1;
    $mes_ultimo = $ultimo->modify("-" . $diferenca_ultimo . " days");
    
    $atual = new DateTime();
    $diferenca_atual = $atual->format("d") - 1;
    $mes_atual = $atual->modify("-" . $diferenca_atual . " days");
  ?>

  <h1 class="h3">Total em aberto por mês</h1>

  <div>
    <table class="table table-sm  w-auto">
      <thead>
        <tr>
          <th>Mês</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <?php
          $aux_ultimo = $ultimo;
          $aux_atual = $atual;
          $data_min;
          $data_max;
          $conn = open_db();
          while ($aux_ultimo->format("Y-m") >= $aux_atual->format("Y-m")) {
            $data_min = $aux_atual->format("Y-m-d");
            $data_max = $aux_atual->modify("+1 month")->format("Y-m-d");
            $aux_atual->modify("-1 month");
            
            $soma = $conn->query("select sum(valor) from documentos where vencimento >= '$data_min' and vencimento < '$data_max' and situacao = 'Em aberto'")->fetch_array(MYSQLI_NUM);
            
            echo "
              <tr>
                <td>" . $aux_atual->format("m-Y") . "</td>
                <td>R$ " . number_format($soma[0], 2, ',', '.') . "</td>
              </tr>
            ";
            
            $aux_atual = $aux_atual->modify("+1 month");
          }
          close_db($conn);
        ?>
      </tbody>
    </table>

    <div id="detail"></div>
  </div>
</div>
  
<?php require_once FOOTER ?>
