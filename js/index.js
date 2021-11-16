$(document).ready(function () {
    hideLoading();
    $(".container").html(createOptions);
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    $("#btn_clientes").click(function() {
        window.location = "clientes.html";
    });
    
    $("#btn_transportadoras").click(function() {
        window.location = "transportadoras.html";
    });

    $("#btn_estoque").click(function() {
        window.location = "estoque.html";
    });

    $("#btn_profile").click(function() {
        if(sessionStorage.getItem("uid") > 0) {
            $.ajax({
                type: 'GET',
                url: getAPI() + '/clientes?userId=' + sessionStorage.getItem("uid"),
            }).done(function (res) {
                if(res.length > 0) {
                    window.location = "cliente.html?cid=" + res[0].id;
                }
            });
        }
    });

    if(!checkAuth) {
        window.location = "login.html";
    }

    $("#btn_order").click(function() {
        window.location = "venda.html";
    });
});