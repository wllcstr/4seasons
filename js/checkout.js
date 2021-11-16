$(document).ready(function () {
    showLoading();
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    if(!checkAuth)
        window.location = "login.html";

    getChartItens();
    getShipments();

    var cid = parseInt(sessionStorage.getItem("cid", cid));
    if(cid > 0) {
        $.ajax({
            type: 'GET',
            url: getAPI() + '/clientes/' + cid ,
        }).done(function (res) {
            hideLoading();
            if(res && res.nome) {
                $("#client-name").html("Cliente: " + res.nome);
            }
        });
    }
    $('select').formSelect();
    var subtotal = 0;

    $("#finish").click(gerarVenda);

});

function getChartItens() {
    var chartItems = JSON.parse(sessionStorage.getItem("chart"));
    $('.collection').empty();
    var total = 0;
    chartItems.forEach(itemVenda => {
        $(".collection").append(addToCollection(itemVenda));
        total += (itemVenda.quantidade * itemVenda.valor);
    });
    $(".remove-item").click(function() {
        var lid = $(this).attr('id');
        deleteChartItem(lid);
    });
    subtotal = total;
    $("#total-order").html("Total: R$ " + parseFloat(total).toFixed(2));
}


function addToCollection(itemVenda) {
    return `
    <li class="collection-item avatar">
      <i class="material-icons circle light-green lighten-2">widgets</i>
        <span class="title">` + itemVenda.nome + `</span>
        <p>` + itemVenda.quantidade + `x R$ ` + parseFloat(itemVenda.valor).toFixed(2) + `  <br>
        <b>Subtotal:</b> R$ ` + parseFloat((itemVenda.quantidade * itemVenda.valor)).toFixed(2) + `
        </p>
        <a id="` + itemVenda.id + `" onclick="deleteChartItem(` + itemVenda.id + `)" class="secondary-content remove-item"><i class="material-icons">delete</i></a>
    </li>
    `;
}


function deleteChartItem(id) {
    var chartItems = JSON.parse(sessionStorage.getItem("chart"));

    for(var i = 0; i < chartItems.length; i++) {
        if(chartItems[i].id == id)
            chartItems.splice(i, 1);
    }

    sessionStorage.setItem("chart",  JSON.stringify(chartItems));
    getChartItens();
}

function getShipments() {
    $.ajax({
        type: 'GET',
        url: getAPI() + '/transportadoras',
    }).done(function (res) {
        hideLoading();
        if(res.length > 0) {
            res.forEach(transportadora => {
                var elem = '<option value="' + transportadora.id +  '">' + transportadora.nome + '</option>'
                $("#select-ship").append(elem);
            });
            $('#select-ship').formSelect();
        }
    });
}

function gerarVenda() {
    showLoading();
    var nId = 0;
    $.ajax({
        type: 'GET',
        url: getAPI() + '/vendas',
    }).done(function (res) {
        nId = res.length;

        var oVenda = {};
        var cid = parseInt(sessionStorage.getItem("cid", cid));
        oVenda.id =  nId;
        oVenda.clienteId =  cid ? cid : 0;
        oVenda.desconto = 0;
        oVenda.transportadoraId = $("#select-ship").val();
        oVenda.desconto = $("#vl_desconto").val();
        oVenda.txEntrega = $("#tx_entrega").val();
        oVenda.formaPgto = $("#pay-method").val();
        var today = new Date();
        var date = today.getDay();
        if(date.toString().length < 2)
            date = "0" + date;
        var month = today.getMonth();
        if(month.toString().length < 2)
            month = "0" + month;
        oVenda.data = date + "/" + month + "/" + today.getFullYear();
    
        $.ajax({
            type: 'POST',
            url: getAPI() + '/vendas',
            data: oVenda
        }).done(function () {
            gravaItensVenda(nId);
        }).fail(function() {
            toast("Falha ao salvar os dados");
            hideLoading();
        });
    });
}

function gravaItensVenda(vendaId) {
    var chartItems = JSON.parse(sessionStorage.getItem("chart"));

    chartItems.forEach(vendaItem => {
        var storeItem = {};
        storeItem.vendaId = vendaId,
        storeItem.itemId = vendaItem.id;
        storeItem.qtd = vendaItem.quantidade;

        $.ajax({
            type: 'POST',
            url: getAPI() + '/itensVenda',
            data: storeItem
        }).done(function () {
            toast("Venda registrada com sucesso");
        }).fail(function() {
            toast("Falha ao salvar os dados");
        }).always(function() {
            hideLoading();
        });
    });

    finalizaProcesso();
}

function finalizaProcesso() {
    var greetingData = `
        <div class="finished">
            <h5>Pedido Concluído</h5>
            <p>Seu pedido já está no nosso banco de dados</p>
            <p>Obrigado pela preferência</p>
            <a href="index.html" class="btn waves-effect waves-light green lighten-2" type="submit" id="goHome" name="home">Voltar para o início
                <i class="material-icons right">home</i>
            </a>
        </div>
    `;
    $(".container").html(greetingData);
}