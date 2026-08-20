document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // ELEMENTOS DA PÁGINA
    // ==================================================

    const nomeUsuario = document.getElementById("nomeUsuario");
    const salarioUsuario = document.getElementById("salarioUsuario");
    const extraUsuario = document.getElementById("extraUsuario");
    const saldoDisponivel = document.getElementById("saldoDisponivel");
    const totalGastos = document.getElementById("totalGastos");

    const listaGastos = document.getElementById("listaGastos");
    const contadorGastos = document.getElementById("contadorGastos");
    const historicoCategorias =
        document.getElementById("historicoCategorias");


    // ==================================================
    // VALOR EXTRA
    // ==================================================

    const descricaoExtra =
        document.getElementById("descricaoExtra");

    const valorExtra =
        document.getElementById("valorExtra");

    const btnAdicionarExtra =
        document.getElementById("btnAdicionarExtra");

    const mensagemExtra =
        document.getElementById("mensagemExtra");


    // ==================================================
    // GASTOS
    // ==================================================

    const nomeGasto =
        document.getElementById("nomeGasto");

    const valorGasto =
        document.getElementById("valorGasto");

    const categoriaGasto =
        document.getElementById("categoriaGasto");

    const btnAdicionarGasto =
        document.getElementById("btnAdicionarGasto");

    const mensagemGasto =
        document.getElementById("mensagemGasto");


    // ==================================================
    // META
    // ==================================================

    const valorMeta =
        document.getElementById("valorMeta");

    const btnSalvarMeta =
        document.getElementById("btnSalvarMeta");

    const textoMeta =
        document.getElementById("textoMeta");

    const dataMeta =
        document.getElementById("dataMeta");

    const porcentagemMeta =
        document.getElementById("porcentagemMeta");

    const barraMeta =
        document.getElementById("barraMeta");

    const mensagemMeta =
        document.getElementById("mensagemMeta");

    const alertaMeta =
        document.getElementById("alertaMeta");


    // ==================================================
    // DICAS
    // ==================================================

    const dicaRotativa =
        document.getElementById("dicaRotativa");


    // ==================================================
    // DADOS DO LOCALSTORAGE
    // ==================================================

    const nome =
        localStorage.getItem("ecofinNome") || "Usuário";

    const salario =
        Number(
            localStorage.getItem("ecofinSalario")
        ) || 0;

    let extra =
        Number(
            localStorage.getItem("ecofinExtra")
        ) || 0;

    let gastos =
        JSON.parse(
            localStorage.getItem("ecofinGastos")
        ) || [];

    let meta =
        Number(
            localStorage.getItem("ecofinMeta")
        ) || 0;


    // ==================================================
    // MOSTRAR NOME
    // ==================================================

    nomeUsuario.textContent = nome;


    // ==================================================
    // FORMATAÇÃO DE MOEDA
    // ==================================================

    function formatarMoeda(valor) {

        return Number(valor).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    // ==================================================
    // TOTAL DE GASTOS
    // ==================================================

    function calcularTotalGastos() {

        return gastos.reduce(
            function (soma, gasto) {

                return soma + Number(gasto.valor);

            },
            0
        );

    }


    // ==================================================
    // DINHEIRO DISPONÍVEL
    // ==================================================

    function calcularSaldo() {

        return (
            salario +
            extra -
            calcularTotalGastos()
        );

    }


    // ==================================================
    // SISTEMA DE NOTIFICAÇÕES
    // ==================================================

    function criarNotificacao(
        tipo,
        titulo,
        mensagem,
        chave
    ) {

        let notificacoes =
            JSON.parse(
                localStorage.getItem(
                    "ecofinNotificacoes"
                )
            ) || [];


        /*
            A chave evita que o mesmo aviso
            seja criado várias vezes.
        */

        if (
            chave &&
            localStorage.getItem(
                "ecofinAviso_" + chave
            )
        ) {

            return;

        }


        const novaNotificacao = {

            id: Date.now(),

            tipo: tipo,

            titulo: titulo,

            mensagem: mensagem,

            data:
                new Date().toLocaleString(
                    "pt-BR"
                )

        };


        notificacoes.unshift(
            novaNotificacao
        );


        localStorage.setItem(
            "ecofinNotificacoes",
            JSON.stringify(notificacoes)
        );


        if (chave) {

            localStorage.setItem(
                "ecofinAviso_" + chave,
                "true"
            );

        }

    }


    // ==================================================
    // VERIFICAR NOTIFICAÇÕES DA META
    // ==================================================

    function verificarNotificacoesMeta() {

        if (meta <= 0) {
            return;
        }


        const saldo =
            calcularSaldo();


        const percentual =
            (saldo / meta) * 100;


        // ----------------------------------------------
        // META ULTRAPASSADA
        // ----------------------------------------------

        if (percentual > 100) {

            criarNotificacao(
                "meta",
                "Meta ultrapassada!",
                `Você tem ${formatarMoeda(saldo)} disponíveis e sua meta é ${formatarMoeda(meta)}.`,
                "meta-ultrapassada-" + meta
            );

        }


        // ----------------------------------------------
        // META ALCANÇADA
        // ----------------------------------------------

        else if (percentual >= 100) {

            criarNotificacao(
                "meta",
                "Meta alcançada!",
                `Parabéns! Você alcançou sua meta de economizar ${formatarMoeda(meta)}.`,
                "meta-alcancada-" + meta
            );

        }


        // ----------------------------------------------
        // MAIS DE 50%
        // ----------------------------------------------

        else if (percentual >= 50) {

            criarNotificacao(
                "atencao",
                "Você está quase lá!",
                `Você já alcançou ${percentual.toFixed(0)}% da sua meta de economia.`,
                "meta-50-" + meta
            );

        }

    }


    // ==================================================
    // ATUALIZAR TELA
    // ==================================================

    function atualizarTela() {

        const total =
            calcularTotalGastos();

        const saldo =
            calcularSaldo();


        salarioUsuario.textContent =
            formatarMoeda(salario);


        extraUsuario.textContent =
            formatarMoeda(extra);


        totalGastos.textContent =
            formatarMoeda(total);


        saldoDisponivel.textContent =
            formatarMoeda(saldo);


        contadorGastos.textContent =
            gastos.length +
            (
                gastos.length === 1
                    ? " gasto"
                    : " gastos"
            );


        mostrarGastos();

        mostrarCategorias();

        atualizarMeta();

        verificarNotificacoesMeta();

    }


    // ==================================================
    // ADICIONAR VALOR EXTRA
    // ==================================================

    btnAdicionarExtra.addEventListener(
        "click",
        function () {

            const descricao =
                descricaoExtra.value.trim();

            const valor =
                Number(
                    valorExtra.value
                );


            if (descricao === "") {

                mensagemExtra.textContent =
                    "Digite uma descrição.";

                return;

            }


            if (
                valor <= 0 ||
                isNaN(valor)
            ) {

                mensagemExtra.textContent =
                    "Digite um valor válido.";

                return;

            }


            extra += valor;


            localStorage.setItem(
                "ecofinExtra",
                extra
            );


            criarNotificacao(
                "extra",
                "Valor extra adicionado",
                `${descricao}: ${formatarMoeda(valor)} foi adicionado ao seu saldo.`,
                "extra-" + Date.now()
            );


            mensagemExtra.textContent =
                `${descricao} de ${formatarMoeda(valor)} adicionado!`;


            descricaoExtra.value = "";

            valorExtra.value = "";


            atualizarTela();

        }
    );


    // ==================================================
    // ADICIONAR GASTO
    // ==================================================

    btnAdicionarGasto.addEventListener(
        "click",
        function () {

            const nomeDoGasto =
                nomeGasto.value.trim();

            const valor =
                Number(
                    valorGasto.value
                );

            const categoria =
                categoriaGasto.value;


            if (nomeDoGasto === "") {

                mensagemGasto.textContent =
                    "Digite o que você gastou.";

                return;

            }


            if (
                valor <= 0 ||
                isNaN(valor)
            ) {

                mensagemGasto.textContent =
                    "Digite um valor válido.";

                return;

            }


            if (categoria === "") {

                mensagemGasto.textContent =
                    "Escolha uma categoria.";

                return;

            }


            const novoGasto = {

                nome: nomeDoGasto,

                valor: valor,

                categoria: categoria,

                data:
                    new Date().toLocaleDateString(
                        "pt-BR"
                    )

            };


            gastos.push(
                novoGasto
            );


            localStorage.setItem(
                "ecofinGastos",
                JSON.stringify(gastos)
            );


            criarNotificacao(
                "gasto",
                "Novo gasto registrado",
                `${nomeDoGasto}: ${formatarMoeda(valor)} na categoria ${categoria}.`,
                "gasto-" + Date.now()
            );


            // ------------------------------------------
            // ALERTA DE SALDO NEGATIVO
            // ------------------------------------------

            const novoSaldo =
                calcularSaldo();


            if (novoSaldo < 0) {

                criarNotificacao(
                    "atencao",
                    "Atenção ao seu saldo!",
                    `Seus gastos ultrapassaram seu dinheiro disponível em ${formatarMoeda(Math.abs(novoSaldo))}.`,
                    "saldo-negativo"
                );

            }


            // ------------------------------------------
            // ALERTA DE SALDO BAIXO
            // ------------------------------------------

            else if (
                salario + extra > 0 &&
                novoSaldo <=
                (salario + extra) * 0.20
            ) {

                criarNotificacao(
                    "atencao",
                    "Seu saldo está baixo",
                    `Você possui apenas ${formatarMoeda(novoSaldo)} disponíveis.`,
                    "saldo-baixo"
                );

            }


            mensagemGasto.textContent =
                "Gasto adicionado com sucesso!";


            nomeGasto.value = "";

            valorGasto.value = "";

            categoriaGasto.value = "";


            atualizarTela();

        }
    );


    // ==================================================
    // HISTÓRICO DE GASTOS
    // ==================================================

    function mostrarGastos() {

        if (gastos.length === 0) {

            listaGastos.innerHTML = `
                <div class="vazio">
                    Nenhum gasto registrado.
                </div>
            `;

            return;

        }


        listaGastos.innerHTML = "";


        const gastosInvertidos =
            [...gastos].reverse();


        gastosInvertidos.forEach(
            function (gasto) {

                const item =
                    document.createElement("div");


                item.className =
                    "item-gasto";


                item.innerHTML = `

                    <div class="gasto-info">

                        <strong>
                            ${gasto.nome}
                        </strong>

                        <small>
                            ${gasto.categoria}
                            •
                            ${gasto.data}
                        </small>

                    </div>

                    <strong class="valor-gasto">
                        - ${formatarMoeda(gasto.valor)}
                    </strong>

                `;


                listaGastos.appendChild(
                    item
                );

            }
        );

    }


    // ==================================================
    // GASTOS POR CATEGORIA
    // ==================================================

    function mostrarCategorias() {

        if (gastos.length === 0) {

            historicoCategorias.innerHTML = `
                <div class="vazio">
                    Nenhum gasto registrado.
                </div>
            `;

            return;

        }


        const categorias = {};


        gastos.forEach(
            function (gasto) {

                if (
                    !categorias[gasto.categoria]
                ) {

                    categorias[gasto.categoria] =
                        0;

                }


                categorias[gasto.categoria] +=
                    Number(gasto.valor);

            }
        );


        historicoCategorias.innerHTML = "";


        Object.keys(categorias).forEach(
            function (categoria) {

                const item =
                    document.createElement("div");


                item.className =
                    "categoria-item";


                item.innerHTML = `

                    <div>
                        <strong>
                            ${categoria}
                        </strong>
                    </div>

                    <strong>
                        ${formatarMoeda(
                            categorias[categoria]
                        )}
                    </strong>

                `;


                historicoCategorias.appendChild(
                    item
                );

            }
        );

    }


    // ==================================================
    // SALVAR META
    // ==================================================

    btnSalvarMeta.addEventListener(
        "click",
        function () {

            const novaMeta =
                Number(
                    valorMeta.value
                );


            if (
                novaMeta <= 0 ||
                isNaN(novaMeta)
            ) {

                mensagemMeta.textContent =
                    "Digite um valor válido para sua meta.";

                return;

            }


            meta =
                novaMeta;


            localStorage.setItem(
                "ecofinMeta",
                meta
            );


            /*
                Quando uma nova meta é criada,
                permitimos que os avisos dela
                sejam gerados novamente.
            */

            localStorage.removeItem(
                "ecofinAviso_meta-50-" + meta
            );

            localStorage.removeItem(
                "ecofinAviso_meta-alcancada-" + meta
            );

            localStorage.removeItem(
                "ecofinAviso_meta-ultrapassada-" + meta
            );


            criarNotificacao(
                "meta",
                "Nova meta criada",
                `Sua nova meta é economizar ${formatarMoeda(meta)} até o final do mês.`,
                "nova-meta-" + Date.now()
            );


            mensagemMeta.textContent =
                "Meta salva com sucesso!";


            valorMeta.value = "";


            atualizarMeta();

        }
    );


    // ==================================================
    // ATUALIZAR META
    // ==================================================

    function atualizarMeta() {

        if (meta <= 0) {

            textoMeta.textContent =
                "Nenhuma meta cadastrada.";

            dataMeta.textContent =
                "Até o final do mês";

            porcentagemMeta.textContent =
                "0%";

            barraMeta.style.width =
                "0%";

            mensagemMeta.textContent =
                "Nenhuma meta cadastrada.";

            alertaMeta.innerHTML =
                "";

            return;

        }


        const dinheiroDisponivel =
            calcularSaldo();


        let percentual =
            (
                dinheiroDisponivel /
                meta
            ) * 100;


        if (percentual < 0) {

            percentual = 0;

        }


        const percentualVisual =
            Math.min(
                percentual,
                100
            );


        textoMeta.textContent =
            `Meta: economizar ${formatarMoeda(meta)}`;


        dataMeta.textContent =
            "Até o final do mês";


        porcentagemMeta.textContent =
            percentual.toFixed(0) + "%";


        barraMeta.style.width =
            percentualVisual + "%";


        if (dinheiroDisponivel >= 0) {

            mensagemMeta.textContent =
                `Você tem ${formatarMoeda(dinheiroDisponivel)} disponíveis para economizar de ${formatarMoeda(meta)}.`;

        } else {

            mensagemMeta.textContent =
                `Você está ${formatarMoeda(Math.abs(dinheiroDisponivel))} abaixo de zero.`;

        }


        if (percentual > 100) {

            alertaMeta.innerHTML = `
                🚀 <strong>Excelente!</strong><br>
                Você ultrapassou sua meta de economia!
                <br><br>
                Meta:
                ${formatarMoeda(meta)}
                <br>
                Disponível:
                ${formatarMoeda(dinheiroDisponivel)}
            `;

        }

        else if (percentual >= 100) {

            alertaMeta.innerHTML = `
                🎉 <strong>Parabéns!</strong><br>
                Você alcançou sua meta de economia!
                <br><br>
                Sua meta era:
                ${formatarMoeda(meta)}
            `;

        }

        else if (percentual >= 50) {

            alertaMeta.innerHTML = `
                ⚠️ <strong>Você está quase lá!</strong><br>
                Já alcançou mais de 50% da sua meta.
                Continue cuidando do seu dinheiro!
                <br><br>
                Economizado:
                ${formatarMoeda(dinheiroDisponivel)}
                <br>
                Meta:
                ${formatarMoeda(meta)}
            `;

        }

        else {

            alertaMeta.innerHTML = `
                💡 <strong>Continue assim!</strong><br>
                Você está construindo sua economia.
                <br><br>
                Economizado:
                ${formatarMoeda(dinheiroDisponivel)}
                <br>
                Meta:
                ${formatarMoeda(meta)}
            `;

        }

    }


    // ==================================================
    // DICAS ROTATIVAS
    // ==================================================

    const dicas = [

        "💡 Organizar seus gastos é o primeiro passo para cuidar do seu dinheiro.",

        "💰 Antes de comprar, veja se esse gasto cabe no seu orçamento.",

        "📊 Conhecer para onde seu dinheiro está indo ajuda a tomar decisões melhores.",

        "🎯 Definir uma meta ajuda você a ter um objetivo financeiro.",

        "📝 Registrar pequenos gastos também é importante.",

        "🚨 Evite gastar mais do que você recebe.",

        "💵 Um dinheiro extra pode ajudar sua meta.",

        "🛒 Antes de comprar algo, pergunte: eu realmente preciso disso?",

        "📚 Educação financeira ajuda você a tomar melhores decisões."

    ];


    let indiceDica = 0;


    setInterval(
        function () {

            indiceDica++;


            if (
                indiceDica >= dicas.length
            ) {

                indiceDica = 0;

            }


            dicaRotativa.style.opacity =
                "0";


            setTimeout(
                function () {

                    dicaRotativa.textContent =
                        dicas[indiceDica];

                    dicaRotativa.style.opacity =
                        "1";

                },
                300
            );

        },
        5000
    );


    // ==================================================
    // INICIAR
    // ==================================================

    atualizarTela();

});