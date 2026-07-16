/*==========================================================
ROMTECH CONTROLE
AUTH.JS
VERSÃO 3.0
==========================================================*/

/*==========================================================
IMPORTS
==========================================================*/

import {

    authPrincipal,

    dbPrincipal

}

from "./firebase.js";

import {

    onAuthStateChanged,

    signOut

}

from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {

    collection,

    query,

    where,

    getDocs,

    doc,

    getDoc,

    updateDoc,

    addDoc,

    serverTimestamp

}

from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/*==========================================================
VARIÁVEIS GLOBAIS
==========================================================*/

let usuarioFirebase = null;

let usuarioSistema = null;

let permissoesUsuario = null;

let documentoUsuario = null;

let perfilUsuario = null;

/*==========================================================
GETTERS
==========================================================*/

export function getUsuarioFirebase(){

    return usuarioFirebase;

}

export function getUsuarioSistema(){

    return usuarioSistema;

}

export function getPermissoes(){

    return permissoesUsuario;

}

export function getPerfil(){

    return perfilUsuario;

}
/*==========================================================
BUSCAR USUÁRIO NO FIRESTORE
==========================================================*/

async function buscarUsuario(uid){

    try{

        const consulta = query(

            collection(

                dbPrincipal,

                "usuarios"

            ),

            where(

                "uid",

                "==",

                uid

            )

        );

        const resultado = await getDocs(

            consulta

        );

        if(resultado.empty){

            return false;

        }

        documentoUsuario = resultado.docs[0];

        usuarioSistema = documentoUsuario.data();

        return true;

    }

    catch(erro){

        console.error(

            "Erro ao localizar usuário:",

            erro

        );

        return false;

    }

}

/*==========================================================
BUSCAR PERFIL
==========================================================*/

async function carregarPerfil(){

    try{

        perfilUsuario = usuarioSistema.perfil;

        const documento = await getDoc(

            doc(

                dbPrincipal,

                "permissoes",

                perfilUsuario

            )

        );

        if(!documento.exists()){

            return false;

        }

        permissoesUsuario = documento.data();

        return true;

    }

    catch(erro){

        console.error(

            erro

        );

        return false;

    }

}

/*==========================================================
ATUALIZAR ÚLTIMO ACESSO
==========================================================*/

async function atualizarUltimoAcesso(){

    try{

        if(!documentoUsuario){

            return;

        }

        await updateDoc(

            documentoUsuario.ref,

            {

                ultimoAcesso:

                serverTimestamp()

            }

        );

    }

    catch(erro){

        console.error(

            erro

        );

    }

}

/*==========================================================
MONITORAR LOGIN
==========================================================*/

export async function iniciarAutenticacao(){

    console.log("1 - iniciarAutenticacao()");

    return new Promise(resolve=>{

        console.log("2 - aguardando onAuthStateChanged");

        onAuthStateChanged(

            authPrincipal,

            async(usuario)=>{

                console.log("3 - callback executado");

                console.log("Usuário Firebase:", usuario);

                if(!usuario){

                    console.log("4 - usuário NÃO autenticado");

                    usuarioFirebase = null;

                    usuarioSistema = null;

                    permissoesUsuario = null;

                    documentoUsuario = null;

                    perfilUsuario = null;

                    resolve(false);

                    return;

                }

                console.log("5 - usuário autenticado");

                usuarioFirebase = usuario;

                console.log("UID:", usuario.uid);

                const ok = await buscarUsuario(

                    usuario.uid

                );

                console.log("6 - buscarUsuario:", ok);

                if(!ok){

                    console.log("7 - usuário não encontrado no Firestore");

                    resolve(false);

                    return;

                }

                console.log("8 - carregarPerfil");

                const perfilOk = await carregarPerfil();

                if(!perfilOk){

                    console.log("Perfil não encontrado.");

                    resolve(false);

                    return;

                }

                console.log("9 - atualizarUltimoAcesso");

                await atualizarUltimoAcesso();

                console.log("10 - autenticação concluída");

                resolve(true);

            }

        );

    });

}
/*==========================================================
LOGOUT
==========================================================*/

export async function logout(){

    try{

        await registrarLog(

            "Sistema",

            "Logout",

            "",

            "",

            "Usuário encerrou a sessão.",

            true

        );

        await signOut(

            authPrincipal

        );

        window.location.href="login.html";

    }

    catch(erro){

        console.error(

            erro

        );

    }

}

/*==========================================================
VERIFICAR LOGIN
==========================================================*/

export function usuarioLogado(){

    return usuarioFirebase!==null;

}

/*==========================================================
PROTEGER PÁGINA
==========================================================*/

export async function protegerPagina(){

    if(!usuarioFirebase){

        window.location.replace(

            "login.html"

        );

        return false;

    }

    if(

        usuarioSistema?.status &&

        usuarioSistema.status.toLowerCase()!=="ativo"

    ){

        alert(

            "Usuário desativado."

        );

        await logout();

        return false;

    }

    return true;

}

/*==========================================================
VERIFICAR PERMISSÃO
==========================================================*/

export function temPermissao(permissao){

    if(!permissoesUsuario){

        return false;

    }

    return (

        permissoesUsuario[permissao]===true

    );

}

/*==========================================================
EXIBIR / OCULTAR MENU
==========================================================*/

export function aplicarPermissoesMenu(){

    document

    .querySelectorAll(

        "[data-permissao]"

    )

    .forEach(item=>{

        const permissao=

        item.dataset.permissao;

        if(

            !temPermissao(

                permissao

            )

        ){

            item.remove();

        }

    });

}

/*==========================================================
EXIBIR / OCULTAR BOTÕES
==========================================================*/

export function aplicarPermissoesBotoes(){

    document

    .querySelectorAll(

        "[data-acao]"

    )

    .forEach(botao=>{

        const permissao=

        botao.dataset.acao;

        if(

            !temPermissao(

                permissao

            )

        ){

            botao.disabled=true;

            botao.style.opacity=".45";

            botao.style.cursor="not-allowed";

        }

    });

}

/*==========================================================
PREENCHER DADOS DO USUÁRIO
==========================================================*/

export function preencherUsuario(){

    if(!usuarioSistema){

        return;

    }

    const mapa={

        usuarioNome:usuarioSistema.nome,

        usuarioCargo:usuarioSistema.cargo,

        usuarioLoja:usuarioSistema.loja,

        usuarioPerfil:usuarioSistema.perfil

    };

    Object.keys(

        mapa

    ).forEach(id=>{

        const elemento=

        document.getElementById(

            id

        );

        if(elemento){

            elemento.textContent=

            mapa[id];

        }

    });

}
/*==========================================================
VERIFICAR PERFIL
==========================================================*/

export function perfilEh(perfil){

    return perfilUsuario===perfil;

}

export function perfilAdmin(){

    return perfilEh("admin");

}

export function perfilGerencia(){

    return perfilEh("gerencia");

}

export function perfilSuprimentos(){

    return perfilEh("suprimentos");

}

export function perfilFinanceiro(){

    return perfilEh("financeiro");

}

/*==========================================================
INFORMAÇÕES DO DISPOSITIVO
==========================================================*/

function obterNavegador(){

    const ua=navigator.userAgent;

    if(ua.includes("Firefox")) return "Firefox";

    if(ua.includes("Edg")) return "Edge";

    if(ua.includes("Chrome")) return "Chrome";

    if(ua.includes("Safari")) return "Safari";

    return "Desconhecido";

}

function obterSistemaOperacional(){

    const ua=navigator.userAgent;

    if(ua.includes("Windows")) return "Windows";

    if(ua.includes("Android")) return "Android";

    if(ua.includes("Linux")) return "Linux";

    if(ua.includes("Mac")) return "MacOS";

    if(ua.includes("iPhone")) return "iOS";

    return "Desconhecido";

}

/*==========================================================
OBTER IP
==========================================================*/

async function obterIP(){

    try{

        const resposta=await fetch(

            "https://api.ipify.org?format=json"

        );

        const dados=await resposta.json();

        return dados.ip;

    }

    catch{

        return "";

    }

}

/*==========================================================
REGISTRAR LOG
==========================================================*/

export async function registrarLog(

    modulo,

    acao,

    documento="",

    documentoId="",

    descricao="",

    sucesso=true

){

    try{

        if(!usuarioSistema || !usuarioFirebase){

            return;

        }

        const ip=await obterIP();

        await addDoc(

            collection(

                dbPrincipal,

                "logs"

            ),

            {

                uid:usuarioFirebase.uid,

                usuario:usuarioSistema.nome,

                perfil:usuarioSistema.perfil,

                cargo:usuarioSistema.cargo,

                loja:usuarioSistema.loja,

                modulo:modulo,

                acao:acao,

                documento:documento,

                documentoId:documentoId,

                descricao:descricao,

                ip:ip,

                navegador:obterNavegador(),

                sistemaOperacional:obterSistemaOperacional(),

                origem:"Web",

                versaoSistema:"3.0.0",

                sucesso:sucesso,

                dataHora:serverTimestamp()

            }

        );

    }

    catch(erro){

        console.error(

            "Erro ao registrar log:",

            erro

        );

    }

}

/*==========================================================
VERIFICAR ACESSO À PÁGINA
==========================================================*/

export async function protegerPermissao(permissao){

    const ok=await protegerPagina();

    if(!ok){

        return false;

    }

    if(!temPermissao(permissao)){

        window.location.replace("403.html");

        return false;

    }

    return true;

}
/*==========================================================
RENOVAR SESSÃO
==========================================================*/

let timerSessao;

export function renovarSessao(){

    clearTimeout(

        timerSessao

    );

    timerSessao = setTimeout(

        ()=>{

            logout();

        },

        1000 * 60 * 60 * 8

    );

}

/*==========================================================
EVENTOS DO USUÁRIO
==========================================================*/

document.addEventListener(

    "click",

    renovarSessao

);

document.addEventListener(

    "keydown",

    renovarSessao

);

document.addEventListener(

    "mousemove",

    renovarSessao

);

document.addEventListener(

    "scroll",

    renovarSessao

);

renovarSessao();

/*==========================================================
HELPERS
==========================================================*/

export function getNome(){

    return usuarioSistema?.nome || "";

}

export function getEmail(){

    return usuarioSistema?.email || "";

}

export function getCargo(){

    return usuarioSistema?.cargo || "";

}

export function getLoja(){

    return usuarioSistema?.loja || "";

}

export function getUID(){

    return usuarioFirebase?.uid || "";

}

export function getStatus(){

    return usuarioSistema?.status || "";

}

/*==========================================================
PERFIS
==========================================================*/

export function isAdmin(){

    return perfilUsuario==="admin";

}

export function isGerencia(){

    return perfilUsuario==="gerencia";

}

export function isSuprimentos(){

    return perfilUsuario==="suprimentos";

}

export function isFinanceiro(){

    return perfilUsuario==="financeiro";

}

/*==========================================================
PREENCHER HEADER
==========================================================*/

export function preencherHeader(){

    if(!usuarioSistema){

        return;

    }

    const elementos={

        usuarioNome:getNome(),

        usuarioCargo:getCargo(),

        usuarioLoja:getLoja(),

        usuarioEmail:getEmail(),

        usuarioPerfil:getPerfil()

    };

    Object.entries(

        elementos

    ).forEach(

        ([id,valor])=>{

            const elemento=

            document.getElementById(

                id

            );

            if(elemento){

                elemento.textContent=

                valor;

            }

        }

    );

}

/*==========================================================
OCULTAR MENUS SEM PERMISSÃO
==========================================================*/

export function aplicarPermissoes(){

    document

    .querySelectorAll(

        "[data-permissao]"

    )

    .forEach(item=>{

        const permissao=

        item.dataset.permissao;

        if(

            !temPermissao(

                permissao

            )

        ){

            item.style.display="none";

        }

    });

}

/*==========================================================
INICIALIZAÇÃO
==========================================================*/

export async function iniciarSistema(){

    console.log(

        "iniciarSistema()"

    );

    const autenticado=

    await iniciarAutenticacao();

    if(!autenticado){

        return;

    }

    const ok=

    await protegerPagina();

    if(!ok){

        return;

    }

    preencherHeader();

    aplicarPermissoes();

    renovarSessao();

}

/*==========================================================
BOTÃO LOGOUT
==========================================================*/

export function configurarLogout(){

    const botao=

    document.getElementById(

        "btnLogout"

    );

    if(!botao){

        return;

    }

    botao.onclick=

    ()=>{

        logout();

    };

}

/*==========================================================
VERSÃO DO SISTEMA
==========================================================*/

export const SISTEMA={

    nome:"RomTech Controle",

    versao:"3.0.0"

};

/*==========================================================
EXPORTAÇÃO PADRÃO
==========================================================*/

export default{

    iniciarSistema,

    protegerPagina,

    logout,

    registrarLog,

    getUsuarioFirebase,

    getUsuarioSistema,

    getPermissoes,

    getPerfil,

    getNome,

    getEmail,

    getCargo,

    getLoja,

    getUID,

    getStatus,

    isAdmin,

    isGerencia,

    isSuprimentos,

    isFinanceiro,

    temPermissao,

    preencherHeader,

    aplicarPermissoes,

    configurarLogout,

    SISTEMA

};