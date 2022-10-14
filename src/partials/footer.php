</body>

<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

<script>
  function pay( id ) {
    var id = id;
    var tbody = document.querySelector("tbody")
    var tr = document.querySelector("tr#tr" + id)

    tbody.removeChild(tr)

    var request = new XMLHttpRequest()
    request.open( "GET", "<?php echo BASE_URL ?>src/pages/pay_and_reverse.php?id=" + id, true )
    request.send()
  }
  function pay_and_reverse( id, value ) {
    var tr = document.getElementById( "tr" + id )
    var td_situacao = document.getElementById( "situacao" + id )
    var btn = document.getElementById( "btn" + id )
    var request = new XMLHttpRequest()
    var url = "<?php echo BASE_URL ?>src/pages/pay_and_reverse.php?id=" + id + "&action="

    if ( value === "baixar" ) {
      td_situacao.innerHTML = "Baixado"
      btn.innerHTML = "Estornar"
      btn.value = "estornar"
      url += "pay"
    } else if ( value === "estornar" ) {
      td_situacao.innerHTML = "Em aberto"
      btn.innerHTML = "Baixar"
      btn.value = "baixar"
      url += "reverse"
    }

    request.open( "GET", url, true )
    request.send()
  }
  function delete_doc( id ) {
    var tbody = document.querySelector("tbody")
    var tr = document.getElementById( "tr" + id )
    var request = new XMLHttpRequest()
    var url = "<?php echo BASE_URL ?>src/pages/delete.php?id=" + id

    if ( window.confirm("Deseja mesmo excluir o documento?") ) {
      tbody.removeChild( tr )
      request.open( "GET", url, true )
      request.send()
      alert("Documento excluido!")
    }
  }
  function search_ch() {
    var div_result_ch = document.querySelector("div#result_ch")
    var day = document.querySelector("input#input_date").value
    var request = new XMLHttpRequest()
    var url = "<?php echo BASE_URL ?>src/pages/search_ch.php?day=" + day

    request.open( "GET", url, true )

    request.onreadystatechange = () => {
      if ( request.readyState == 4 ) {
        if ( request.status == 200 ) {
          if ( request.response !== null ) {
            div_result_ch.innerHTML = request.response
          }
        } else result.innerHTML = "Erro: " + request.statusText
      }
    }

    request.send()
  }
  function search_doc() {
    var div_result = document.querySelector("div#result")
    var day = document.querySelector("input#input_date").value
    var request = new XMLHttpRequest()
    var url = "<?php echo BASE_URL ?>src/pages/search_doc.php?day=" + day

    div_result.innerHTML = "<img src='<?php echo BASE_URL ?>public/images/loading.gif' style='width: 35px' />"

    request.open( "GET", url, true )

    request.onreadystatechange = () => {
      if ( request.readyState == 4 ) {
        if ( request.status == 200 ) div_result.innerHTML = request.response
        else div_result.innerHTML = "Erro: " + request.statusText
      }
    }

    request.send();
    search_ch();
  }
</script>

</html>
