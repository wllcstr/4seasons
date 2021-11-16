$(document).ready(function () {
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    if(!checkAuth)
        window.location = "login.html";

    getProdutos();

    $("#add_produto").click(function() {
        window.location = "produto.html";
    });
});


function getProdutos() {
    $.ajax({
        type: 'GET',
        url: getAPI() + '/produtos',
    }).done(function (res) {
        hideLoading();

        if(res.length == 0)
            return "Nenhum produto cadastrado";

        res.forEach(produto => {
            $(".collection").append(addToCollection(produto))
        });
    });
}

function addToCollection(produto) {
    return `
    <li class="collection-item avatar">
      <i class="material-icons circle light-green lighten-2">widgets</i>
      <span class="title">` + produto.nome + `</span>
      <p><b>Saldo:</b> ` + produto.saldo + ` <br>
        <b>Valor:</b> R$ ` + parseFloat(produto.valor).toFixed(2) + `
      </p>
      <a href="produto.html?pid=` + produto.id + `" class="secondary-content"><i class="material-icons">navigate_next</i></a>
    </li>
    `;
}
