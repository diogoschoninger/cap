<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Contas a pagar</title>

  <link rel="stylesheet" href="<?php echo BASE_URL ?>public/css/bootstrap.min.css" />
</head>
<body>

<nav class="navbar navbar-expand-lg bg-light navbar-light sticky-top">
  <a href="<?php echo BASE_URL ?>" class="navbar-brand">Página inicial</a>

  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#conteudoNavbarSuportado" aria-controls="conteudoNavbarSuportado" aria-expanded="false" aria-label="Alterna navegação">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="conteudoNavbarSuportado">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="<?php echo BASE_URL ?>src/pages/consult.php">Consultar documentos</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="<?php echo BASE_URL ?>src/pages/add.php">Adicionar documentos</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="<?php echo BASE_URL ?>src/pages/view_total.php">Visualizar totais</a>
      </li>
    </ul>
  </div>
</nav>
