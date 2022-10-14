<?php
  require_once "../config.php";
  require_once HEADER;

  if ( isset( $_POST["doc"] ) ) {
    $doc = $_POST["doc"];
    $doc["valor"] = floatval( str_replace( ",", ".", $doc["valor"] ) );
    $doc["beneficiario"] = strtoupper( $doc["beneficiario"] );
    $doc["beneficiario"] = addslashes( $doc["beneficiario"] );

    add_doc( $doc );
  }
?>

<div class="container">
  <h1>Cadastro de documentos</h1>
  
  <form action="./add.php" method="POST">
  <div class="form-row align-items-center">
    <div class="form-group col col-auto">
      <label for="beneficiario" class="my-auto">Beneficiário</label>
    </div>
      <div class="form-group col">
        <input name="doc[beneficiario]" id="beneficiario" class="form-control" />
        <script>document.querySelector("input#beneficiario").focus()</script>
      </div>
    </div>

    <div class="form-row align-items-center">
      <div class="form-group col col-auto">
        <label for="valor" class="my-auto">Valor</label>
      </div>
      <div class="form-group col col-auto">
        <input name="doc[valor]" id="valor" class="form-control" placeholder="R$ 0,00" />
      </div>

      <div class="form-group col col-auto">
        <label for="vencimento" class="my-auto">Vencimento</label>
      </div>
      <div class="form-group col col-auto">
        <input type="date" name="doc[vencimento]" id="vencimento" class="form-control" />
      </div>

      <div class="form-group col col-auto">
        <label for="tipo" class="my-auto">Tipo</label>
      </div>
      <div class="form-group col col-auto">
        <select name="doc[tipo]" id="tipo" class="form-control">
          <option value="BL">BL</option>
          <option value="CH">CH</option>
          <option value="DB">DB</option>
        </select>
      </div>
      
      <div class="form-group col col-auto">
        <button type="submit" class="btn btn-primary">Adicionar documento</button>
      </div>
    </div>
  </form>
</div>
  
<?php require_once FOOTER ?>
