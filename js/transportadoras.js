$(document).ready(function () {
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    if(!checkAuth)
        window.location = "login.html";

    getShipments();

    $("#add_ship").click(function() {
        window.location = "transportadora.html";
    });
});


function getShipments() {
    $.ajax({
        type: 'GET',
        url: getAPI() + '/transportadoras',
    }).done(function (res) {
        hideLoading();

        if(res.length == 0)
            return "Nenhuma tranportadora cadastrada";

        res.forEach(transportadora => {
            $(".collection").append(addToCollection(transportadora))
        });
    });
}

function addToCollection(transportadora) {
    return `
    <li class="collection-item avatar">
      <i class="material-icons circle light-green lighten-2">local_shipping</i>
      <span class="title">` + transportadora.nome + `</span>
      <p>` + transportadora.telefone + `</p>
      <a href="transportadora.html?tid=` + transportadora.id + `" class="secondary-content"><i class="material-icons">navigate_next</i></a>
    </li>
    `;
}
