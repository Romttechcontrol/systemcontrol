/*==========================================================
ROMTECH CONTROLE
USUARIOS.JS
VERSÃO 2.0
==========================================================*/

/*==========================================================
IMPORTS DO SISTEMA
==========================================================*/

import main from "./main.js";
import auth from "./auth.js";
import ui from "./ui.js";

/*==========================================================
IMPORTS FIREBASE LOCAL
==========================================================*/

import {

    dbPrincipal,
    firebasePrincipal,
    authPrincipal

} from "./firebase.js";

/*==========================================================
IMPORTS FIRESTORE
==========================================================*/

import {

    collection,
    getDocs,
    query,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/*==========================================================
IMPORTS AUTH
==========================================================*/

import {

    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail

} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

/*==========================================================
IMPORTS FIREBASE APP
==========================================================*/

import {

    initializeApp,
    deleteApp

} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
/*==========================================================
ESTADO DO MÓDULO
==========================================================*/

let usuarios = [];

let usuariosFiltrados = [];

let perfis = [];

let lojas = [];

/*==========================================================
CONFIGURAÇÕES
==========================================================*/

const CONFIG = {

    intervaloAtualizacao: 120000,

    quantidadeLogs: 20

};

/*==========================================================
ELEMENTOS DA INTERFACE
==========================================================*/

const tbody =

document.getElementById(

    "tbodyUsuarios"

);

const cmbPerfil =

document.getElementById(

    "cmbPerfil"

);

const cmbLoja =

document.getElementById(

    "cmbLoja"

);

const txtPesquisar =

document.getElementById(

    "txtPesquisar"

);

const cmbFiltroPerfil =

document.getElementById(

    "cmbFiltroPerfil"

);

const cmbFiltroStatus =

document.getElementById(

    "cmbFiltroStatus"

);

const cmbFiltroLoja =

document.getElementById(

    "cmbFiltroLoja"

);

const btnSalvarUsuario =

document.getElementById(

    "btnSalvarUsuario"

);

const btnNovoUsuario =

document.getElementById(

    "btnNovoUsuario"

);

const btnAtualizar =

document.getElementById(

    "btnAtualizar"

);

const btnExcluirSelecionados =

document.getElementById(

    "btnExcluirSelecionados"

);

const btnAtivarSelecionados =

document.getElementById(

    "btnAtivarSelecionados"

);

const btnInativarSelecionados =

document.getElementById(

    "btnInativarSelecionados"

);

const btnResetSenha =

document.getElementById(

    "btnResetSenha"

);

const checkTodos =

document.getElementById(

    "checkTodos"

);

/*==========================================================
REFERÊNCIAS DOS CARDS
==========================================================*/

const cardTotalUsuarios =

document.getElementById(

    "cardTotalUsuarios"

);

const cardUsuariosAtivos =

document.getElementById(

    "cardUsuariosAtivos"

);

const cardUsuariosInativos =

document.getElementById(

    "cardUsuariosInativos"

);

const cardAdministradores =

document.getElementById(

    "cardAdministradores"

);

const contadorUsuarios =

document.getElementById(

    "contadorUsuarios"

);
/*==========================================================
CARREGAR USUÁRIOS
==========================================================*/

async function carregarUsuarios(){

    try{

        ui.loader.show();

        usuarios=[];

        const consulta=query(

            collection(

                dbPrincipal,

                "usuarios"

            ),

            orderBy(

                "nome"

            )

        );

        const snapshot=

        await getDocs(

            consulta

        );

        snapshot.forEach(documento=>{

            usuarios.push({

                id:documento.id,

                ...documento.data()

            });

        });

        usuariosFiltrados=[

            ...usuarios

        ];

        preencherTabela();

        atualizarCards();

        atualizarDashboard();

        if(contadorUsuarios){

            contadorUsuarios.innerHTML=

            `${usuariosFiltrados.length} registro(s)`;

        }

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            "Erro ao carregar usuários.",

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}
/*==========================================================
CARREGAR PERFIS
==========================================================*/

async function carregarPerfis(){

    try{

        perfis=[];

        const consulta=

        collection(

            dbPrincipal,

            "permissoes"

        );

        const snapshot=

        await getDocs(

            consulta

        );

        if(cmbPerfil){

            cmbPerfil.innerHTML=

            "<option value=''>Selecione</option>";

        }

        if(cmbFiltroPerfil){

            cmbFiltroPerfil.innerHTML=

            "<option value=''>Todos</option>";

        }

        snapshot.forEach(documento=>{

            const perfil={

                id:documento.id,

                ...documento.data()

            };

            perfis.push(

                perfil

            );

            if(cmbPerfil){

                cmbPerfil.innerHTML+=`

                    <option value="${perfil.id}">

                        ${perfil.nome}

                    </option>

                `;

            }

            if(cmbFiltroPerfil){

                cmbFiltroPerfil.innerHTML+=`

                    <option value="${perfil.id}">

                        ${perfil.nome}

                    </option>

                `;

            }

        });

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            "Erro ao carregar perfis.",

            "error"

        );

    }

}
/*==========================================================
CARREGAR LOJAS
==========================================================*/

async function carregarLojas(){

    try{

        lojas=[];

        const consulta=

        query(

            collection(

                dbPrincipal,

                "lojas"

            ),

            orderBy(

                "nomeLoja"

            )

        );

        const snapshot=

        await getDocs(

            consulta

        );

        if(cmbLoja){

            cmbLoja.innerHTML=

            "<option value=''>Selecione</option>";

        }

        const cmbFiltroLoja=

        document.getElementById(

            "cmbFiltroLoja"

        );

        if(cmbFiltroLoja){

            cmbFiltroLoja.innerHTML=

            "<option value=''>Todas</option>";

        }

        snapshot.forEach(documento=>{

            const loja={

                id:documento.id,

                ...documento.data()

            };

            lojas.push(

                loja

            );

            if(cmbLoja){

                cmbLoja.innerHTML+=`

                    <option value="${loja.nomeLoja}">

                        ${loja.nomeLoja}

                    </option>

                `;

            }

            if(cmbFiltroLoja){

                cmbFiltroLoja.innerHTML+=`

                    <option value="${loja.nomeLoja}">

                        ${loja.nomeLoja}

                    </option>

                `;

            }

        });

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            "Erro ao carregar lojas.",

            "error"

        );

    }

}
/*==========================================================
ATUALIZAR CARDS
==========================================================*/

function atualizarCards(){

    const total=

    usuarios.length;

    const ativos=

    usuarios.filter(

        usuario=>usuario.status==="ativo"

    ).length;

    const inativos=

    usuarios.filter(

        usuario=>usuario.status==="inativo"

    ).length;

    const administradores=

    usuarios.filter(

        usuario=>usuario.perfil==="admin"

    ).length;

    if(cardTotalUsuarios){

        cardTotalUsuarios.innerHTML=

        total;

    }

    if(cardUsuariosAtivos){

        cardUsuariosAtivos.innerHTML=

        ativos;

    }

    if(cardUsuariosInativos){

        cardUsuariosInativos.innerHTML=

        inativos;

    }

    if(cardAdministradores){

        cardAdministradores.innerHTML=

        administradores;

    }

    if(contadorUsuarios){

        contadorUsuarios.innerHTML=

        `${usuariosFiltrados.length} registro(s)`;

    }

}
/*==========================================================
INICIALIZAÇÃO DO MÓDULO
==========================================================*/

async function iniciar(){

    try{

        await main.iniciarSistema();

        if(

            !auth.temPermissao(

                "usuarios_visualizar"

            )

        ){

            ui.alerta(

                "Acesso Negado",

                "Você não possui permissão para acessar este módulo."

            );

            window.location.href="index.html";

            return;

        }

        await carregarPerfis();

        await carregarLojas();

        await carregarUsuarios();

        atualizarCards();

        if(

            typeof atualizarDashboard==="function"

        ){

            atualizarDashboard();

        }

        console.log(

            "Módulo Usuários inicializado."

        );

    }

    catch(erro){

        console.error(

            "Erro ao iniciar módulo:",

            erro

        );

        ui.notify(

            "Erro ao iniciar módulo de usuários.",

            "error"

        );

    }

}
/*==========================================================
PREENCHER TABELA
==========================================================*/

function preencherTabela(){

    if(!tbody){

        return;

    }

    tbody.innerHTML="";

    if(usuariosFiltrados.length===0){

        tbody.innerHTML=`

            <tr>

                <td colspan="9" class="text-center">

                    Nenhum usuário encontrado.

                </td>

            </tr>

        `;

        return;

    }

    usuariosFiltrados.forEach(usuario=>{

        const statusClasse=

        usuario.status==="ativo"

        ?"concluido"

        :"cancelado";

        const ultimoAcesso=

        usuario.ultimoAcesso

        ?ui.dataHora(

            usuario.ultimoAcesso

        )

        :"Nunca";

        tbody.innerHTML+=`

            <tr>

                <td>

                    <input

                        type="checkbox"

                        class="checkUsuario"

                        value="${usuario.id}">

                </td>

                <td>${usuario.nome}</td>

                <td>${usuario.email}</td>

                <td>${usuario.cargo}</td>

                <td>${usuario.perfil}</td>

                <td>${usuario.loja}</td>

                <td>

                    <span class="status ${statusClasse}">

                        ${usuario.status}

                    </span>

                </td>

                <td>

                    ${ultimoAcesso}

                </td>

                <td>

                    <button

                        class="btn btn-info btn-sm"

                        title="Editar"

                        onclick="editarUsuario('${usuario.id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button

                        class="btn btn-secondary btn-sm"

                        title="Resetar Senha"

                        onclick="resetarSenha('${usuario.id}')">

                        <i class="fa-solid fa-key"></i>

                    </button>

                    <button

                        class="btn btn-warning btn-sm"

                        title="Ativar/Inativar"

                        onclick="alterarStatus('${usuario.id}')">

                        <i class="fa-solid fa-user-lock"></i>

                    </button>

                    <button

                        class="btn btn-danger btn-sm"

                        title="Excluir"

                        onclick="excluirUsuario('${usuario.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });

}
/*==========================================================
NOVO USUÁRIO
==========================================================*/

function novoUsuario(){

    limparFormulario();

    const tituloModal=

    document.getElementById(

        "tituloModal"

    );

    if(tituloModal){

        tituloModal.innerHTML=

        "Novo Usuário";

    }

    ui.modal.abrir(

        "modalUsuario"

    );

}

/*==========================================================
LIMPAR FORMULÁRIO
==========================================================*/

function limparFormulario(){

    document.getElementById(

        "txtId"

    ).value="";

    document.getElementById(

        "txtNome"

    ).value="";

    document.getElementById(

        "txtEmail"

    ).value="";

    document.getElementById(

        "txtSenha"

    ).value="";

    document.getElementById(

        "txtCargo"

    ).value="";

    document.getElementById(

        "txtTelefone"

    ).value="";

    cmbPerfil.value="";

    cmbLoja.value="";

    document.getElementById(

        "cmbStatus"

    ).value="ativo";

    document.getElementById(

        "txtObservacao"

    ).value="";

}
/*==========================================================
PESQUISA
==========================================================*/

function pesquisar(){

    const texto=

    txtPesquisar.value

    .trim()

    .toLowerCase();

    const perfil=

    cmbFiltroPerfil

    ?cmbFiltroPerfil.value

    :"";

    const status=

    cmbFiltroStatus

    ?cmbFiltroStatus.value

    :"";

    const loja=

    cmbFiltroLoja

    ?cmbFiltroLoja.value

    :"";

    usuariosFiltrados=

    usuarios.filter(usuario=>{

        const pesquisa=

            usuario.nome

            .toLowerCase()

            .includes(texto)

            ||

            usuario.email

            .toLowerCase()

            .includes(texto)

            ||

            usuario.cargo

            .toLowerCase()

            .includes(texto);

        const filtroPerfil=

            perfil===""

            ||

            usuario.perfil===perfil;

        const filtroStatus=

            status===""

            ||

            usuario.status===status;

        const filtroLoja=

            loja===""

            ||

            usuario.loja===loja;

        return(

            pesquisa

            &&

            filtroPerfil

            &&

            filtroStatus

            &&

            filtroLoja

        );

    });

    preencherTabela();

    atualizarCards();

}
/*==========================================================
CONFIGURAR EVENTOS DA TELA
==========================================================*/

function configurarEventosTela(){

    if(txtPesquisar){

        txtPesquisar.addEventListener(

            "keyup",

            pesquisar

        );

    }

    if(cmbFiltroPerfil){

        cmbFiltroPerfil.addEventListener(

            "change",

            pesquisar

        );

    }

    if(cmbFiltroStatus){

        cmbFiltroStatus.addEventListener(

            "change",

            pesquisar

        );

    }

    if(cmbFiltroLoja){

        cmbFiltroLoja.addEventListener(

            "change",

            pesquisar

        );

    }

    if(btnNovoUsuario){

        btnNovoUsuario.addEventListener(

            "click",

            novoUsuario

        );

    }

}
/*==========================================================
EXPORTAÇÕES PARA HTML
==========================================================*/

window.novoUsuario=

novoUsuario;

window.editarUsuario=

editarUsuario;

window.salvarUsuario=

salvarUsuario;

window.atualizarUsuario=

atualizarUsuario;

window.excluirUsuario=

excluirUsuario;

window.alterarStatus=

alterarStatus;

window.ordenarUsuarios=

ordenarUsuarios;

/*==========================================================
SALVAR USUÁRIO
==========================================================*/

async function salvarUsuario(){

    try{

        const nome=

        document.getElementById(

            "txtNome"

        ).value.trim();

        const telefone=

        document.getElementById(

            "txtTelefone"

        ).value.trim();

        const email=

        document.getElementById(

            "txtEmail"

        ).value.trim();

        const senha=

        document.getElementById(

            "txtSenha"

        ).value;

        const cargo=

        document.getElementById(

            "txtCargo"

        ).value.trim();

        const perfil=

        cmbPerfil.value;

        const loja=

        cmbLoja.value;

        const status=

        document.getElementById(

            "cmbStatus"

        ).value;

        const observacao=

        document.getElementById(

            "txtObservacao"

        ).value.trim();

        if(

            nome==="" ||

            email==="" ||

            senha==="" ||

            cargo==="" ||

            perfil==="" ||

            loja===""

        ){

            ui.notify(

                "Preencha todos os campos obrigatórios.",

                "warning"

            );

            return;

        }

        ui.loader.show();

        /*==================================================
        CRIA INSTÂNCIA TEMPORÁRIA
        ==================================================*/

        const appTemp=

        initializeApp(

            firebasePrincipal,

            "temp_"+Date.now()

        );

        const authTemp=

        getAuth(

            appTemp

        );

        /*==================================================
        AUTHENTICATION
        ==================================================*/

        const credencial=

        await createUserWithEmailAndPassword(

            authTemp,

            email,

            senha

        );

        const uid=

        credencial.user.uid;
                /*==================================================
        FIRESTORE
        ==================================================*/

        await addDoc(

            collection(

                dbPrincipal,

                "usuarios"

            ),

            {

                uid:uid,

                nome:nome,

                telefone:telefone,

                email:email,

                cargo:cargo,

                perfil:perfil,

                loja:loja,

                status:status,

                observacao:observacao,

                dataCadastro:serverTimestamp(),

                ultimoAcesso:null

            }

        );

        /*==================================================
        LOG
        ==================================================*/
                await auth.registrarLog(

            "Usuários",

            "Criou Usuário",

            nome,

            uid,

            "Cadastro realizado."

        );

        /*==================================================
        FINALIZA
        ==================================================*/

        await signOut(

            authTemp

        );

        await deleteApp(

            appTemp

        );

        ui.notify(

            "Usuário cadastrado com sucesso.",

            "success"

        );

        ui.modal.fechar(

            "modalUsuario"

        );

        limparFormulario();

        await carregarUsuarios();

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            erro.message,

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}
/*==========================================================
EDITAR USUÁRIO
==========================================================*/

async function editarUsuario(id){

    try{

        ui.loader.show();

        const usuario=

        usuarios.find(

            u=>u.id===id

        );

        if(!usuario){

            ui.notify(

                "Usuário não encontrado.",

                "error"

            );

            return;

        }

        const tituloModal=

        document.getElementById(

            "tituloModal"

        );

        if(tituloModal){

            tituloModal.innerHTML=

            "Editar Usuário";

        }

        document.getElementById(

            "txtId"

        ).value=

        usuario.id;

        document.getElementById(

            "txtNome"

        ).value=

        usuario.nome;

        document.getElementById(

            "txtTelefone"

        ).value=

        usuario.telefone || "";

        document.getElementById(

            "txtEmail"

        ).value=

        usuario.email;

        document.getElementById(

            "txtSenha"

        ).value="";

        document.getElementById(

            "txtCargo"

        ).value=

        usuario.cargo;

        cmbPerfil.value=

        usuario.perfil;

        cmbLoja.value=

        usuario.loja;

        document.getElementById(

            "cmbStatus"

        ).value=

        usuario.status;

        document.getElementById(

            "txtObservacao"

        ).value=

        usuario.observacao || "";

        ui.modal.abrir(

            "modalUsuario"

        );

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            "Erro ao carregar usuário.",

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}
/*==========================================================
ATUALIZAR USUÁRIO
==========================================================*/

async function atualizarUsuario(){

    try{

        const id=

        document.getElementById(

            "txtId"

        ).value;

        if(id===""){

            return salvarUsuario();

        }

        ui.loader.show();

        const nome=

        document.getElementById(

            "txtNome"

        ).value.trim();

        const telefone=

        document.getElementById(

            "txtTelefone"

        ).value.trim();

        const email=

        document.getElementById(

            "txtEmail"

        ).value.trim();

        const cargo=

        document.getElementById(

            "txtCargo"

        ).value.trim();

        const perfil=

        cmbPerfil.value;

        const loja=

        cmbLoja.value;

        const status=

        document.getElementById(

            "cmbStatus"

        ).value;

        const observacao=

        document.getElementById(

            "txtObservacao"

        ).value.trim();

        if(

            nome==="" ||

            email==="" ||

            cargo==="" ||

            perfil==="" ||

            loja===""

        ){

            ui.notify(

                "Preencha todos os campos obrigatórios.",

                "warning"

            );

            return;

        }

        await updateDoc(

            doc(

                dbPrincipal,

                "usuarios",

                id

            ),

            {

                nome,

                telefone,

                email,

                cargo,

                perfil,

                loja,

                status,

                observacao

            }

        );

        await auth.registrarLog(

            "Usuários",

            "Editar Usuário",

            nome,

            id,

            "Cadastro atualizado."

        );

        ui.notify(

            "Usuário atualizado com sucesso.",

            "success"

        );

        ui.modal.fechar(

            "modalUsuario"

        );

        limparFormulario();

        await carregarUsuarios();

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            erro.message,

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}
/*==========================================================
EXCLUIR USUÁRIO
==========================================================*/

async function excluirUsuario(id){

    try{

        const usuario=

        usuarios.find(

            u=>u.id===id

        );

        if(!usuario){

            ui.notify(

                "Usuário não encontrado.",

                "error"

            );

            return;

        }

        const confirmar=

        await ui.confirmar(

            "Excluir Usuário",

            `Deseja realmente excluir o usuário <b>${usuario.nome}</b>?`

        );

        if(!confirmar){

            return;

        }

        ui.loader.show();

        await deleteDoc(

            doc(

                dbPrincipal,

                "usuarios",

                id

            )

        );

        usuarios=

        usuarios.filter(

            u=>u.id!==id

        );

        usuariosFiltrados=

        usuariosFiltrados.filter(

            u=>u.id!==id

        );

        preencherTabela();

        atualizarCards();

        await auth.registrarLog(

            "Usuários",

            "Excluir Usuário",

            usuario.nome,

            id,

            "Usuário removido do Firestore."

        );

        ui.notify(

            "Usuário excluído com sucesso.",

            "success"

        );

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            erro.message,

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}
/*==========================================================
EXCLUSÃO EM LOTE
==========================================================*/

async function excluirSelecionados(){

    try{

        const selecionados=[

            ...document.querySelectorAll(

                ".checkUsuario:checked"

            )

        ];

        if(

            selecionados.length===0

        ){

            ui.notify(

                "Nenhum usuário selecionado.",

                "warning"

            );

            return;

        }

        const confirmar=

        await ui.confirmar(

            "Excluir Usuários",

            `Deseja excluir ${selecionados.length} usuário(s)?`

        );

        if(!confirmar){

            return;

        }

        ui.loader.show();

        for(const item of selecionados){

            await deleteDoc(

                doc(

                    dbPrincipal,

                    "usuarios",

                    item.value

                )

            );

        }

        await auth.registrarLog(

            "Usuários",

            "Exclusão em Lote",

            "",

            "",

            `${selecionados.length} usuários removidos.`

        );

        await carregarUsuarios();

        ui.notify(

            "Exclusão realizada.",

            "success"

        );

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            erro.message,

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}

/*==========================================================
BOTÃO EXCLUIR EM LOTE
==========================================================*/

if(btnExcluirSelecionados){

    btnExcluirSelecionados.onclick=

    excluirSelecionados;

}
/*==========================================================
ALTERAR STATUS
==========================================================*/

async function alterarStatus(id){

    try{

        const usuario=

        usuarios.find(

            u=>u.id===id

        );

        if(!usuario){

            ui.notify(

                "Usuário não encontrado.",

                "error"

            );

            return;

        }

        const novoStatus=

        usuario.status==="ativo"

        ?"inativo"

        :"ativo";

        const confirmar=

        await ui.confirmar(

            "Alterar Status",

            `Deseja realmente ${
                novoStatus==="ativo"
                ?"ativar"
                :"inativar"
            } o usuário <b>${usuario.nome}</b>?`

        );

        if(!confirmar){

            return;

        }

        ui.loader.show();

        await updateDoc(

            doc(

                dbPrincipal,

                "usuarios",

                id

            ),

            {

                status:novoStatus,

                dataAlteracao:serverTimestamp()

            }

        );

        usuario.status=

        novoStatus;

        preencherTabela();

        atualizarCards();

        await auth.registrarLog(

            "Usuários",

            novoStatus==="ativo"

            ?"Ativar Usuário"

            :"Inativar Usuário",

            usuario.nome,

            id,

            `Status alterado para ${novoStatus}.`

        );

        ui.notify(

            `Usuário ${novoStatus} com sucesso.`,

            "success"

        );

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            erro.message,

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}
/*==========================================================
ATIVAR USUÁRIOS SELECIONADOS
==========================================================*/

async function ativarSelecionados(){

    try{

        const selecionados=[

            ...document.querySelectorAll(

                ".checkUsuario:checked"

            )

        ];

        if(

            selecionados.length===0

        ){

            ui.notify(

                "Nenhum usuário selecionado.",

                "warning"

            );

            return;

        }

        const confirmar=

        await ui.confirmar(

            "Ativar Usuários",

            `Deseja ativar ${selecionados.length} usuário(s)?`

        );

        if(!confirmar){

            return;

        }

        ui.loader.show();

        for(const item of selecionados){

            await updateDoc(

                doc(

                    dbPrincipal,

                    "usuarios",

                    item.value

                ),

                {

                    status:"ativo",

                    dataAlteracao:serverTimestamp()

                }

            );

        }

        await auth.registrarLog(

            "Usuários",

            "Ativação em Lote",

            "",

            "",

            `${selecionados.length} usuários ativados.`

        );

        await carregarUsuarios();

        ui.notify(

            "Usuários ativados.",

            "success"

        );

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            erro.message,

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}

/*==========================================================
BOTÃO ATIVAR SELECIONADOS
==========================================================*/

if(btnAtivarSelecionados){

    btnAtivarSelecionados.onclick=

    ativarSelecionados;

}
/*==========================================================
INATIVAR USUÁRIOS SELECIONADOS
==========================================================*/

async function inativarSelecionados(){

    try{

        const selecionados=[

            ...document.querySelectorAll(

                ".checkUsuario:checked"

            )

        ];

        if(

            selecionados.length===0

        ){

            ui.notify(

                "Nenhum usuário selecionado.",

                "warning"

            );

            return;

        }

        const confirmar=

        await ui.confirmar(

            "Inativar Usuários",

            `Deseja inativar ${selecionados.length} usuário(s)?`

        );

        if(!confirmar){

            return;

        }

        ui.loader.show();

        for(const item of selecionados){

            await updateDoc(

                doc(

                    dbPrincipal,

                    "usuarios",

                    item.value

                ),

                {

                    status:"inativo",

                    dataAlteracao:serverTimestamp()

                }

            );

        }

        await auth.registrarLog(

            "Usuários",

            "Inativação em Lote",

            "",

            "",

            `${selecionados.length} usuários inativados.`

        );

        await carregarUsuarios();

        ui.notify(

            "Usuários inativados.",

            "success"

        );

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            erro.message,

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}

/*==========================================================
BOTÃO INATIVAR SELECIONADOS
==========================================================*/

if(btnInativarSelecionados){

    btnInativarSelecionados.onclick=

    inativarSelecionados;

}
/*==========================================================
RESETAR SENHA
==========================================================*/

async function resetarSenha(id){

    try{

        const usuario=

        usuarios.find(

            u=>u.id===id

        );

        if(!usuario){

            ui.notify(

                "Usuário não encontrado.",

                "error"

            );

            return;

        }

        const confirmar=

        await ui.confirmar(

            "Redefinir Senha",

            `Enviar e-mail de redefinição de senha para <b>${usuario.email}</b>?`

        );

        if(!confirmar){

            return;

        }

        ui.loader.show();

        await sendPasswordResetEmail(

            authPrincipal,

            usuario.email

        );

        await updateDoc(

            doc(

                dbPrincipal,

                "usuarios",

                id

            ),

            {

                primeiroAcesso:true,

                dataResetSenha:serverTimestamp()

            }

        );

        await auth.registrarLog(

            "Usuários",

            "Reset de Senha",

            usuario.nome,

            id,

            "E-mail de redefinição enviado."

        );

        ui.notify(

            "E-mail enviado com sucesso.",

            "success"

        );

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            erro.message,

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}
/*==========================================================
RESET EM LOTE
==========================================================*/

async function resetarSelecionados(){

    try{

        const selecionados=[

            ...document.querySelectorAll(

                ".checkUsuario:checked"

            )

        ];

        if(

            selecionados.length===0

        ){

            ui.notify(

                "Nenhum usuário selecionado.",

                "warning"

            );

            return;

        }

        const confirmar=

        await ui.confirmar(

            "Resetar Senhas",

            `Enviar e-mail para ${selecionados.length} usuário(s)?`

        );

        if(!confirmar){

            return;

        }

        ui.loader.show();

        for(const item of selecionados){

            const usuario=

            usuarios.find(

                u=>u.id===item.value

            );

            if(!usuario){

                continue;

            }

            await sendPasswordResetEmail(

                authPrincipal,

                usuario.email

            );

            await updateDoc(

                doc(

                    dbPrincipal,

                    "usuarios",

                    usuario.id

                ),

                {

                    primeiroAcesso:true,

                    dataResetSenha:serverTimestamp()

                }

            );

        }

        await auth.registrarLog(

            "Usuários",

            "Reset em Lote",

            "",

            "",

            `${selecionados.length} usuário(s).`

        );

        ui.notify(

            "E-mails enviados.",

            "success"

        );

    }

    catch(erro){

        console.error(

            erro

        );

        ui.notify(

            erro.message,

            "error"

        );

    }

    finally{

        ui.loader.hide();

    }

}

/*==========================================================
BOTÃO RESET EM LOTE
==========================================================*/

const btnReset=

document.getElementById(

    "btnResetSenha"

);

if(btnReset){

    btnReset.onclick=

    resetarSelecionados;

}

/*==========================================================
EXPORTAÇÃO HTML
==========================================================*/

window.resetarSenha=

resetarSenha;
/*==========================================================
LOGS
==========================================================*/

async function carregarLogs(){

    try{

        const snapshot=

        await getDocs(

            query(

                collection(

                    dbPrincipal,

                    "logs"

                ),

                orderBy(

                    "data",

                    "desc"

                )

            )

        );

        const tbody=

        document.getElementById(

            "tbodyLogs"

        );

        if(!tbody){

            return;

        }

        tbody.innerHTML="";

        let contador=0;

        snapshot.forEach(documento=>{

            if(contador>=20){

                return;

            }

            const log=

            documento.data();

            tbody.innerHTML+=`

<tr>

<td>

${log.data

?ui.dataHora(log.data)

:""}

</td>

<td>

${log.usuario||""}

</td>

<td>

${log.acao||""}

</td>

<td>

${log.modulo||""}

</td>

<td>

${log.descricao||""}

</td>

</tr>

`;

            contador++;

        });

    }

    catch(erro){

        console.error(

            erro

        );

    }

}
/*==========================================================
DASHBOARD
==========================================================*/

function atualizarDashboard(){

    atualizarCards();

    atualizarGraficoPerfis();

    atualizarGraficoStatus();

    atualizarUltimosAcessos();

    atualizarIndicadores();

}
/*==========================================================
GRÁFICO POR PERFIL
==========================================================*/

function atualizarGraficoPerfis(){

    const perfis={};

    usuarios.forEach(usuario=>{

        const perfil=

        usuario.perfil || "Sem Perfil";

        perfis[perfil]=(perfis[perfil]||0)+1;

    });

    const labels=

    Object.keys(

        perfis

    );

    const valores=

    Object.values(

        perfis

    );

    if(window.graficoPerfis){

        window.graficoPerfis.destroy();

    }

    const canvas=

    document.getElementById(

        "graficoPerfis"

    );

    if(!canvas){

        return;

    }

    window.graficoPerfis=

    new Chart(

        canvas,

        {

            type:"bar",

            data:{

                labels,

                datasets:[

                    {

                        label:"Usuários",

                        data:valores,

                        borderWidth:1

                    }

                ]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}
/*==========================================================
ATUALIZAR INDICADORES
==========================================================*/

function atualizarIndicadores(){

    const ultimaAtualizacao=

    document.getElementById(

        "cardUltimaAtualizacao"

    );

    if(ultimaAtualizacao){

        ultimaAtualizacao.innerHTML=

        new Date().toLocaleTimeString(

            "pt-BR"

        );

    }

    const ultimoCadastro=

    document.getElementById(

        "cardUltimoCadastro"

    );

    if(

        ultimoCadastro &&

        usuarios.length

    ){

        ultimoCadastro.innerHTML=

        usuarios[

            usuarios.length-1

        ].nome;

    }

    const perfilPopular=

    document.getElementById(

        "cardPerfilPopular"

    );

    if(perfilPopular){

        const mapa={};

        usuarios.forEach(usuario=>{

            mapa[usuario.perfil]=

            (mapa[usuario.perfil]||0)+1;

        });

        const perfil=

        Object.keys(

            mapa

        ).sort(

            (a,b)=>

            mapa[b]-mapa[a]

        )[0];

        perfilPopular.innerHTML=

        perfil || "--";

    }

    const lojaPopular=

    document.getElementById(

        "cardLojaPopular"

    );

    if(lojaPopular){

        const mapa={};

        usuarios.forEach(usuario=>{

            mapa[usuario.loja]=

            (mapa[usuario.loja]||0)+1;

        });

        const loja=

        Object.keys(

            mapa

        ).sort(

            (a,b)=>

            mapa[b]-mapa[a]

        )[0];

        lojaPopular.innerHTML=

        loja || "--";

    }

}
/*==========================================================
GRÁFICO STATUS
==========================================================*/

function atualizarGraficoStatus(){

    const ativos=

    usuarios.filter(

        usuario=>usuario.status==="ativo"

    ).length;

    const inativos=

    usuarios.filter(

        usuario=>usuario.status==="inativo"

    ).length;

    if(window.graficoStatus){

        window.graficoStatus.destroy();

    }

    const canvas=

    document.getElementById(

        "graficoStatus"

    );

    if(!canvas){

        return;

    }

    window.graficoStatus=

    new Chart(

        canvas,

        {

            type:"doughnut",

            data:{

                labels:[

                    "Ativos",

                    "Inativos"

                ],

                datasets:[

                    {

                        data:[

                            ativos,

                            inativos

                        ]

                    }

                ]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}
/*==========================================================
ÚLTIMOS ACESSOS
==========================================================*/

function atualizarUltimosAcessos(){

    const tabela=

    document.getElementById(

        "tbodyUltimosAcessos"

    );

    if(!tabela){

        return;

    }

    tabela.innerHTML="";

    const lista=[

        ...usuarios

    ]

    .sort(

        (a,b)=>{

            const dataA=

            a.ultimoAcesso?.seconds||0;

            const dataB=

            b.ultimoAcesso?.seconds||0;

            return dataB-dataA;

        }

    )

    .slice(

        0,

        10

    );

    lista.forEach(usuario=>{

        tabela.innerHTML+=`

<tr>

<td>

${usuario.nome}

</td>

<td>

${usuario.email}

</td>

<td>

${usuario.perfil}

</td>

<td>

${usuario.ultimoAcesso

?ui.dataHora(

    usuario.ultimoAcesso

)

:"Nunca"}

</td>

</tr>

`;

    });

}
/*==========================================================
PESQUISA AVANÇADA
==========================================================*/

function limparFiltros(){

    txtPesquisar.value="";

    cmbFiltroPerfil.value="";

    usuariosFiltrados=[

        ...usuarios

    ];

    preencherTabela();

}

/*==========================================================
ORDENAR
==========================================================*/

function ordenarUsuarios(campo){

    usuariosFiltrados.sort(

        (a,b)=>{

            const A=

            (a[campo]||"")

            .toString()

            .toLowerCase();

            const B=

            (b[campo]||"")

            .toString()

            .toLowerCase();

            return A.localeCompare(

                B

            );

        }

    );

    preencherTabela();

}

/*==========================================================
ATUALIZA TUDO
==========================================================*/

function atualizarTudo(){

    preencherTabela();

    atualizarDashboard();

}
/*==========================================================
EXPORTAR CSV
==========================================================*/

function exportarCSV(){

    ui.table.exportarCSV(

        "tabelaUsuarios",

        "Usuarios"

    );

}

/*==========================================================
EXPORTAR JSON
==========================================================*/

function exportarJSON(){

    ui.table.exportarJSON(

        usuarios,

        "Usuarios"

    );

}

/*==========================================================
EXPORTAR PDF
==========================================================*/

function exportarPDF(){

    const elemento=

    document.getElementById(

        "tabelaUsuarios"

    );

    if(!elemento){

        return;

    }

    window.print();

}

/*==========================================================
IMPRIMIR
==========================================================*/

function imprimirUsuarios(){

    ui.table.imprimir(

        "tabelaUsuarios"

    );

}

/*==========================================================
EXPORTAR EXCEL
==========================================================*/

function exportarExcel(){

    let csv="";

    csv+="Nome;Email;Cargo;Perfil;Loja;Status\n";

    usuarios.forEach(usuario=>{

        csv+=

        `"${usuario.nome}";`+

        `"${usuario.email}";`+

        `"${usuario.cargo}";`+

        `"${usuario.perfil}";`+

        `"${usuario.loja}";`+

        `"${usuario.status}"\n`;

    });

    ui.download(

        "Usuarios.xls",

        csv,

        "application/vnd.ms-excel"

    );

}

/*==========================================================
BACKUP
==========================================================*/

function backupUsuarios(){

    const backup={

        data:new Date(),

        quantidade:usuarios.length,

        usuarios:usuarios

    };

    ui.download(

        "BackupUsuarios.json",

        JSON.stringify(

            backup,

            null,

            4

        ),

        "application/json"

    );

}

/*==========================================================
IMPORTAÇÃO FUTURA
==========================================================*/

function importarUsuarios(){

    ui.alerta(

        "Importação",

        "Função disponível em versão futura."

    );

}
/*==========================================================
BOTÕES EXPORTAÇÃO
==========================================================*/

const btnCSV=

document.getElementById(

    "btnCSV"

);

if(btnCSV){

    btnCSV.onclick=

    exportarCSV;

}

const btnExcel=

document.getElementById(

    "btnExcel"

);

if(btnExcel){

    btnExcel.onclick=

    exportarExcel;

}

const btnPDF=

document.getElementById(

    "btnPDF"

);

if(btnPDF){

    btnPDF.onclick=

    exportarPDF;

}

const btnPrint=

document.getElementById(

    "btnPrint"

);

if(btnPrint){

    btnPrint.onclick=

    imprimirUsuarios;

}

const btnJSON=

document.getElementById(

    "btnJSON"

);

if(btnJSON){

    btnJSON.onclick=

    exportarJSON;

}

const btnBackup=

document.getElementById(

    "btnBackup"

);

if(btnBackup){

    btnBackup.onclick=

    backupUsuarios;

}

const btnImportar=

document.getElementById(

    "btnImportar"

);

if(btnImportar){

    btnImportar.onclick=

    importarUsuarios;

}

/*==========================================================
EXPORTAÇÃO HTML
==========================================================*/

window.exportarCSV=

exportarCSV;

window.exportarExcel=

exportarExcel;

window.exportarPDF=

exportarPDF;

window.imprimirUsuarios=

imprimirUsuarios;

window.exportarJSON=

exportarJSON;

window.backupUsuarios=

backupUsuarios;
/*==========================================================
AUTO ATUALIZAÇÃO
==========================================================*/

let intervaloAtualizacao=null;

function iniciarAtualizacaoAutomatica(){

    pararAtualizacaoAutomatica();

    intervaloAtualizacao=setInterval(

        ()=>{

            carregarUsuarios();

        },

        120000

    );

}

function pararAtualizacaoAutomatica(){

    if(intervaloAtualizacao){

        clearInterval(

            intervaloAtualizacao

        );

    }

}

/*==========================================================
ATALHOS
==========================================================*/

document.addEventListener(

    "keydown",

    async(e)=>{

        if(

            e.ctrlKey &&

            e.key==="n"

        ){

            e.preventDefault();

            novoUsuario();

        }

        if(

            e.ctrlKey &&

            e.key==="s"

        ){

            e.preventDefault();

            atualizarUsuario();

        }

        if(

            e.key==="F5"

        ){

            e.preventDefault();

            await carregarUsuarios();

            ui.notify(

                "Lista atualizada.",

                "success"

            );

        }

        if(

            e.key==="Escape"

        ){

            ui.modal.fechar(

                "modalUsuario"

            );

        }

    }

);

/*==========================================================
CONFIGURAR EVENTOS
==========================================================*/

function configurarEventos(){

    if(btnNovoUsuario){

        btnNovoUsuario.onclick=

        novoUsuario;

    }

    if(btnAtualizar){

        btnAtualizar.onclick=

        carregarUsuarios;

    }

    if(btnSalvarUsuario){

        btnSalvarUsuario.onclick=

        atualizarUsuario;

    }

}
/*==========================================================
OBSERVADORES
==========================================================*/

window.addEventListener(

    "focus",

    ()=>{

        carregarUsuarios();

    }

);

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(

            document.visibilityState==="visible"

        ){

            carregarUsuarios();

        }

    }

);

/*==========================================================
FINALIZAÇÃO
==========================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        pararAtualizacaoAutomatica();

    }

);
/*==========================================================
INICIALIZAÇÃO FINAL
==========================================================*/

async function inicializarModuloUsuarios(){

    try{

        await iniciar();

        configurarEventos();

        iniciarAtualizacaoAutomatica();

        atualizarDashboard();

        configurarEventosTela();

        await auth.registrarLog(

            "Usuários",

            "Acesso",

            "",

            "",

            "Módulo aberto."

        );

        console.log(

            "Módulo Usuários carregado."

        );

    }

    catch(erro){

        console.error(

            erro

        );

    }

}

/*==========================================================
START
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    inicializarModuloUsuarios

);

/*==========================================================
OBJETO USUÁRIOS
==========================================================*/

const usuariosManager={

    carregarUsuarios,

    atualizarUsuario,

    salvarUsuario,

    editarUsuario,

    excluirUsuario,

    alterarStatus,

    resetarSenha,

    atualizarDashboard,

    exportarCSV,

    exportarExcel,

    exportarPDF,

    exportarJSON,

    backupUsuarios,

    iniciarAtualizacaoAutomatica,

    pararAtualizacaoAutomatica

};

/*==========================================================
EXPORTAÇÃO PADRÃO
==========================================================*/

export default usuariosManager;