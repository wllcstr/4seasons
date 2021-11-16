$(document).ready(function () {
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    if(!checkAuth)
        window.location = "login.html";

    getClients();

    $("#add_cliente").click(function() {
        window.location = "cliente.html";
    });
});


function getClients() {
    $.ajax({
        type: 'GET',
        url: getAPI() + '/clientes',
    }).done(function (res) {
        hideLoading();

        if(res.length == 0)
            return "Nenhum cliente cadastrado";

        res.forEach(cliente => {
            $(".collection").append(addToCollection(cliente))
        });
    });
}

function addToCollection(cliente) {
    return `
    <li class="collection-item avatar">
      <i class="material-icons circle light-green lighten-2">person</i>
      <span class="title">` + cliente.nome + `</span>
      <p>` + cliente.endereco + ` <br>
         ` + cliente.telefone + `
      </p>
      <a href="cliente.html?cid=` + cliente.id + `" class="secondary-content"><i class="material-icons">navigate_next</i></a>
    </li>
    `;
}
