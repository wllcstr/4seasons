$(document).ready(function () {
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    if(!checkAuth)
        window.location = "login.html";

    var pid = parseInt(getUrlVars()["pid"]);
    if(pid > 0) {
        getItemData(pid);
        $(".fixed-action-btn ul").append('<li><a id="delete-item" class="btn-floating red lighten-1"><i class="material-icons">delete</i></a></li>');
    } else {
        $(".fixed-action-btn ul").append('<li><a href="estoque.html" class="btn-floating red lighten-1"><i class="material-icons">cancel</i></a></li>');
        hideLoading();
    }
    $('.fixed-action-btn').floatingActionButton();
    $("#save-item").click(salvaProduto);
    $("#delete-item").click(excluiProduto);
});

function getItemData(pid) {

    $.ajax({
        type: 'GET',
        url: getAPI() + '/produtos/' + pid,
    }).done(function (res) {
        if(res) {
            $("#nome").val(res.nome);
            $("#nome").focus();
            $("#descricao").val(res.descricao);
            $("#descricao").focus();
            $("#valor").val(res.valor);
            $("#valor").focus();
            $("#saldo").val(res.saldo);
            $("#saldo").focus();
            $("#saldo").blur();
            hideLoading();
        } else {
            toast("Cadastro não localizado");
            window.location = "estoque.html";
        }
    });
}

function salvaProduto() {
    showLoading();
    var oItem = {
        nome: $("#nome").val(),
        descricao: $("#descricao").val(),
        valor: $("#valor").val(),
        saldo: $("#saldo").val()
    }
    
    if(!oItem.nome || !oItem.descricao || !oItem.valor || !oItem.saldo) {
        toast("Preencha todos os campos");
        return;
    }

    var pid = parseInt(getUrlVars()["pid"])
    if(pid > 0) {
        oItem.id = pid;
        $.ajax({
            type: 'PUT',
            url: getAPI() + '/produtos/' + pid,
            data: oItem
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
            url: getAPI() + '/produtos',
            data: oItem
        }).done(function () {
            toast("item adicionado com sucesso");
        }).fail(function() {
            toast("Falha ao salvar os dados");
        }).always(function() {
            hideLoading();
        });
    }
}

function excluiProduto() {
    var pid = parseInt(getUrlVars()["pid"])
    if(pid > 0) {
        $.ajax({
            type: 'DELETE',
            url: getAPI() + '/produtos/' + pid,
        }).done(function () {
            toast("Item excluido com sucesso");
            setTimeout(() => {
                window.location = "estoque.html";
            }, 800);
        }).fail(function() {
            toast("Falha ao excluir os dados");
        }).always(function() {
            hideLoading();
        });
    } else {
        toast("Nenhum item para excluir");
    }
}