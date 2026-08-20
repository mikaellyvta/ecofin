document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formCadastro");
    const nomeInput = document.getElementById("nome");
    const salarioInput = document.getElementById("salarioCadastro");
    const mensagem = document.getElementById("mensagemCadastro");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const nome = nomeInput.value.trim();
        const salario = Number(salarioInput.value);

        if (nome === "") {
            mensagem.textContent = "Digite seu nome.";
            return;
        }

        if (salario <= 0 || isNaN(salario)) {
            mensagem.textContent = "Digite um salário válido.";
            return;
        }

        localStorage.setItem("ecofinNome", nome);
        localStorage.setItem("ecofinSalario", salario);

        localStorage.setItem("ecofinExtra", "0");
        localStorage.setItem("ecofinGastos", "[]");
        localStorage.setItem("ecofinMeta", "0");
        localStorage.setItem("ecofinNotificacoes", "[]");

        localStorage.setItem("ecofinCadastroRealizado", "true");

        mensagem.textContent =
            "Cadastro realizado! Entrando no EcoFin...";

        setTimeout(function () {
            window.location.href = "home.html";
        }, 700);

    });

});