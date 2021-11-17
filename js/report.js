$(document).ready(function () {
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    if(!checkAuth)
        window.location = "login.html";

    getVendas();
});

function getVendas() {
    $.ajax({
        type: 'GET',
        url: getAPI() + '/vendas',
    }).done(function (res) {
        hideLoading();
        if(res.length > 0) {
            res.forEach(venda => {
                var ret = addToCollection(venda);
                $(".collection").append(ret);
            });
        }
    });
}

function addToCollection(venda) {
    return `<li class="collection-item avatar">
              <i class="material-icons circle light-green lighten-2">book</i>
              <span class="title">` +  venda.data + `</span>
              <p>R$ ` + parseFloat(venda.total).toFixed(2) + ` <br>
                 Forma de pagamento: ` + venda.formaPgto + `
              </p>
            </li>
            `;

    // $.ajax({
    //     type: 'GET',
    //     url: getAPI() + '/clientes/' + venda.clienteId,
    // }).done(function (res) {
    //     if(res) {

            
    //     }
    // });
    
}


