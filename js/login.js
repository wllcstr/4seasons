$(document).ready(function() {
    if(sessionStorage.token)
        window.location = "index.html";

    hideLoading();

    $("#btn_logon").click(authorizeUser);

    // em termos de UX, seria interessante o campo de senha responder ao "RETURN" do teclado
    $("#pwd_senha").on('keydown', function(e) {
        if (e.which == 13) {
            authorizeUser();
        }
    });
});

function authorizeUser() {
    var loginData = {
        grant_type: 'password',
        username: $("#txt_nome").val(),
        password: $("#pwd_senha").val()
    };

    if(!loginData.username || !loginData.password) {
        toast('Necessário informar nome de usuário e senha para acesso ao sistema')
        return;
    }

    showLoading();
    $.ajax({
        type: 'GET',
        url: getAPI() + '/usuarios?nome=' + loginData.username,
    }).done(function (res) {
        hideLoading();
        if(res.length < 1) {
            toast('Usuário não encontrado');
            return;
        }
        if(res[0].senha != loginData.password) {
            toast('Senha inválida');
            return;
        }
        sessionStorage.setItem("username", res[0].nome);
        sessionStorage.setItem("role", res[0].role);
        sessionStorage.setItem("uid", res[0].id);
        sessionStorage.setItem("chart", JSON.stringify([]));
        window.location = "index.html";
    });
}