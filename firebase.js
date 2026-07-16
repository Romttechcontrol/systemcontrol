/*==========================================================
ROMTECH CONTROLE
FIREBASE.JS
VERSÃO 4.0
==========================================================*/

/*==========================================================
IMPORTS
==========================================================*/

import {

    initializeApp

}

from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {

    getAuth

}

from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {

    getFirestore

}

from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import {

    getStorage

}

from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

/*==========================================================
PROJETO PRINCIPAL
ROMTECHSYS
Authentication
Usuários
Lojas
Fornecedores
Computadores
==========================================================*/

const firebasePrincipal={

    apiKey:"AIzaSyCeWg7BO2qAqjoM7V5o_x-AO72-gNjudlc",

    authDomain:"romtechsys.firebaseapp.com",

    projectId:"romtechsys",

    storageBucket:"romtechsys.firebasestorage.app",

    messagingSenderId:"753481277881",

    appId:"1:753481277881:web:511f9461abda15656fd668",

    measurementId:"G-XNS6PZPMMX"

};

/*==========================================================
PROJETO MANUTENÇÃO
CONTROLEGERAL
Manutenção
Transferências
Histórico
==========================================================*/

const firebaseManutencao={

    apiKey:"AIzaSyCOjMwl8DVQ73AVUa0H4eFBwQuAmLM_aKs",

    authDomain:"controlegeral-c90c1.firebaseapp.com",

    projectId:"controlegeral-c90c1",

    storageBucket:"controlegeral-c90c1.firebasestorage.app",

    messagingSenderId:"530410393715",

    appId:"1:530410393715:web:c0c53cb80dc6d20fdeda06",

    measurementId:"G-BWKN2VDPHT"

};
/*==========================================================
INICIALIZAÇÃO DOS PROJETOS
==========================================================*/

const appPrincipal=initializeApp(

    firebasePrincipal

);

const appManutencao=initializeApp(

    firebaseManutencao,

    "manutencao"

);

/*==========================================================
AUTHENTICATION
==========================================================*/

const authPrincipal=getAuth(

    appPrincipal

);

const authManutencao=getAuth(

    appManutencao

);

/*==========================================================
FIRESTORE
==========================================================*/

const dbPrincipal=getFirestore(

    appPrincipal

);

const dbManutencao=getFirestore(

    appManutencao

);

/*==========================================================
STORAGE
==========================================================*/

const storagePrincipal=getStorage(

    appPrincipal

);

const storageManutencao=getStorage(

    appManutencao

);
/*==========================================================
OBJETO FIREBASE
==========================================================*/

const firebase={

    /*----------------------------------
    APLICAÇÕES
    ----------------------------------*/

    appPrincipal,

    appManutencao,

    /*----------------------------------
    AUTHENTICATION
    ----------------------------------*/

    authPrincipal,

    authManutencao,

    /*----------------------------------
    FIRESTORE
    ----------------------------------*/

    dbPrincipal,

    dbManutencao,

    /*----------------------------------
    STORAGE
    ----------------------------------*/

    storagePrincipal,

    storageManutencao,

    /*----------------------------------
    CONFIGURAÇÕES
    ----------------------------------*/

    firebasePrincipal,

    firebaseManutencao

};
/*==========================================================
EXPORTAÇÕES INDIVIDUAIS
==========================================================*/

export{

    /*----------------------------------
    APPS
    ----------------------------------*/

    appPrincipal,

    appManutencao,

    /*----------------------------------
    AUTH
    ----------------------------------*/

    authPrincipal,

    authManutencao,

    /*----------------------------------
    FIRESTORE
    ----------------------------------*/

    dbPrincipal,

    dbManutencao,

    /*----------------------------------
    STORAGE
    ----------------------------------*/

    storagePrincipal,

    storageManutencao,

    /*----------------------------------
    CONFIGURAÇÕES
    ----------------------------------*/

    firebasePrincipal,

    firebaseManutencao

};

/*==========================================================
EXPORTAÇÃO PADRÃO
==========================================================*/

export default firebase;