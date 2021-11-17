function getAPI() {
    return "http://localhost:3000";
}

function toast(msg) {
    M.Toast.dismissAll();
    M.toast({html: msg, classes: 'rounded'});
}

// https://stackoverflow.com/questions/4656843/jquery-get-querystring-from-url
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// usando visibility aqui pra manter o layout da página
function showLoading() {
    $(".progress").css("visibility", "visible");
}

function hideLoading() {
    $(".progress").css("visibility", "hidden");
}

function logOut() {
    sessionStorage.clear();
}

function checkAuth() {
   return sessionStorage.getItem("username");
}

function createOptions() {
    if(sessionStorage.role == "funcionario") {
        return `
            <div class="row">
                <button class="btn waves-effect waves-light green lighten-2" type="submit" id="btn_clientes" name="client">Clientes
                    <i class="material-icons right">supervisor_account</i>
                </button>
            </div>
            <div class="row">
                <button class="btn waves-effect waves-light green lighten-2" type="submit" id="btn_transportadoras" name="shipment">Transportadoras
                    <i class="material-icons right">local_shipping</i>
                </button>
            </div>
            <div class="row">
                <button class="btn waves-effect waves-light green lighten-2" type="submit" id="btn_estoque" name="stock">Estoque
                    <i class="material-icons right">store</i>
                </button>
            </div>
            <div class="row">
                <button class="btn waves-effect waves-light green lighten-2" type="submit" id="btn_reports" name="reports">Relatório de Vendas
                    <i class="material-icons right">featured_play_list</i>
                </button>
            </div>
            <div class="row">
                <button class="btn waves-effect waves-light" type="submit" id="btn_order" name="order">Nova Venda
                    <i class="material-icons right">shopping_cart</i>
                </button>
            </div>
            `;
    }
    return `
        <div class="row">
            <button class="btn waves-effect waves-light green lighten-2" type="submit" id="btn_profile" name="profile">Meu Perfil
                <i class="material-icons right">supervisor_account</i>
            </button>
        </div>
        <div class="row">
            <button class="btn waves-effect waves-light" type="submit" id="btn_order" name="order">Novo Pedido
                <i class="material-icons right">shopping_cart</i>
            </button>
        </div>
    `;
}