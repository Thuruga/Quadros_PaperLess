document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("itemForm");
    const newItemButton = document.getElementById("newItem");
    const setorEHS = document.querySelector(".ehs");
    const setorQualidade = document.querySelector(".qualidade");
    const setorProdutividade = document.querySelector(".produtividade");
    const setorPessoas = document.querySelector(".pessoas");
    const setorCustos = document.querySelector(".custos");

let editMode = false;
let atualButton = null;

// Esconder o formulário ao iniciar
form.style.display = "none";

// Carregar itens do localStorage
loadItems();

// Mostrar o formulário "Novo Item"
newItemButton.addEventListener("click", () => {
if (form.style.display === "none") {
    form.style.display = "block";
    newItemButton.textContent = "Cancelar";
} else {
    editMode = false;
    atualButton = null;
    form.reset();
    form.style.display = "none";
    newItemButton.textContent = "Novo Item";
}
});

// Adicionar evento de enviar o formulário
form.addEventListener("submit", function (e) {
e.preventDefault(); // Evitar envio padrão

// Pegar os valores do form
const itemName = document.getElementById("itemName").value;
const itemLink = document.getElementById("itemLink").value;
const itemSetor = document.getElementById("itemSetor").value;

if (editMode && atualButton) {
    // Atualizar o botão existente
    const oldSetor = atualButton.dataset.setor;
    atualButton.href = itemLink;
    atualButton.querySelector(".button").textContent = itemName;
    atualButton.dataset.setor = itemSetor;
    mudarSaveLocal();

    if (oldSetor !== itemSetor) {
        atualButton.parentElement.remove();
        const newButton = criarItem (itemName, itemLink, itemSetor);
        itemToSetor(newButton, itemSetor);
        edit_deletBTN(newButton);
    }
    mudarSaveLocal();

    }

    else {
        // Criar o botão dinamicamente
        const newButton = criarItem(itemName, itemLink, itemSetor);
        itemToSetor(newButton, itemSetor);
        edit_deletBTN(newButton);
        saveLocal(itemName, itemLink, itemSetor);
    }
        form.reset();
        form.style.display = "none";
        newItemButton.textContent = "Novo Item";
        editMode = false;
        currentButton = null;
});

function criarItem (name, link, setor) {
const newButton = document.createElement("div");
newButton.innerHTML = `
    <a href="${link}" target="_blank" class="item-button" data-setor="${setor}">
        <button class="button">${name}</button>
    </a>
    <button class="edit-button">Editar</button>
    <button class="delete-button">Excluir</button>`;
return newButton;
}

function itemToSetor(button, setor) {
switch (setor) {
    case "EHS":
        setorEHS.appendChild(button);
        break;
    case "QUALIDADE":
        setorQualidade.appendChild(button);
        break;
    case "PRODUTIVIDADE":
        setorProdutividade.appendChild(button);
        break;
    case "PESSOAS":
        setorPessoas.appendChild(button);
        break;
    case "CUSTOS":
        setorCustos.appendChild(button);
        break;
}
}

function edit_deletBTN(button) {
button.querySelector(".edit-button").addEventListener("click", () => {
    editMode = true;
    atualButton = button.querySelector(".item-button");
    document.getElementById("itemName").value = atualButton.querySelector(".button").textContent;
    document.getElementById("itemLink").value = atualButton.href;
    document.getElementById("itemSetor").value = atualButton.dataset.setor;
    form.style.display = "block";
    newItemButton.textContent = "Cancelar";
});

button.querySelector(".delete-button").addEventListener("click", () => {
    button.remove();
    mudarSaveLocal();
});
}

function saveLocal(name, link, setor) {
const items = JSON.parse(localStorage.getItem("items")) || [];
items.push({ name, link, setor });
localStorage.setItem("items", JSON.stringify(items));
}

function mudarSaveLocal() {
const items = [];
document.querySelectorAll(".item-button").forEach(button => {
    items.push({
        name: button.querySelector(".button").textContent,
        link: button.href,
        setor: button.dataset.setor
    });
});
localStorage.setItem("items", JSON.stringify(items));
}

function loadItems() {
const items = JSON.parse(localStorage.getItem("items")) || [];
items.forEach(item => {
    const newButton = criarItem (item.name, item.link, item.setor);
    itemToSetor(newButton, item.setor);
    edit_deletBTN(newButton);
});
}
});
