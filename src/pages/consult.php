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
        // Obtendo a página informada na URL
        if (isset($_GET["page"])) {
          $page = $_GET["page"];
        } else {
          $page = 1;
        }

        // Definindo o total de itens listados por página e o número da página atual
        $items_per_page = 100;
        $page_index = ($page - 1) * $items_per_page;

        // Buscando x itens da página
        $documents = exec_query(
          "SELECT id, beneficiario, valor, vencimento, tipo, situacao
          FROM documentos
          ORDER BY vencimento
          LIMIT $page_index, $items_per_page"
        );

        // Listando os itens
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
      
  <!-- Exibindo os links de paginação -->
  <div class="container d-flex justify-content-center mb-3" style="gap: 1rem">
    <?php
      // Buscando todos os itens
      $all_documents = exec_query("SELECT id FROM documentos");
      
      // Obtendo o total
      $total_documents = $all_documents->num_rows;

      // Definindo o número total de páginas
      if ($total_documents / $items_per_page > intval($total_documents / $items_per_page)) {
        $total_pages = intval($total_documents / $items_per_page) + 1;
      } else {
        $total_pages = intval($total_documents / $items_per_page);
      }
      
      // Exibindo os botões de paginação
      if ($page <= 6) :
    ?>
      <?php for ($i = 1; $i <= 10; $i++) : ?>
        <a
          class="btn btn-primary <?php if ($i == $page) echo "disabled" ?>"
          href="<?php echo BASE_URL ?>src/pages/consult.php?page=<?php echo $i ?>">
          <?php echo $i ?>
        </a>
      <?php endfor ?>
    <?php elseif ($page < $total_pages - 5) : ?>
      <a
        class="btn btn-primary"
        href="<?php echo BASE_URL ?>src/pages/consult.php?page=1">
        Primeira
      </a>

      ...

      <?php for ($i = $page - 5; $i <= $page + 5; $i++) : ?>
          <a
            class="btn btn-primary <?php if ($i == $page) echo "disabled" ?>"
            href="<?php echo BASE_URL ?>src/pages/consult.php?page=<?php echo $i ?>">
            <?php echo $i ?>
          </a>
      <?php endfor ?>

      ...

      <a
        class="btn btn-primary"
        href="<?php echo BASE_URL ?>src/pages/consult.php?page=<?php echo $total_pages ?>">
        Última
      </a>
    <?php else : ?>
      <a
        class="btn btn-primary"
        href="<?php echo BASE_URL ?>src/pages/consult.php?page=1">
        Primeira
      </a>

      ...

      <?php for ($i = $total_pages - 10; $i <= $total_pages; $i++) : ?>
        <a
          class="btn btn-primary <?php if ($i == $page) echo "disabled" ?>"
          href="<?php echo BASE_URL ?>src/pages/consult.php?page=<?php echo $i ?>">
          <?php echo $i ?>
        </a>
      <?php endfor ?>
    <?php endif ?>
  </div>
</div>

<?php require_once FOOTER ?>
