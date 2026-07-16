/*==========================================================
PRATELEIRA.JS
PARTE 3.1
Firebase + Inicialização
==========================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/*==========================================================
FIREBASE
MANUTENÇÃO
==========================================================*/

const firebaseConfig = {

    apiKey: "AIzaSyCOjMwl8DVQ73AVUa0H4eFBwQuAmLM_aKs",

    authDomain: "controlegeral-c90c1.firebaseapp.com",

    projectId: "controlegeral-c90c1"

};

/*==========================================================
INICIALIZAÇÃO
==========================================================*/

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

/*==========================================================
ELEMENTOS
==========================================================*/

const tbody = document.getElementById("tbodyEquipamentos");

const txtPesquisar = document.getElementById("txtPesquisar");

const cmbCategoria = document.getElementById("cmbCategoria");

const btnPesquisar = document.getElementById("btnPesquisar");

const btnAtualizar = document.getElementById("btnAtualizar");

const totalEquipamentos = document.getElementById("totalEquipamentos");

const totalDesktop = document.getElementById("totalDesktop");

const totalNotebook = document.getElementById("totalNotebook");

const totalMonitor = document.getElementById("totalMonitor");

const loading = document.getElementById("loading");

/*==========================================================
VARIÁVEIS
==========================================================*/

let equipamentos = [];

let equipamentosFiltrados = [];

/*==========================================================
LOADING
==========================================================*/

function abrirLoading(){

    loading.style.display = "flex";

}

function fecharLoading(){

    loading.style.display = "none";

}

/*==========================================================
TOAST
==========================================================*/

function mostrarToast(mensagem, tipo="sucesso"){

    const toast = document.getElementById("toast");

    toast.textContent = mensagem;

    toast.className = "toast show";

    if(tipo === "erro"){

        toast.classList.add("erro");

    }

    if(tipo === "aviso"){

        toast.classList.add("aviso");

    }

    setTimeout(()=>{

        toast.className = "toast";

    },3000);

}

/*==========================================================
INICIALIZAÇÃO
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    carregarEquipamentos();

});

/*==========================================================
EVENTOS
==========================================================*/

btnAtualizar.addEventListener("click", () => {

    carregarEquipamentos();

});

btnPesquisar.addEventListener("click", () => {

    pesquisarEquipamentos();

});

txtPesquisar.addEventListener("keyup", () => {

    pesquisarEquipamentos();

});

cmbCategoria.addEventListener("change", () => {

    pesquisarEquipamentos();

});

/*==========================================================
ATUALIZAÇÃO AUTOMÁTICA
==========================================================*/

setInterval(() => {

    carregarEquipamentos();

},10000);

/*==========================================================
AS FUNÇÕES:

carregarEquipamentos()

pesquisarEquipamentos()

montarTabela()

atualizarCards()

serão implementadas na PARTE 3.2
==========================================================*/
/*==========================================================
CARREGAR EQUIPAMENTOS
Busca somente equipamentos com manutenção concluída
==========================================================*/

async function carregarEquipamentos(){

    abrirLoading();

    equipamentos = [];

    tbody.innerHTML = "";

    try{

        const manutencoes = query(
            collection(db,"manutencao"),
            where("statusManutencao","==","Concluído")
        );

        const snapshot = await getDocs(manutencoes);

        for(const documento of snapshot.docs){

            const manutencao = documento.data();

            if(!manutencao.pcId) continue;

            const computadorRef = doc(
                db,
                "computadores",
                manutencao.pcId
            );

            const computadorSnap = await getDoc(computadorRef);

            if(!computadorSnap.exists()) continue;

            const computador = computadorSnap.data();

            equipamentos.push({

                id: computadorSnap.id,

                patrimonio: computador.patrimonio || "",

                nomePC: computador.nomePC || "",

                serial: computador.serial || "",

                lojaId: computador.lojaId || "",

                armazenamento: computador.armazenamento || "",

                processador: computador.processador || "",

                ram: computador.ram || "",

                sistema: computador.sistema || "",

                observacoes: computador.observacoes || "",

                status: "Disponível"

            });

        }

        equipamentosFiltrados = [...equipamentos];

        atualizarCards();

        montarTabela();

    }

    catch(error){

        console.error(error);

        mostrarToast(
            "Erro ao carregar equipamentos.",
            "erro"
        );

    }

    finally{

        fecharLoading();

    }

}

/*==========================================================
PESQUISA
==========================================================*/

function pesquisarEquipamentos(){

    const texto = txtPesquisar.value
        .toLowerCase()
        .trim();

    const categoria = cmbCategoria.value;

    equipamentosFiltrados = equipamentos.filter(item=>{

        const pesquisa =

            item.nomePC.toLowerCase().includes(texto) ||

            item.patrimonio.toString().includes(texto) ||

            item.serial.toLowerCase().includes(texto);

        let filtroCategoria = true;

        if(categoria !== ""){

            filtroCategoria = item.nomePC
                .toLowerCase()
                .includes(categoria.toLowerCase());

        }

        return pesquisa && filtroCategoria;

    });

    montarTabela();

}

/*==========================================================
ATUALIZA CARDS
==========================================================*/

function atualizarCards(){

    totalEquipamentos.textContent = equipamentos.length;

    totalDesktop.textContent = equipamentos.filter(x=>

        x.nomePC.toLowerCase().includes("desktop")

    ).length;

    totalNotebook.textContent = equipamentos.filter(x=>

        x.nomePC.toLowerCase().includes("notebook")

    ).length;

    totalMonitor.textContent = equipamentos.filter(x=>

        x.nomePC.toLowerCase().includes("monitor")

    ).length;

}
/*==========================================================
MONTA TABELA
==========================================================*/

function montarTabela(){

    tbody.innerHTML = "";

    if(equipamentosFiltrados.length === 0){

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="sem-registros">

                        <i class="fa-solid fa-box-open"></i>

                        <h3>Nenhum equipamento disponível</h3>

                        <p>
                            Não existem equipamentos concluídos na manutenção.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        document.getElementById("registros").textContent =
            "0 Equipamentos";

        return;

    }

    equipamentosFiltrados.forEach(item=>{

        tbody.innerHTML += `

            <tr class="fadeIn">

                <td class="col-patrimonio">

                    <strong>${item.patrimonio}</strong>

                </td>

                <td class="col-equipamento">

                    <strong>${item.nomePC}</strong>

                </td>

                <td class="col-serial">

                    ${item.serial}

                </td>

                <td class="col-loja">

                    ${item.lojaId}

                </td>

                <td class="col-status">

                    <span class="badge badge-disponivel">

                        Disponível

                    </span>

                </td>

                <td class="col-acoes">

                    <div class="acoes">

                        <button
                            class="btn-icon btn-visualizar"
                            onclick="visualizarEquipamento('${item.id}')">

                            <i class="fa-solid fa-eye"></i>

                        </button>

                        <button
                            class="btn-icon btn-solicitar"
                            onclick="solicitarEquipamento('${item.id}')">

                            <i class="fa-solid fa-paper-plane"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

    document.getElementById("registros").textContent =

        equipamentosFiltrados.length +

        " Equipamentos encontrados";

}

/*==========================================================
VISUALIZAR
==========================================================*/

window.visualizarEquipamento = function(id){

    const equipamento = equipamentos.find(x => x.id === id);

    if(!equipamento) return;

    document.getElementById("detalhesEquipamento").innerHTML = `

        <table style="width:100%;border-collapse:collapse;">

            <tr>

                <td><strong>Patrimônio</strong></td>

                <td>${equipamento.patrimonio}</td>

            </tr>

            <tr>

                <td><strong>Equipamento</strong></td>

                <td>${equipamento.nomePC}</td>

            </tr>

            <tr>

                <td><strong>Serial</strong></td>

                <td>${equipamento.serial}</td>

            </tr>

            <tr>

                <td><strong>Processador</strong></td>

                <td>${equipamento.processador}</td>

            </tr>

            <tr>

                <td><strong>Memória</strong></td>

                <td>${equipamento.ram}</td>

            </tr>

            <tr>

                <td><strong>Armazenamento</strong></td>

                <td>${equipamento.armazenamento}</td>

            </tr>

            <tr>

                <td><strong>Sistema</strong></td>

                <td>${equipamento.sistema}</td>

            </tr>

            <tr>

                <td><strong>Observações</strong></td>

                <td>${equipamento.observacoes}</td>

            </tr>

        </table>

    `;

    document
        .getElementById("modalDetalhes")
        .classList
        .add("show");

}

/*==========================================================
SOLICITAR
==========================================================*/

window.solicitarEquipamento = function(id){

    const equipamento = equipamentos.find(x => x.id === id);

    if(!equipamento) return;

    mostrarToast(

        "Equipamento selecionado para solicitação."

    );

    // Na próxima etapa:
    // abrir solicitacoes.html
    // enviando o equipamento selecionado

}

/*==========================================================
FECHAR MODAL
==========================================================*/

document
.getElementById("fecharModal")
.addEventListener("click",()=>{

    document
    .getElementById("modalDetalhes")
    .classList
    .remove("show");

});

document
.getElementById("modalDetalhes")
.addEventListener("click",(e)=>{

    if(e.target.id==="modalDetalhes"){

        document
        .getElementById("modalDetalhes")
        .classList
        .remove("show");

    }

});

/*==========================================================
ESC
==========================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        document
        .getElementById("modalDetalhes")
        .classList
        .remove("show");

    }

});