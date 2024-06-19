document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const bookList = document.getElementById('book-list');
  const addButton = document.getElementById('add-button');
  const titleInput = document.getElementById('title-input');
  const authorInput = document.getElementById('author-input');

  let books = [];

  const renderBooks = (booksToRender) => {
      bookList.innerHTML = '';
      booksToRender.forEach(book => {
          const bookDiv = document.createElement('div');
          bookDiv.textContent = `${book.title} by ${book.author}`;
          bookList.appendChild(bookDiv);
      });
  };

  const fetchBooksFromAPI = async () => {
      try {
          const response = await axios.get('https://api.example.com/books');
          books = response.data;
          renderBooks(books);
          // Guardar en localStorage
          localStorage.setItem('libraryBooks', JSON.stringify(books));
      } catch (error) {
          console.error('Error fetching books:', error);
      }
  };

  const fetchBooksFromLocal = async () => {
      try {
          const response = await fetch('books.json');
          books = await response.json();
          renderBooks(books);
          // Guardar en localStorage
          localStorage.setItem('libraryBooks', JSON.stringify(books));
      } catch (error) {
          console.error('Error fetching local books:', error);
      }
  };

  const searchBooks = () => {
      const query = searchInput.value.toLowerCase();
      const filteredBooks = books.filter(book =>
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query)
      );

      if (filteredBooks.length === 0) {
          alert('No se encontraron resultados.');
      } else {
          renderBooks(filteredBooks);
      }
  };

  const addBook = () => {
      const title = titleInput.value.trim();
      const author = authorInput.value.trim();
      if (title && author) {
          const newBook = { title, author };
          books.push(newBook);
          renderBooks(books);
          // Guardar en localStorage después de agregar un libro
          localStorage.setItem('libraryBooks', JSON.stringify(books));
          titleInput.value = '';
          authorInput.value = '';
      } else {
          alert('Por favor, completa todos los campos');
      }
  };

  searchButton.addEventListener('click', searchBooks);
  addButton.addEventListener('click', addBook);

  // Función para cargar libros desde localStorage al inicio
  const loadBooksFromLocalStorage = () => {
      const storedBooks = localStorage.getItem('libraryBooks');
      if (storedBooks) {
          books = JSON.parse(storedBooks);
          renderBooks(books);
      }
  };

  // Inicializar con datos locales o de API
  loadBooksFromLocalStorage(); // Intenta cargar desde localStorage primero
  // Si no hay datos en localStorage, carga desde el archivo local o API
  if (books.length === 0) {
      fetchBooksFromLocal(); // Intenta cargar desde el archivo local
      // fetchBooksFromAPI(); // Descomentar si deseas cargar desde la API
  }
});