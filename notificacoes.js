document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ==================================================
        // ELEMENTOS
        // ==================================================

        const totalNotificacoes =
            document.getElementById(
                "totalNotificacoes"
            );


        const listaNotificacoes =
            document.getElementById(
                "listaNotificacoes"
            );


        const limparNotificacoes =
            document.getElementById(
                "limparNotificacoes"
            );



        // ==================================================
        // PEGAR NOTIFICAÇÕES
        // ==================================================

        let notificacoes =
            JSON.parse(
                localStorage.getItem(
                    "ecofinNotificacoes"
                )
            ) || [];



        // ==================================================
        // MOSTRAR NOTIFICAÇÕES
        // ==================================================

        function mostrarNotificacoes() {


            totalNotificacoes.textContent =
                notificacoes.length;


            // ----------------------------------------------
            // NENHUMA NOTIFICAÇÃO
            // ----------------------------------------------

            if (
                notificacoes.length === 0
            ) {

                listaNotificacoes.innerHTML = `

                    <div class="notificacao-vazia">

                        <span>
                            🔔
                        </span>

                        <p>
                            Nenhuma notificação ainda.
                        </p>

                        <small>
                            Os avisos aparecerão
                            conforme você utilizar
                            o EcoFin.
                        </small>

                    </div>

                `;

                return;

            }


            // ----------------------------------------------
            // LIMPAR LISTA
            // ----------------------------------------------

            listaNotificacoes.innerHTML =
                "";


            // ----------------------------------------------
            // CRIAR CADA NOTIFICAÇÃO
            // ----------------------------------------------

            notificacoes.forEach(
                function (notificacao) {


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "notificacao-item";


                    // --------------------------------------
                    // ÍCONE
                    // --------------------------------------

                    let icone =
                        "🔔";


                    if (
                        notificacao.tipo ===
                        "meta"
                    ) {

                        icone =
                            "🎯";

                    }


                    else if (
                        notificacao.tipo ===
                        "atencao"
                    ) {

                        icone =
                            "⚠️";

                    }


                    else if (
                        notificacao.tipo ===
                        "gasto"
                    ) {

                        icone =
                            "💸";

                    }


                    else if (
                        notificacao.tipo ===
                        "extra"
                    ) {

                        icone =
                            "🎁";

                    }


                    // --------------------------------------
                    // NOTIFICAÇÃO
                    // --------------------------------------

                    item.innerHTML = `

                        <div class="notificacao-icone">
                            ${icone}
                        </div>


                        <div class="notificacao-conteudo">

                            <strong>
                                ${notificacao.titulo}
                            </strong>


                            <p>
                                ${notificacao.mensagem}
                            </p>


                            <small>
                                ${notificacao.data}
                            </small>

                        </div>

                    `;


                    listaNotificacoes.appendChild(
                        item
                    );

                }
            );

        }



        // ==================================================
        // LIMPAR NOTIFICAÇÕES
        // ==================================================

        limparNotificacoes.addEventListener(
            "click",
            function () {


                if (
                    notificacoes.length === 0
                ) {

                    return;

                }


                const confirmar =
                    confirm(
                        "Deseja realmente limpar todas as notificações?"
                    );


                if (!confirmar) {

                    return;

                }


                // ------------------------------------------
                // APAGAR NOTIFICAÇÕES
                // ------------------------------------------

                notificacoes = [];


                localStorage.setItem(
                    "ecofinNotificacoes",
                    JSON.stringify(
                        notificacoes
                    )
                );


                // ------------------------------------------
                // ATUALIZAR
                // ------------------------------------------

                mostrarNotificacoes();

            }
        );



        // ==================================================
        // INICIAR
        // ==================================================

        mostrarNotificacoes();

    }
);