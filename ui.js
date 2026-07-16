/*==========================================================
ROMTECH CONTROLE
UI.JS
VERSÃO 2.0
==========================================================*/

/*==========================================================
CONFIGURAÇÕES
==========================================================*/

const NotificationCenter = {

    notificacoes: [],

    quantidade: 0

};

/*==========================================================
LOADER
==========================================================*/

const loader = {

    show() {

        const elemento = document.getElementById("loading");

        if (elemento) {

            elemento.style.display = "flex";

        }

    },

    hide() {

        const elemento = document.getElementById("loading");

        if (elemento) {

            elemento.style.display = "none";

        }

    }

};

/*==========================================================
TOAST
==========================================================*/

function toast(

    mensagem,

    tipo = "success",

    tempo = 3000

) {

    const elemento = document.getElementById("toast");

    if (!elemento) return;

    elemento.className = "toast show " + tipo;

    elemento.innerHTML = mensagem;

    setTimeout(() => {

        elemento.classList.remove("show");

    }, tempo);

}

/*==========================================================
NOTIFICATION CENTER
==========================================================*/

function notify(

    mensagem,

    tipo = "info"

) {

    toast(

        mensagem,

        tipo

    );

    NotificationCenter.quantidade++;

    NotificationCenter.notificacoes.unshift({

        mensagem,

        tipo,

        data: new Date()

    });

    atualizarBadge();

    atualizarLista();

    salvarNotificacoes();

}

/*==========================================================
BADGE
==========================================================*/

function atualizarBadge() {

    const badge = document.getElementById("notificationBadge");

    if (!badge) return;

    badge.innerHTML = NotificationCenter.quantidade;

    badge.style.display =

        NotificationCenter.quantidade > 0

            ? "flex"

            : "none";

}

/*==========================================================
LISTA
==========================================================*/

function atualizarLista() {

    const lista = document.getElementById("notificationList");

    if (!lista) return;

    lista.innerHTML = "";

    NotificationCenter.notificacoes.forEach(item => {

        const li = document.createElement("div");

        li.className = "notification-item";

        li.innerHTML = `

            <div>

                <strong>${item.mensagem}</strong>

                <br>

                <small>${item.data.toLocaleString("pt-BR")}</small>

            </div>

        `;

        lista.appendChild(li);

    });

}

/*==========================================================
SALVAR
==========================================================*/

function salvarNotificacoes() {

    sessionStorage.setItem(

        "romtech_notifications",

        JSON.stringify(

            NotificationCenter.notificacoes

        )

    );

}

/*==========================================================
CARREGAR
==========================================================*/

function carregarNotificacoes() {

    const dados = sessionStorage.getItem(

        "romtech_notifications"

    );

    if (!dados) return;

    NotificationCenter.notificacoes = JSON.parse(dados);

    NotificationCenter.quantidade =

        NotificationCenter.notificacoes.length;

    atualizarBadge();

    atualizarLista();

}

/*==========================================================
LIMPAR
==========================================================*/

function limparNotificacoes() {

    NotificationCenter.notificacoes = [];

    NotificationCenter.quantidade = 0;

    atualizarBadge();

    atualizarLista();

    sessionStorage.removeItem(

        "romtech_notifications"

    );

}

/*==========================================================
CONFIRM
==========================================================*/

function confirmar(mensagem) {

    return window.confirm(mensagem);

}

/*==========================================================
ALERT
==========================================================*/

function alertar(mensagem) {

    window.alert(mensagem);

}

/*==========================================================
PROMPT
==========================================================*/

function perguntar(

    mensagem,

    valor = ""

) {

    return window.prompt(

        mensagem,

        valor

    );

}

/*==========================================================
INICIALIZAÇÃO
==========================================================*/

carregarNotificacoes();

/*==========================================================
MODAL MANAGER
==========================================================*/

const modal = {

    abrir(id){

        const elemento = document.getElementById(id);

        if(!elemento){

            return;

        }

        elemento.classList.add("show");

        document.body.style.overflow = "hidden";

    },

    fechar(id){

        const elemento = document.getElementById(id);

        if(!elemento){

            return;

        }

        elemento.classList.remove("show");

        document.body.style.overflow = "";

    },

    fecharTodos(){

        document

            .querySelectorAll(".modal")

            .forEach(modal=>{

                modal.classList.remove("show");

            });

        document.body.style.overflow = "";

    }

};

/*==========================================================
FECHAR AO CLICAR FORA
==========================================================*/

document.addEventListener("click",e=>{

    if(e.target.classList.contains("modal")){

        e.target.classList.remove("show");

        document.body.style.overflow = "";

    }

});

/*==========================================================
ESC FECHA MODAL
==========================================================*/

document.addEventListener("keydown",e=>{

    if(e.key==="Escape"){

        modal.fecharTodos();

    }

});

/*==========================================================
CONFIRM CUSTOM
==========================================================*/

function confirmarModal(

    titulo,

    mensagem

){

    return new Promise(resolve=>{

        const tituloElemento=document.getElementById("confirmTitulo");

        const mensagemElemento=document.getElementById("confirmMensagem");

        const btnSim=document.getElementById("confirmSim");

        const btnNao=document.getElementById("confirmNao");

        tituloElemento.innerHTML=titulo;

        mensagemElemento.innerHTML=mensagem;

        modal.abrir("modalConfirmacao");

        btnSim.onclick=()=>{

            modal.fechar("modalConfirmacao");

            resolve(true);

        };

        btnNao.onclick=()=>{

            modal.fechar("modalConfirmacao");

            resolve(false);

        };

    });

}

/*==========================================================
ALERT CUSTOM
==========================================================*/

function alertaModal(

    titulo,

    mensagem,

    tipo="info"

){

    return new Promise(resolve=>{

        document.getElementById("alertTitulo").innerHTML=titulo;

        document.getElementById("alertMensagem").innerHTML=mensagem;

        const btnOk=document.getElementById("alertOk");

        modal.abrir("modalAlerta");

        btnOk.onclick=()=>{

            modal.fechar("modalAlerta");

            resolve(true);

        };

    });

}

/*==========================================================
PROMPT CUSTOM
==========================================================*/

function promptModal(

    titulo,

    mensagem,

    valor=""

){

    return new Promise(resolve=>{

        document.getElementById("promptTitulo").innerHTML=titulo;

        document.getElementById("promptMensagem").innerHTML=mensagem;

        const input=document.getElementById("promptValor");

        input.value=valor;

        modal.abrir("modalPrompt");

        document.getElementById("promptCancelar").onclick=()=>{

            modal.fechar("modalPrompt");

            resolve(null);

        };

        document.getElementById("promptOk").onclick=()=>{

            modal.fechar("modalPrompt");

            resolve(input.value);

        };

    });

}

/*==========================================================
SPINNER BUTTON
==========================================================*/

function bloquearBotao(

    botao,

    texto="Processando..."

){

    if(!botao){

        return;

    }

    botao.dataset.html=botao.innerHTML;

    botao.disabled=true;

    botao.innerHTML=`

        <i class="fa-solid fa-spinner fa-spin"></i>

        ${texto}

    `;

}

function desbloquearBotao(botao){

    if(!botao){

        return;

    }

    botao.disabled=false;

    botao.innerHTML=botao.dataset.html;

}

/*==========================================================
EXPORTAÇÃO
==========================================================*/

export{

    modal,

    confirmarModal,

    alertaModal,

    promptModal,

    bloquearBotao,

    desbloquearBotao

};
/*==========================================================
FORMATAÇÃO DE DATAS
==========================================================*/

function data(data){

    if(!data){

        return "";

    }

    if(data.seconds){

        data=new Date(data.seconds*1000);

    }

    return data.toLocaleDateString("pt-BR");

}

function dataHora(data){

    if(!data){

        return "";

    }

    if(data.seconds){

        data=new Date(data.seconds*1000);

    }

    return data.toLocaleString("pt-BR");

}

function hora(data){

    if(!data){

        return "";

    }

    if(data.seconds){

        data=new Date(data.seconds*1000);

    }

    return data.toLocaleTimeString("pt-BR");

}

/*==========================================================
MOEDA
==========================================================*/

function moeda(valor){

    valor=Number(valor||0);

    return valor.toLocaleString(

        "pt-BR",

        {

            style:"currency",

            currency:"BRL"

        }

    );

}

/*==========================================================
NÚMEROS
==========================================================*/

function numero(valor){

    return Number(valor||0).toLocaleString("pt-BR");

}

/*==========================================================
PORCENTAGEM
==========================================================*/

function porcentagem(valor){

    return Number(valor||0).toLocaleString(

        "pt-BR",

        {

            minimumFractionDigits:2,

            maximumFractionDigits:2

        }

    )+" %";

}

/*==========================================================
CPF
==========================================================*/

function cpf(valor){

    valor=(valor||"").replace(/\D/g,"");

    return valor.replace(

        /(\d{3})(\d{3})(\d{3})(\d{2})/,

        "$1.$2.$3-$4"

    );

}

/*==========================================================
CNPJ
==========================================================*/

function cnpj(valor){

    valor=(valor||"").replace(/\D/g,"");

    return valor.replace(

        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,

        "$1.$2.$3/$4-$5"

    );

}

/*==========================================================
CEP
==========================================================*/

function cep(valor){

    valor=(valor||"").replace(/\D/g,"");

    return valor.replace(

        /^(\d{5})(\d{3})$/,

        "$1-$2"

    );

}

/*==========================================================
TELEFONE
==========================================================*/

function telefone(valor){

    valor=(valor||"").replace(/\D/g,"");

    if(valor.length===11){

        return valor.replace(

            /^(\d{2})(\d{5})(\d{4})$/,

            "($1) $2-$3"

        );

    }

    return valor.replace(

        /^(\d{2})(\d{4})(\d{4})$/,

        "($1) $2-$3"

    );

}

/*==========================================================
COPIAR TEXTO
==========================================================*/

async function copiar(texto){

    await navigator.clipboard.writeText(texto);

    notify(

        "Copiado para a área de transferência.",

        "success"

    );

}

/*==========================================================
GERAR ID
==========================================================*/

function guid(){

    return crypto.randomUUID();

}

/*==========================================================
GERAR CÓDIGO
==========================================================*/

function codigo(

    prefixo,

    numero,

    tamanho=6

){

    return prefixo+

    String(numero).padStart(

        tamanho,

        "0"

    );

}

/*==========================================================
DOWNLOAD
==========================================================*/

function download(

    nome,

    conteudo,

    tipo="text/plain"

){

    const blob=new Blob(

        [

            conteudo

        ],

        {

            type:tipo

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download=nome;

    a.click();

    URL.revokeObjectURL(url);

}

/*==========================================================
EXPORTAÇÃO
==========================================================*/

export{

    data,

    dataHora,

    hora,

    moeda,

    numero,

    porcentagem,

    cpf,

    cnpj,

    cep,

    telefone,

    copiar,

    guid,

    codigo,

    download

};
/*==========================================================
TABLE MANAGER
==========================================================*/

const table={

    pesquisar(idTabela,idPesquisa){

        const tabela=document.getElementById(idTabela);

        if(!tabela){

            return;

        }

        const pesquisa=document

            .getElementById(idPesquisa)

            .value

            .toLowerCase();

        tabela

            .querySelectorAll("tbody tr")

            .forEach(linha=>{

                linha.style.display=

                    linha.innerText

                        .toLowerCase()

                        .includes(pesquisa)

                    ? ""

                    : "none";

            });

    },

/*==========================================================
ORDENAR
==========================================================*/

    ordenar(idTabela,coluna){

        const tabela=document.getElementById(idTabela);

        const corpo=tabela.tBodies[0];

        const linhas=[...corpo.rows];

        const crescente=

            tabela.dataset.ordem!=="asc";

        linhas.sort(

            (a,b)=>{

                const A=

                    a.cells[coluna]

                    .innerText

                    .trim()

                    .toLowerCase();

                const B=

                    b.cells[coluna]

                    .innerText

                    .trim()

                    .toLowerCase();

                return crescente

                    ?A.localeCompare(B)

                    :B.localeCompare(A);

            }

        );

        tabela.dataset.ordem=

            crescente

            ?"asc"

            :"desc";

        linhas.forEach(

            linha=>{

                corpo.appendChild(linha);

            }

        );

    },

/*==========================================================
SELECIONAR TODAS
==========================================================*/

    selecionarTodas(

        checkbox,

        classe

    ){

        document

            .querySelectorAll(

                "."+classe

            )

            .forEach(item=>{

                item.checked=

                    checkbox.checked;

            });

    },

/*==========================================================
TOTAL SELECIONADO
==========================================================*/

    totalSelecionado(classe){

        return document

            .querySelectorAll(

                "."+classe+":checked"

            )

            .length;

    },

/*==========================================================
EXPORTAR CSV
==========================================================*/

    exportarCSV(

        idTabela,

        nome

    ){

        const tabela=

            document.getElementById(idTabela);

        let csv="";

        tabela

            .querySelectorAll("tr")

            .forEach(linha=>{

                const dados=[

                    ...linha.children

                ].map(

                    coluna=>

                        '"'+

                        coluna.innerText+

                        '"'

                );

                csv+=

                    dados.join(";")+

                    "\n";

            });

        download(

            nome+".csv",

            csv,

            "text/csv"

        );

    },

/*==========================================================
IMPRIMIR
==========================================================*/

    imprimir(idTabela){

        const conteudo=

            document

            .getElementById(idTabela)

            .outerHTML;

        const janela=

            window.open(

                "",

                "_blank"

            );

        janela.document.write(`

<html>

<head>

<title>

Impressão

</title>

<style>

body{

font-family:Arial;

padding:20px;

}

table{

width:100%;

border-collapse:collapse;

}

td,th{

border:1px solid #CCC;

padding:8px;

}

th{

background:#EEE;

}

</style>

</head>

<body>

${conteudo}

</body>

</html>

        `);

        janela.print();

        janela.close();

    },

/*==========================================================
EXPORTAR JSON
==========================================================*/

    exportarJSON(

        dados,

        nome

    ){

        download(

            nome+".json",

            JSON.stringify(

                dados,

                null,

                4

            ),

            "application/json"

        );

    },

/*==========================================================
LIMPAR PESQUISA
==========================================================*/

    limparPesquisa(

        idPesquisa,

        idTabela

    ){

        document

            .getElementById(idPesquisa)

            .value="";

        this.pesquisar(

            idTabela,

            idPesquisa

        );

    }

};

/*==========================================================
SCROLL TOP
==========================================================*/

function topo(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/*==========================================================
FULLSCREEN
==========================================================*/

function fullscreen(){

    if(!document.fullscreenElement){

        document.documentElement

            .requestFullscreen();

    }

    else{

        document.exitFullscreen();

    }

}

/*==========================================================
EXPORTAÇÃO
==========================================================*/

export{

    table,

    topo,

    fullscreen

};
/*==========================================================
UI MANAGER
CRIAÇÃO AUTOMÁTICA DOS COMPONENTES
==========================================================*/

const UIManager={

/*==========================================================
INICIALIZAÇÃO
==========================================================*/

    iniciar(){

        this.criarToast();

        this.criarLoader();

        this.criarNotificationCenter();

        this.criarBackdrop();

        this.criarModalConfirmacao();

        this.criarModalAlerta();

        this.criarModalPrompt();

    },

/*==========================================================
VERIFICA EXISTÊNCIA
==========================================================*/

    existe(id){

        return document.getElementById(id)!==null;

    },

/*==========================================================
TOAST
==========================================================*/

    criarToast(){

        if(this.existe("toast")){

            return;

        }

        const toast=document.createElement("div");

        toast.id="toast";

        toast.className="toast";

        document.body.appendChild(toast);

    },

/*==========================================================
LOADER
==========================================================*/

    criarLoader(){

        if(this.existe("loading")){

            return;

        }

        const loader=document.createElement("div");

        loader.id="loading";

        loader.className="loading";

        loader.innerHTML=`

<div class="loading-box">

    <div class="spinner"></div>

    <p>Aguarde...</p>

</div>

`;

        document.body.appendChild(loader);

    },
/*==========================================================
BACKDROP
==========================================================*/

    criarBackdrop(){

        if(this.existe("uiBackdrop")){

            return;

        }

        const backdrop=document.createElement("div");

        backdrop.id="uiBackdrop";

        backdrop.className="ui-backdrop";

        document.body.appendChild(backdrop);

    },

/*==========================================================
NOTIFICATION CENTER
==========================================================*/

    criarNotificationCenter(){

        if(this.existe("notificationCenter")){

            return;

        }

        const centro=document.createElement("div");

        centro.id="notificationCenter";

        centro.className="notification-center";

        centro.innerHTML=`

<div class="notification-header">

    <h3>

        Notificações

    </h3>

    <button

        id="btnLimparNotificacoes"

        class="btn btn-light">

        Limpar

    </button>

</div>

<div

    id="notificationList"

    class="notification-list">

</div>

`;

        document.body.appendChild(centro);

        if(!this.existe("notificationBadge")){

            const badge=document.createElement("span");

            badge.id="notificationBadge";

            badge.className="notification-badge";

            badge.style.display="none";

            badge.innerHTML="0";

            document.body.appendChild(badge);

        }

    },
    /*==========================================================
MODAL CONFIRMAÇÃO
==========================================================*/

    criarModalConfirmacao(){

        if(this.existe("modalConfirmacao")){

            return;

        }

        const modal=document.createElement("div");

        modal.id="modalConfirmacao";

        modal.className="modal";

        modal.innerHTML=`

<div class="modal-content">

    <div class="modal-header">

        <h2 id="confirmTitulo">

            Confirmação

        </h2>

    </div>

    <div class="modal-body">

        <p id="confirmMensagem"></p>

    </div>

    <div class="modal-footer">

        <button

            id="confirmNao"

            class="btn btn-danger">

            Cancelar

        </button>

        <button

            id="confirmSim"

            class="btn btn-primary">

            Confirmar

        </button>

    </div>

</div>

`;

        document.body.appendChild(modal);

    },
    /*==========================================================
MODAL ALERTA
==========================================================*/

    criarModalAlerta(){

        if(this.existe("modalAlerta")){

            return;

        }

        const modal=document.createElement("div");

        modal.id="modalAlerta";

        modal.className="modal";

        modal.innerHTML=`

<div class="modal-content">

    <div class="modal-header">

        <h2 id="alertTitulo">

            Aviso

        </h2>

    </div>

    <div class="modal-body">

        <p id="alertMensagem"></p>

    </div>

    <div class="modal-footer">

        <button

            id="alertOk"

            class="btn btn-primary">

            OK

        </button>

    </div>

</div>

`;

        document.body.appendChild(modal);

    },
    /*==========================================================
MODAL PROMPT
==========================================================*/

    criarModalPrompt(){

        if(this.existe("modalPrompt")){

            return;

        }

        const modal=document.createElement("div");

        modal.id="modalPrompt";

        modal.className="modal";

        modal.innerHTML=`

<div class="modal-content">

    <div class="modal-header">

        <h2 id="promptTitulo">

            Informação

        </h2>

    </div>

    <div class="modal-body">

        <p id="promptMensagem"></p>

        <input

            id="promptValor"

            class="input"

            type="text">

    </div>

    <div class="modal-footer">

        <button

            id="promptCancelar"

            class="btn btn-danger">

            Cancelar

        </button>

        <button

            id="promptOk"

            class="btn btn-primary">

            Confirmar

        </button>

    </div>

</div>

`;

        document.body.appendChild(modal);

    },
    /*==========================================================
ABRIR / FECHAR NOTIFICAÇÕES
==========================================================*/

    toggleNotificacoes(){

        const centro=document.getElementById(

            "notificationCenter"

        );

        if(!centro){

            return;

        }

        centro.classList.toggle(

            "show"

        );

    },

/*==========================================================
CONFIGURAR NOTIFICAÇÕES
==========================================================*/

    configurarNotificacoes(){

        const limpar=document.getElementById(

            "btnLimparNotificacoes"

        );

        if(!limpar){

            return;

        }

        limpar.onclick=()=>{

            limparNotificacoes();

        };

    },
    /*==========================================================
SIDEBAR
==========================================================*/

    toggleSidebar(){

        const sidebar=document.querySelector(

            ".sidebar"

        );

        if(!sidebar){

            return;

        }

        sidebar.classList.toggle(

            "collapsed"

        );

    },

/*==========================================================
FULLSCREEN
==========================================================*/

    fullscreen(){

        if(!document.fullscreenElement){

            document.documentElement.requestFullscreen();

        }

        else{

            document.exitFullscreen();

        }

    },
    /*==========================================================
TEMA
==========================================================*/

    alternarTema(){

        document.body.classList.toggle(

            "dark"

        );

        localStorage.setItem(

            "romtechTema",

            document.body.classList.contains(

                "dark"

            )

            ? "dark"

            : "light"

        );

    },

/*==========================================================
CARREGAR TEMA
==========================================================*/

    carregarTema(){

        const tema=localStorage.getItem(

            "romtechTema"

        );

        if(tema==="dark"){

            document.body.classList.add(

                "dark"

            );

        }

    }

};

/*==========================================================
FIM DO UI MANAGER
==========================================================*/
/*==========================================================
ATALHOS
==========================================================*/

document.addEventListener(

    "keydown",

    e=>{

        if(

            e.key==="F11"

        ){

            e.preventDefault();

            UIManager.fullscreen();

        }

    }

);

/*==========================================================
INICIALIZAÇÃO
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        UIManager.iniciar();

        UIManager.configurarNotificacoes();

        UIManager.carregarTema();

        atualizarBadge();

        atualizarLista();

    }

);

/*==========================================================
OBJETO UI
==========================================================*/

const ui={

    loader,

    toast,

    notify,

    confirmar,

    alertar,

    perguntar,

    limparNotificacoes,

    NotificationCenter,

    modal,

    confirmarModal,

    alertaModal,

    promptModal,

    bloquearBotao,

    desbloquearBotao,

    table,

    topo,

    fullscreen:UIManager.fullscreen,

    copiar,

    moeda,

    numero,

    porcentagem,

    cpf,

    cnpj,

    cep,

    telefone,

    data,

    dataHora,

    hora,

    guid,

    codigo,

    download,

    UIManager

};

/*==========================================================
EXPORTAÇÃO PADRÃO
==========================================================*/

export default ui;