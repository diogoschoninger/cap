<?php
  require_once '../config.php';
  require_once HEADER;
?>

<div class="container-fluid">
  <h1 class="h3 my-3">Todos os documentos</h1>
  
  <table class="table table-sm table-striped">
    <thead>
      <tr>
        <th>ID</th>
        <th>Beneficiário</th>
        <th>Valor</th>
        <th>Vencimento</th>
        <th>Tipo</th>
        <th>Situação</th>
        <th>Ações</th>
      </tr>
    </thead>
    
    <tbody>
      <?php
        $documents = exec_query( "SELECT * FROM documentos ORDER BY vencimento" );
        if ( $documents->num_rows > 0 ) :
          ?>
      
      <?php while ( $document = $documents->fetch_assoc() ) : ?>
        <?php $date = date_create($document["vencimento"]) ?>
        
        <tr id="tr<?php echo $document["id"] ?>">
          <td><?php echo $document["id"] ?></td>
          <td><?php echo $document["beneficiario"] ?></td>
          <td><?php echo "R$ " . number_format( $document["valor"], 2, ",", "." ) ?></td>
          <td><?php echo date_format($date ,"d/m/Y") ?></td>
          <td><?php echo $document["tipo"] ?></td>
          <td id="situacao<?php echo $document["id"] ?>"><?php echo $document["situacao"] ?></td>
          
          <td class="p-0 align-middle">
            <a href="<?php echo BASE_URL ?>src/pages/edit.php?id=<?php echo $document["id"] ?>" class="btn btn-primary">Editar</a>
            
            <?php if ( $document["situacao"] === "Baixado" ) : ?>
              <button class="btn btn-success" id="btn<?php echo $document['id'] ?>" value="estornar" onclick="pay_and_reverse( <?php echo $document['id'] ?>, this.value )">Estornar</button>
            <?php else : ?>
              <button class="btn btn-success" id="btn<?php echo $document['id'] ?>" value="baixar" onclick="pay_and_reverse( <?php echo $document['id'] ?>, this.value )">Baixar</button>
              <?php endif ?>
              
              <button class="btn btn-danger" id="<?php echo $document['id'] ?>" onclick="delete_doc(this.id)">Excluir</button>
            </td>
          </tr>
          <?php endwhile ?>
          
          <?php else : ?>
            <tr>
              <td colspan="8" class="text-center">Nenhum registro encontrado.</td>
            </tr>
            <?php endif ?>
            
    </tbody>
  </table>
</div>

<?php require_once FOOTER ?>
