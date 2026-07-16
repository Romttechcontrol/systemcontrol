/*==========================================================
ROMTECH CONTROLE
MAIN.JS
==========================================================*/

/*==========================================================
IMPORTS
==========================================================*/

import auth from "./auth.js";

import ui from "./ui.js";

/*==========================================================
CONFIGURAÇÕES
==========================================================*/

const APP={

    nome:"RomTech Controle",

    versao:"2.0.0",

    empresa:"RomTech"

};

/*==========================================================
ESTADO
==========================================================*/

const Sistema={

    iniciado:false,

    usuario:null,

    perfil:null,

    permissoes:null

};

/*==========================================================
INICIAR SISTEMA
==========================================================*/

async function iniciarSistema(){

    try{

        ui.loader.show();

        await auth.iniciarSistema();

        Sistema.usuario=

            auth.getUsuarioSistema();

        Sistema.perfil=

            auth.getPerfil();

        Sistema.permissoes=

            auth.getPermissoes();

        carregarInformacoesUsuario();

        configurarEventos();

        Sistema.iniciado=true;

    }

    catch(erro){

        console.error(

            "Erro ao iniciar sistema",

            erro

        );

        ui.alerta(

            "Erro",

            "Falha ao iniciar o sistema."

        );

    }

    finally{

        ui.loader.hide();

    }

}

/*==========================================================
INFORMAÇÕES DO USUÁRIO
==========================================================*/

function carregarInformacoesUsuario(){

    if(!Sistema.usuario){

        return;

    }

    auth.preencherHeader();

}

/*==========================================================
EVENTOS GLOBAIS
==========================================================*/

function configurarEventos(){

    auth.configurarLogout();

}

/*==========================================================
GETTERS
==========================================================*/

export function getUsuario(){

    return Sistema.usuario;

}

export function getPerfil(){

    return Sistema.perfil;

}

export function getPermissoes(){

    return Sistema.permissoes;

}

export function sistemaIniciado(){

    return Sistema.iniciado;

}

/*==========================================================
INICIALIZAÇÃO
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    iniciarSistema

);

/*==========================================================
EXPORTAÇÃO
==========================================================*/

export default{

    iniciarSistema,

    getUsuario,

    getPerfil,

    getPermissoes,

    sistemaIniciado,

    APP

};

/*==========================================================
MONITOR DE CONEXÃO
==========================================================*/

function atualizarStatusConexao(){

    if(navigator.onLine){

        ui.notify(

            "Conexão restabelecida.",

            "success"

        );

    }

    else{

        ui.notify(

            "Sem conexão com a internet.",

            "warning"

        );

    }

}

window.addEventListener(

    "online",

    atualizarStatusConexao

);

window.addEventListener(

    "offline",

    atualizarStatusConexao

);

/*==========================================================
TÍTULO DA PÁGINA
==========================================================*/

function definirTitulo(){

    const titulo=document.title.trim();

    document.title=

        titulo+

        " | "+

        APP.nome+

        " v"+

        APP.versao;

}

/*==========================================================
VERSÃO DO SISTEMA
==========================================================*/

function preencherVersao(){

    const elemento=

    document.getElementById(

        "versaoSistema"

    );

    if(elemento){

        elemento.innerHTML=

        APP.versao;

    }

}

/*==========================================================
HEARTBEAT
==========================================================*/

let heartbeat;

function iniciarHeartbeat(){

    clearInterval(heartbeat);

    heartbeat=setInterval(()=>{

        // O Firebase já mantém a sessão automaticamente.
        // Não é mais necessário renovar manualmente.

    },60000);

}

/*==========================================================
ATALHOS
==========================================================*/

document.addEventListener(

    "keydown",

    e=>{

        if(

            e.ctrlKey &&

            e.key==="k"

        ){

            e.preventDefault();

            const campo=

            document.getElementById(

                "txtPesquisar"

            );

            if(campo){

                campo.focus();

            }

        }

        if(

            e.ctrlKey &&

            e.key==="l"

        ){

            e.preventDefault();

            auth.logout();

        }

        if(

            e.key==="F2"

        ){

            e.preventDefault();

            UIManager.toggleNotificacoes()

        }

    }

);

/*==========================================================
ERROS GLOBAIS
==========================================================*/

window.addEventListener(

    "error",

    async evento=>{

        console.error(

            evento.error

        );

        try{

            await auth.registrarLog(

                "Sistema",

                "Erro JavaScript",

                "",

                "",

                evento.message,

                false

            );

        }

        catch{}

    }

);

/*==========================================================
PROMISE REJECTION
==========================================================*/

window.addEventListener(

    "unhandledrejection",

    async evento=>{

        console.error(

            evento.reason

        );

        try{

            await auth.registrarLog(

                "Sistema",

                "Promise Rejection",

                "",

                "",

                String(

                    evento.reason

                ),

                false

            );

        }

        catch{}

    }

);

/*==========================================================
RECARREGAR PERMISSÕES
==========================================================*/

async function atualizarPermissoes(){

    await auth.iniciarSistema();

    Sistema.usuario=

        auth.getUsuarioSistema();

    Sistema.perfil=

        auth.getPerfil();

    Sistema.permissoes=

        auth.getPermissoes();

}

/*==========================================================
AUTO REFRESH
==========================================================*/

setInterval(

    atualizarPermissoes,

    300000

);

/*==========================================================
FINALIZAÇÃO
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        definirTitulo();

        preencherVersao();

        iniciarHeartbeat();

    }

);

