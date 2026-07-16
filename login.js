/*==========================================================
ROMTECH CONTROLE
LOGIN.JS
VERSÃO 3.0
==========================================================*/

/*==========================================================
IMPORTS
==========================================================*/

import {

    authPrincipal

}

from "./firebase.js";

import {

    signInWithEmailAndPassword,

    setPersistence,

    browserLocalPersistence,

    browserSessionPersistence,

    sendPasswordResetEmail,

    onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

/*==========================================================
ELEMENTOS
==========================================================*/

const formLogin=

document.getElementById(

    "formLogin"

);

const txtEmail=

document.getElementById(

    "email"

);

const txtSenha=

document.getElementById(

    "senha"

);

const chkLembrar=

document.getElementById(

    "lembrar"

);

const btnMostrarSenha=

document.getElementById(

    "mostrarSenha"

);

const btnRecuperarSenha=

document.getElementById(

    "recuperarSenha"

);

const loading=

document.getElementById(

    "loading"

);

const toast=

document.getElementById(

    "toast"

);

/*==========================================================
CONFIGURAÇÕES
==========================================================*/

const URL_DASHBOARD=

"index.html";

const TEMPO_REDIRECIONAMENTO=

1000;
/*==========================================================
LOGIN
==========================================================*/

formLogin.addEventListener(

    "submit",

    async(e)=>{

        e.preventDefault();

        abrirLoading();

        try{

            if(

                chkLembrar.checked

            ){

                await setPersistence(

                    authPrincipal,

                    browserLocalPersistence

                );

            }

            else{

                await setPersistence(

                    authPrincipal,

                    browserSessionPersistence

                );

            }

            await signInWithEmailAndPassword(

                authPrincipal,

                txtEmail.value.trim(),

                txtSenha.value

            );

            fecharLoading();

            mostrarToast(

                "Login realizado com sucesso."

            );

            setTimeout(

                ()=>{

                    window.location=

                    URL_DASHBOARD;

                },

                TEMPO_REDIRECIONAMENTO

            );

        }

        catch(erro){

            fecharLoading();

            tratarErro(

                erro

            );

        }

    }

);

/*==========================================================
USUÁRIO JÁ AUTENTICADO
==========================================================*/

onAuthStateChanged(

    authPrincipal,

    (usuario)=>{

        if(

            usuario

        ){

            window.location=

            URL_DASHBOARD;

        }

    }

);
/*==========================================================
MOSTRAR / OCULTAR SENHA
==========================================================*/

btnMostrarSenha.addEventListener(

    "click",

    ()=>{

        if(

            txtSenha.type==="password"

        ){

            txtSenha.type="text";

            btnMostrarSenha.innerHTML=

            '<i class="fa-solid fa-eye-slash"></i>';

        }

        else{

            txtSenha.type="password";

            btnMostrarSenha.innerHTML=

            '<i class="fa-solid fa-eye"></i>';

        }

    }

);

/*==========================================================
RECUPERAR SENHA
==========================================================*/

btnRecuperarSenha.addEventListener(

    "click",

    async(e)=>{

        e.preventDefault();

        const email=

        txtEmail.value.trim();

        if(

            email===""

        ){

            mostrarToast(

                "Informe seu e-mail para recuperar a senha.",

                "aviso"

            );

            txtEmail.focus();

            return;

        }

        abrirLoading();

        try{

            await sendPasswordResetEmail(

                authPrincipal,

                email

            );

            fecharLoading();

            mostrarToast(

                "E-mail de recuperação enviado."

            );

        }

        catch(erro){

            fecharLoading();

            tratarErro(

                erro

            );

        }

    }

);

/*==========================================================
ENTER NOS CAMPOS
==========================================================*/

txtEmail.addEventListener(

    "keypress",

    (e)=>{

        if(

            e.key==="Enter"

        ){

            txtSenha.focus();

        }

    }

);

txtSenha.addEventListener(

    "keypress",

    (e)=>{

        if(

            e.key==="Enter"

        ){

            formLogin.requestSubmit();

        }

    }

);

/*==========================================================
LIMPAR TOAST AO DIGITAR
==========================================================*/

txtEmail.addEventListener(

    "input",

    ()=>{

        toast.className="toast";

    }

);

txtSenha.addEventListener(

    "input",

    ()=>{

        toast.className="toast";

    }

);

/*==========================================================
FOCO AUTOMÁTICO
==========================================================*/

window.addEventListener(

    "load",

    ()=>{

        txtEmail.focus();

    }

);
/*==========================================================
LOADING
==========================================================*/

function abrirLoading(){

    loading.style.display="flex";

}

function fecharLoading(){

    loading.style.display="none";

}

/*==========================================================
TOAST
==========================================================*/

function mostrarToast(

    mensagem,

    tipo="sucesso"

){

    toast.innerHTML=

    mensagem;

    toast.className=

    "toast show";

    if(

        tipo==="erro"

    ){

        toast.classList.add(

            "erro"

        );

    }

    if(

        tipo==="aviso"

    ){

        toast.classList.add(

            "aviso"

        );

    }

    setTimeout(

        ()=>{

            toast.className=

            "toast";

        },

        3500

    );

}

/*==========================================================
TRATAMENTO DOS ERROS FIREBASE
==========================================================*/

function tratarErro(

    erro

){

    console.error(

        erro

    );

    switch(

        erro.code

    ){

        case "auth/invalid-email":

            mostrarToast(

                "E-mail inválido.",

                "erro"

            );

            break;

        case "auth/user-not-found":

            mostrarToast(

                "Usuário não encontrado.",

                "erro"

            );

            break;

        case "auth/wrong-password":

            mostrarToast(

                "Senha incorreta.",

                "erro"

            );

            break;

        case "auth/invalid-credential":

            mostrarToast(

                "Usuário ou senha inválidos.",

                "erro"

            );

            break;

        case "auth/too-many-requests":

            mostrarToast(

                "Muitas tentativas. Aguarde alguns minutos.",

                "erro"

            );

            break;

        case "auth/network-request-failed":

            mostrarToast(

                "Sem conexão com a internet.",

                "erro"

            );

            break;

        default:

            mostrarToast(

                erro.message,

                "erro"

            );

    }

}

/*==========================================================
FINALIZAÇÃO
==========================================================*/

window.addEventListener(

    "load",

    ()=>{

        fecharLoading();

    }

);
