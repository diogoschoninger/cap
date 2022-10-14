<?php
  require_once "src/config.php";
  require_once HEADER;
?>

<div class="container">
  <h1 class="h3 my-3">Documentos em aberto</h1>

  <table class="table table-sm table-striped">
    <thead>
      <tr>
        <th>Beneficiário</th>
        <th>Valor</th>
        <th>Vencimento</th>
        <th>Tipo</th>
        <th>Ações</th>
      </tr>
    </thead>

    <tbody>
      <?php
        $documents = exec_query( "SELECT id, beneficiario, valor, vencimento, tipo FROM documentos WHERE situacao like 'Em aberto' ORDER BY vencimento" );
        if ( $documents->num_rows > 0 ) :
      ?>

        <?php while ( $document = $documents->fetch_assoc() ) : ?>
          <?php $date = date_create($document["vencimento"]) ?>

          <tr id="tr<?php echo $document["id"] ?>">
            <td><?php echo $document["beneficiario"] ?></td>
            <td><?php echo "R$ " . number_format( $document["valor"], 2, ",", "." ) ?></td>
            <td><?php echo date_format($date,"d/m/Y") ?></td>
            <td><?php echo $document["tipo"] ?></td>
            <td class="p-0 align-middle">
              <button class="btn btn-success" onclick="pay( <?php echo $document['id'] ?> )">Baixar</button>
              <a href="<?php echo BASE_URL ?>src/pages/edit.php?id=<?php echo $document["id"] ?>" class="btn btn-primary">Editar</a>
            </td>
          </tr>
        
        <?php endwhile ?>

      <?php else : ?>

        <tr>
          <td colspan="7" class="text-center">Nenhum registro encontrado.</td>
        </tr>

      <?php endif ?>
    </tbody>
  </table>
</div>

<?php require_once FOOTER ?>
