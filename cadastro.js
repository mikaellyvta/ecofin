document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("formCadastro");

    const nomeInput =
        document.getElementById("nome");

    const salarioInput =
        document.getElementById("salarioCadastro");

    const mensagem =
        document.getElementById("mensagemCadastro");


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const nome =
            nomeInput.value.trim();

        const salario =
            Number(salarioInput.value);


        // VALIDAR NOME

        if (nome === "") {

            mensagem.textContent =
                "Digite seu nome.";

            return;
        }


        // VALIDAR SALÁRIO

        if (
            salario <= 0 ||
            isNaN(salario)
        ) {

            mensagem.textContent =
                "Digite um salário válido.";

            return;
        }


        // SALVAR DADOS

        localStorage.setItem(
            "ecofinNome",
            nome
        );

        localStorage.setItem(
            "ecofinSalario",
            salario
        );


        // COMEÇAR SEM VALORES EXTRAS

        localStorage.setItem(
            "ecofinExtra",
            "0"
        );


        // COMEÇAR SEM GASTOS

        localStorage.setItem(
            "ecofinGastos",
            "[]"
        );


        // COMEÇAR SEM META

        localStorage.setItem(
            "ecofinMeta",
            "0"
        );


        // COMEÇAR SEM NOTIFICAÇÕES

        localStorage.setItem(
            "ecofinNotificacoes",
            "[]"
        );


        mensagem.textContent =
            "Cadastro realizado! Entrando no EcoFin...";


        setTimeout(function () {

            window.location.href =
                "index.html";

        }, 700);

    });

});