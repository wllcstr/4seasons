$(document).ready(function () {
    showLoading();
    $("#btn_logout").click(function() {
        logOut();
        window.location = "login.html";
    });

    if(!checkAuth)
        window.location = "login.html";

    $('.fixed-action-btn').floatingActionButton();
    $('.modal').modal();
    $("#clear-chart").click(clearChartItens);
    getProdutos();
    getChartItens();

    var cid = parseInt(getUrlVars()["cid"]);
    if(cid > 0) {
        sessionStorage.setItem("cid", cid);

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
            $(".collection-modal").append(addToModal(produto))
        });
    });
}

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

    $("#total-order").html("Total: R$ " + parseFloat(total).toFixed(2));
}

function clearChartItens() {
    sessionStorage.setItem("chart", JSON.stringify([]));
    getChartItens();
}

function addChartItem(pid) {
    showLoading();
    var nItemVenda = {};
    var chartItems = JSON.parse(sessionStorage.getItem("chart"));

    for(var i = 0; i < chartItems.length; i++) {
        if(chartItems[i].id == pid) {
            chartItems[i].quantidade = chartItems[i].quantidade + 1;
            sessionStorage.setItem("chart", JSON.stringify(chartItems));
            getChartItens();
            hideLoading();
            return;
        }
    }

    $.ajax({
        type: 'GET',
        url: getAPI() + '/produtos/' + pid ,
    }).done(function (res) {
        hideLoading();
        if(res) {
            nItemVenda.id = pid;
            nItemVenda.nome = res.nome;
            nItemVenda.quantidade = 1;
            nItemVenda.valor = res.valor;

            chartItems.push(nItemVenda);
            sessionStorage.setItem("chart", JSON.stringify(chartItems));
            getChartItens();
        }
    });
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

function addToModal(produto) {
    return `
    <li class="collection-item avatar">
        <div class="col s3">
            <span class="title"><br>` + produto.nome + `</b></span>
        </div>
        <div class="input-field col s6">
            <b>Valor:</b> R$ ` + parseFloat(produto.valor).toFixed(2) + `
        </div>
        <div class="col s3">
            <a id="` + produto.id + `" onclick="addChartItem(` + produto.id + `)" class="modal-close secondary-content add-item"><i class="material-icons">add</i></a>
        </div>
    </li>
    `;
}

