<?php
  require_once "../config.php";
  require_once HEADER;

  if ( !isset( $_GET["id"] ) ) header( "Location: ./consult.php" );

  $id = $_GET["id"];
  $result = exec_query( "SELECT * FROM documentos WHERE id = $id" );
  $document = $result->fetch_assoc();
  
?>

<div class="container">
  <h1 class="h3 my-3">Editar documento</h1>


  <form action="./update.php?id=<?php echo $id ?>" method="POST">
    <div class="form-row align-items-center">

      <div class="form-group col col-auto">
        <label for="beneficiario" class="my-auto">Beneficiário</label>
      </div>
      <div class="form-group col">
        <input name="doc[beneficiario]" id="beneficiario" class="form-control" value="<?php echo $document["beneficiario"] ?>" />
      </div>
      
    </div>

    <div class="form-row align-items-center">

      <div class="form-group col col-auto">
        <label for="valor" class="my-auto">Valor</label>
      </div>
      <div class="form-group col col-auto">
        <input name="doc[valor]" id="valor" class="form-control" placeholder="R$ 0,00" value="<?php echo $document["valor"] ?>" />
      </div>

      <div class="form-group col col-auto">
        <label for="vencimento" class="my-auto">Vencimento</label>
      </div>
      <div class="form-group col col-auto">
        <input type="date" name="doc[vencimento]" id="vencimento" class="form-control" value="<?php echo $document["vencimento"] ?>" />
      </div>

      <div class="form-group col col-auto">
        <label for="tipo" class="my-auto">Tipo</label>
      </div>
      <div class="form-group col col-auto">
        <select name="doc[tipo]" id="tipo" class="form-control">
          <option value="BL" <?php if ( $document["tipo"] == "BL" ) echo "selected"?> >BL</option>
          <option value="CH" <?php if ( $document["tipo"] == "CH" ) echo "selected"?> >CH</option>
          <option value="DB" <?php if ( $document["tipo"] == "DB" ) echo "selected"?> >DB</option>
        </select>
      </div>

      <div class="form-group col col-auto">
        <label for="situacao" class="my-auto">Situação</label>
      </div>
      <div class="form-group col col-auto">
        <select name="doc[situacao]" id="situacao" class="form-control">
          <option value="Baixado" <?php if ( $document["situacao"] == "Baixado" ) echo "selected"?> >Baixado</option>
          <option value="Em aberto" <?php if ( $document["situacao"] == "Em aberto" ) echo "selected"?> >Em aberto</option>
        </select>
      </div>

      <div class="form-group col col-auto">
        <button type="submit" class="btn btn-primary">Editar documento</button>
      </div>

    </div>
  </form>
</div>

<?php require_once FOOTER ?>
