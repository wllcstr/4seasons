$(document).ready(function () {
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    if(!checkAuth)
        window.location = "login.html";

    var cid = parseInt(getUrlVars()["cid"]);
    if(cid > 0) {
        getClientData(cid);
        $(".fixed-action-btn ul").append('<li><a id="delete-cliente" class="btn-floating red lighten-1"><i class="material-icons">delete</i></a></li>');
        $(".fixed-action-btn ul").append('<li><a id="nova-venda" class="btn-floating"><i class="material-icons">shopping_cart</i></a></li>');
    } else {
        $(".fixed-action-btn ul").append('<li><a href="clientes.html" class="btn-floating red lighten-1"><i class="material-icons">cancel</i></a></li>');
        hideLoading();
    }
    $('.fixed-action-btn').floatingActionButton();
    $("#save-cliente").click(salvaCliente);
    $("#delete-cliente").click(excluiCliente);
    $("#nova-venda").click(function() {
        window.location = "venda.html?cid=" + cid;
    });
});

function getClientData(cid) {

    $.ajax({
        type: 'GET',
        url: getAPI() + '/clientes/' + cid,
    }).done(function (res) {
        if(res) {
            $("#nome").val(res.nome);
            $("#nome").focus();
            $("#cpf").val(res.cpf);
            $("#cpf").focus();
            $("#endereco").val(res.endereco);
            $("#endereco").focus();
            $("#preferencias").val(res.preferencia);
            $("#preferencias").focus();
            $("#telefone").val(res.telefone);
            $("#telefone").focus();
            $("#telefone").blur();
            hideLoading();
        } else {
            toast("Cadastro não localizado");
            window.location = "clientes.html";
        }
    });
}

function salvaCliente() {
    showLoading();
    var oCliente = {
        nome: $("#nome").val(),
        cpf: $("#cpf").val(),
        endereco: $("#endereco").val(),
        telefone: $("#telefone").val(),
        preferencia: $("#preferencias").val()
    }
    
    if(!oCliente.nome || !oCliente.cpf || !oCliente.endereco || !oCliente.telefone) {
        toast("Preencha todos os campos");
        return;
    }

    var cid = parseInt(getUrlVars()["cid"])
    if(cid > 0) {
        oCliente.id = cid;
        $.ajax({
            type: 'PUT',
            url: getAPI() + '/clientes/' + cid,
            data: oCliente
        }).done(function () {
            toast("Dados atualizados com sucesso")
        }).fail(function() {
            toast("Falha ao salvar os dados");
        }).always(function() {
            hideLoading();
        });
    } else {
        $.ajax({
            type: 'POST',
            url: getAPI() + '/clientes',
            data: oCliente
        }).done(function () {
            toast("Cliente adicionado com sucesso");
        }).fail(function() {
            toast("Falha ao salvar os dados");
        }).always(function() {
            hideLoading();
        });
    }
}

function excluiCliente() {
    var cid = parseInt(getUrlVars()["cid"])
    if(cid > 0) {
        $.ajax({
            type: 'DELETE',
            url: getAPI() + '/clientes/' + cid,
        }).done(function () {
            toast("Cliente excluido com sucesso");
            setTimeout(() => {
                window.location = "clientes.html";
            }, 800);
        }).fail(function() {
            toast("Falha ao excluir os dados");
        }).always(function() {
            hideLoading();
        });
    } else {
        toast("Nenhum cliente para excluir");
    }
}