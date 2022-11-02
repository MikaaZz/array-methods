let books = [];
const endPointAPI =
  "https://guilhermeonrails.github.io/casadocodigo/livros.json";
getTakeBooksAPI();
const elementToInsertBook = document.querySelector("#livros");
const btnFilterBooks = document.querySelectorAll(".btn");
const btnPriceOrder = document.querySelector("#btnOrdenarPorPreco");
const totalPriceElement = document.querySelector(
  "#valor_total_livros_disponiveis"
);

async function getTakeBooksAPI() {
  const res = await fetch(endPointAPI);
  books = await res.json();
  let discountBooks = aplyDiscount(books);
  insertBook(discountBooks);
}

// Use forEach
function insertBook(bookList) {
  totalPriceElement.innerHTML = "";
  bookList.forEach((book) => {
    const availability =
      book.quantidade > 0 ? "livro__imagens" : "livro__imagens indisponivel";
    elementToInsertBook.innerHTML += `
    <div class="livro">
        <img
          class="${availability}"
          src="${book.imagem}"
          alt="${book.alt}"
        />
        <h2 class="livro__titulo">
        ${book.titulo}
        </h2>
        <p class="livro__descricao">${book.autor}</p>
        <p class="livro__preco" id="preco">${book.preco.toFixed(2)}</p>
        <div class="tags">
          <span class="tag">${book.categoria}</span>
        </div>
      </div>
    `;
  });
}

// Use map
function aplyDiscount(books) {
  const discount = 0.3;
  const discountBooks = books.map((book) => {
    return { ...book, preco: book.preco - book.preco * discount };
  });
  return discountBooks;
}

// Use filter
btnFilterBooks.forEach((btn) => btn.addEventListener("click", filterBooks));

function filterBooks() {
  const elementBtn = document.getElementById(this.id);
  const categori = elementBtn.value;
  const filteredBooks =
    categori === "disponivel"
      ? filterUseDisponibility()
      : filterUseCategori(categori);
  insertBook(filteredBooks);
  if (categori === "disponivel") {
    const totalValue = calculateTotalValueOfBooksDispo(filterBooks);
    showTotalAmount(totalValue);
  }
}

function filterUseCategori(categori) {
  return books.filter((book) => book.categoria === categori);
}

function filterUseDisponibility() {
  return books.filter((book) => book.quantidade > 0);
}

function showTotalAmount(totalValue) {
  totalPriceElement.innerHTML = `
  <div class="livros__disponiveis">
    <p>Todos os livros disponíveis por R$ <span id="valor">${totalValue}</span></p>
  </div>
  `;
}

// Use sort
btnPriceOrder.addEventListener("click", priceOrderBooks);
function priceOrderBooks() {
  const booksOrder = books.sort((a, b) => a.preco - b.preco);
  insertBook(booksOrder);
}

// Use reduce
function calculateTotalValueOfBooksDispo(books) {
  return books.reduce((acc, book) => acc + book.preco, 0).toFixed(2);
}
