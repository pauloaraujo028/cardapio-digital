const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const contactBtn = document.getElementById("contact-btn");
const operationBtn = document.getElementById("operation-btn");
const cartModal = document.getElementById("cart-modal");
const addressModal = document.getElementById("address-modal");
const operationModal = document.getElementById("operation-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartItemsCount = document.getElementById("cart-items-count");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const closeModalAddressBtn = document.getElementById("close-modal-address-btn");
const closeModalOperationBtn = document.getElementById(
  "close-modal-operation-btn",
);
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const addressWarn = document.getElementById("address-warn");
const nameWarn = document.getElementById("name-warn");
const phoneWarn = document.getElementById("phone-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";

  const isOpen = checkRestaurantOpen(operationDataGlobal);

  if (!isOpen) {
    Toastify({
      text: "Ops! O restaurante está fechado no momento.",
      duration: 5000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
  }
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

contactBtn.addEventListener("click", function () {
  updateAddressModal();
  addressModal.style.display = "flex";

  if (cart.length !== 0) {
  }
});

closeModalAddressBtn.addEventListener("click", function () {
  addressModal.style.display = "none";
});

operationBtn.addEventListener("click", function () {
  operationModal.style.display = "flex";
});

operationModal.addEventListener("click", function (event) {
  if (event.target === operationModal) {
    operationModal.style.display = "none";
  }
});

closeModalOperationBtn.addEventListener("click", function () {
  operationModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartModal();
}

function updateCartModal() {
  const isOpen = checkRestaurantOpen(operationDataGlobal);

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
        <p class="text-center text-gray-600 my-10 ">Seu carrinho está vazio!</p>
      `;

    contactBtn.setAttribute("disabled", "disabled");
    contactBtn.classList.remove("bg-gray-900");
    contactBtn.classList.add("bg-gray-400");
    cartTotal.textContent = formatedPrice(0);
    cartItemsCount.textContent = 0;
    cartCounter.innerText = 0;
    return;
  }

  if (isOpen) {
    contactBtn.removeAttribute("disabled");
    contactBtn.classList.remove("bg-gray-400");
    contactBtn.classList.add("bg-gray-900");
  } else {
    contactBtn.setAttribute("disabled", "disabled");
    contactBtn.classList.remove("bg-gray-900");
    contactBtn.classList.add("bg-gray-400");
  }

  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col",
    );

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between mt-4">
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-sm text-gray-600">Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">${formatedPrice(item.price)}</p>
        </div>

          <button class="px-4 py-1 rounded bg-red-500 hover:bg-red-700 text-white remove-from-cart-btn" data-name="${
            item.name
          }">Remover</button>
      </div>

      <div class="w-full border border-solid border-gray-600 mt-2"></div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = formatedPrice(total);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartItemsCount.textContent = totalItemsCount;

  // cartCounter.innerText = cart.length;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.innerText = totalItems;
}

function updateAddressModal() {
  if (cart.length === 0) {
    nameInput.value = "";
    phoneInput.value = "";
    addressInput.value = "";
    addressModal.style.display = "none";
    cartModal.style.display = "none";
  }
}

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

nameInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    nameInput.classList.remove("border-red-500");
    nameWarn.classList.add("hidden");
  }
});

phoneInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    phoneInput.classList.remove("border-red-500");
    phoneWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen(operationDataGlobal);

  if (!isOpen) {
    Toastify({
      text: "Ops! O restaurante está fechado no momento.",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();

    return;
  }

  if (cart.length === 0) return;

  let inputError = false;

  if (nameInput.value === "") {
    nameWarn.classList.remove("hidden");
    nameInput.classList.add("border-red-500");
    inputError = true;
  }

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    inputError = true;
  }

  if (phoneInput.value === "") {
    phoneWarn.classList.remove("hidden");
    phoneInput.classList.add("border-red-500");
    inputError = true;
  }

  if (inputError) return;

  Toastify({
    text: "Pedido realizado com sucesso!",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#22c55e",
    },
  }).showToast();

  setTimeout(() => {
    const cartItems = cart
      .map((item) => {
        return `
      ${item.name} - Quantidade: (${item.quantity}) - Preço: R$${item.price} |
    `;
      })
      .join("");

    const message = encodeURIComponent(cartItems);
    const phone = "5511900000000";

    window.open(
      `https://wa.me/${phone}?text=${message} Nome: ${nameInput.value} - Endereço: ${addressInput.value} - Telefone: ${phoneInput.value}`,
      "_blank",
    );

    cart = [];
    updateCartModal();
    updateAddressModal();
  }, 3000);
});

function checkRestaurantOpen(operationData) {
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const diasDaSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const today = diasDaSemana[currentDayIndex];
  const todayData = operationData.find((d) => d.day === today);

  if (!todayData || todayData.break === "true" || todayData.break === true) {
    return false;
  }

  const [openH, openM] = todayData.opening.split(":").map(Number);
  const [closeH, closeM] = todayData.closing.split(":").map(Number);

  const nowInMinutes = currentHour * 60 + currentMinutes;
  const openInMinutes = openH * 60 + openM;
  const closeInMinutes = closeH * 60 + closeM;

  return nowInMinutes >= openInMinutes && nowInMinutes < closeInMinutes;
}

let operationDataGlobal = [];

fetch("./data/operation.json")
  .then((res) => res.json())
  .then((data) => {
    operationDataGlobal = data;

    const operationContainer = document.getElementById("operation");
    const operationBtn = document.getElementById("operation-btn");
    const span = document.getElementById("date-span");

    const diasDaSemana = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    const todayIndex = new Date().getDay();
    const todayName = diasDaSemana[todayIndex].toLowerCase();
    const todayData = data.find((d) => d.day.toLowerCase() === todayName);

    const isClosed = todayData.break;

    if (checkRestaurantOpen(data)) {
      span.classList.remove("bg-red-500");
      span.classList.add("bg-green-600");
    } else {
      span.classList.remove("bg-green-600");
      span.classList.add("bg-red-500");
    }

    if (operationBtn) {
      if (todayData && !isClosed) {
        operationBtn.textContent = `${todayData.day} - ${todayData.opening} às ${todayData.closing}`;
      } else if (todayData && isClosed) {
        operationBtn.textContent = `${todayData.day} - Fechado`;
      } else {
        operationBtn.textContent = "Horário indisponível";
      }
    }

    const html = data
      .map((item) => {
        const isClosed = item.break === "true" || item.break === true;

        return `
          <div class="border p-3 rounded mb-2">
            <h3 class="text-lg font-medium">${item.day}</h3>
            ${
              isClosed
                ? `<p class="text-red-500 font-semibold text-sm">Fechado</p>`
                : `<p class="text-gray-600  text-sm">Horário: ${item.opening} às ${item.closing}</p>`
            }
          </div>
        `;
      })
      .join("");

    operationContainer.innerHTML = html;
  })
  .catch((error) => {
    console.error("Erro ao carregar operation.json", error);
  });

fetch("./data/menu.json")
  .then((res) => res.json())
  .then((menu) => {
    const cardContainer = document.getElementById("cards");

    const render = (title, items) => {
      const cards = items
        .map((item) => {
          return `
          <div class="flex p-4 border rounded-lg shadow-lg gap-2">
            <img src="${item.image}" alt="${
              item.name
            }" class="size-28 rounded-md hover:scale-110 hover:rotate-2 duration-300" />

          <div class="flex-1 flex flex-col justify-between">
            <div class="flex flex-col gap-1">
              <h2 class="font-bold">${item.name}</h2>
              <p class="text-sm text-gray-600">${item.description}</p>
            </div>
            <div class="flex items-center gap-2 justify-between mt-3">
              <p class="font-semibold text-lg">${formatedPrice(item.price)}</p>
              <button
                class="bg-gray-900 px-5 rounded add-to-cart-btn"
                data-name="${item.name}"
                data-price="${item.price}"
              >
                <i class="fa fa-cart-plus text-lg text-white"></i>
              </button>
            </div>
            </div>
          </div>
        `;
        })
        .join("");

      return `
        <h3 class="text-xl font-medium mb-4 mt-4 px-4 mx-auto max-w-7xl">${title}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mx-auto max-w-7xl px-4 mb-16"">
          ${cards}
        </div>
      `;
    };

    // Monta HTML completo
    const html = `
      ${render("Hambúrgueres", menu.hamburgueres)}
      ${render("Bebidas", menu.bebidas)}
    `;

    cardContainer.innerHTML = html;
  })
  .catch((error) => {
    console.error("Erro ao carregar menu.json", error);
  });

function formatedPrice(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}
