$(document).ready(function () {
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    if(!checkAuth)
        window.location = "login.html";

    var tid = parseInt(getUrlVars()["tid"]);
    if(tid > 0) {
        getShipmentData(tid);
        $(".fixed-action-btn ul").append('<li><a id="delete-ship" class="btn-floating red lighten-1"><i class="material-icons">delete</i></a></li>');
    } else {
        $(".fixed-action-btn ul").append('<li><a href="transportadoras.html" class="btn-floating red lighten-1"><i class="material-icons">cancel</i></a></li>');
        hideLoading();
    }
    $('.fixed-action-btn').floatingActionButton();
    $("#save-ship").click(salvaTransportadora);
    $("#delete-ship").click(excluiTransportadora);
});

function getShipmentData(cid) {

    $.ajax({
        type: 'GET',
        url: getAPI() + '/transportadoras/' + cid,
    }).done(function (res) {
        if(res) {
            $("#nome").val(res.nome);
            $("#nome").focus();
            $("#telefone").val(res.telefone);
            $("#telefone").focus();
            $("#telefone").blur();
            hideLoading();
        } else {
            toast("Cadastro não localizado");
            window.location = "transportadoras.html";
        }
    });
}

function salvaTransportadora() {
    showLoading();
    var oShip = {
        nome: $("#nome").val(),
        telefone: $("#telefone").val()
    }
    
    if(!oShip.nome || !oShip.telefone) {
        toast("Preencha todos os campos");
        return;
    }

    var tid = parseInt(getUrlVars()["tid"])
    if(tid > 0) {
        oShip.id = tid;
        $.ajax({
            type: 'PUT',
            url: getAPI() + '/transportadoras/' + tid,
            data: oShip
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
            url: getAPI() + '/transportadoras',
            data: oShip
        }).done(function () {
            toast("Transportadora adicionada com sucesso");
        }).fail(function() {
            toast("Falha ao salvar os dados");
        }).always(function() {
            hideLoading();
        });
    }
}

function excluiTransportadora() {
    var tid = parseInt(getUrlVars()["tid"])
    if(tid > 0) {
        $.ajax({
            type: 'DELETE',
            url: getAPI() + '/transportadoras/' + tid,
        }).done(function () {
            toast("Transportadora excluida com sucesso");
            setTimeout(() => {
                window.location = "transportadoras.html";
            }, 800);
        }).fail(function() {
            toast("Falha ao excluir os dados");
        }).always(function() {
            hideLoading();
        });
    } else {
        toast("Nenhuma transportadora para excluir");
    }
}