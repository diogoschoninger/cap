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
        // Obtendo a página informada na URL
        if (isset($_GET["page"])) {
          $page = $_GET["page"];
        } else {
          $page = 1;
        }

        // Definindo o total de itens listados por página e o número da página atual
        $items_per_page = 30;
        $page_index = ($page - 1) * $items_per_page;

        // Buscando x itens da página
        $documents = exec_query(
          "SELECT id, beneficiario, valor, vencimento, tipo
          FROM documentos WHERE situacao like 'Em aberto'
          ORDER BY vencimento
          LIMIT $page_index, $items_per_page"
        );

        // Listando os itens
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
      
  <!-- Exibindo os links de paginação -->
  <div class="d-flex flex-row justify-content-between mb-3">
    <?php
      // Buscando todos os itens
      $all_documents = exec_query("SELECT id FROM documentos WHERE situacao LIKE 'Em aberto'");
      
      // Obtendo o total
      $total_documents = $all_documents->num_rows;

      // Definindo o número total de páginas
      if ($total_documents / $items_per_page > intval($total_documents / $items_per_page)) {
        $total_pages = intval($total_documents / $items_per_page) + 1;
      } else {
        $total_pages = intval($total_documents / $items_per_page);
      }
      
      // Exibindo os botões de paginação
      for ($i = 1; $i <= $total_pages; $i++) : ?>
        <a
          class="btn btn-primary <?php if ($i == $page) echo "disabled" ?>"
          href="<?php echo BASE_URL ?>?page=<?php echo $i ?>">
          <?php echo $i ?>
        </a>
    <?php endfor ?>
  </div>

</div>

<?php require_once FOOTER ?>
