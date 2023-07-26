// Function to create Product objects
function Product(name, imagePath) {
  this.name = name;
  this.imagePath = imagePath;
  this.timesShown = 0;
  this.timesClicked = 0;
  this.clickPercentage = 0;
}

const products = [
  new Product('Star Wars Bag','img/bag.jpg'),
  new Product('Banana Slicer', 'img/banana.jpg'),
  new Product('Bathroom Device Holder', 'img/bathroom.jpg'),
  new Product('Boots', 'img/boots.jpg'),
  new Product('Breakfast All-in-One', 'img/breakfast.jpg'),
  new Product('Meatball Bubblegum', 'img/bubblegum.jpg'),
  new Product('Chair', 'img/chair.jpg'),
  new Product('Cthulhu Action Figure', 'img/cthulhu.jpg'),
  new Product('Dog Beak', 'img/dog-duck.jpg'),
  new Product('Dragon Meat', 'img/dragon.jpg'),
  new Product('Pen Utensil', 'img/pen.jpg'),
  new Product('Pet Sweep', 'img/pet-sweep.jpg'),
  new Product('Pizza Scissors', 'img/scissors.jpg'),
  new Product('Shark Pillow', 'img/shark.jpg'),
  new Product('Sweeper Onesie', 'img/sweep.png'),
  new Product('Tauntaun Sleeping Bag', 'img/tauntaun.jpg'),
  new Product('Unicorn Meat', 'img/unicorn.jpg'),
  new Product('Water Can', 'img/water-can.jpg'),
  new Product('Wine Glass', 'img/wine-glass.jpg')
];

const rounds = 25;
let votesCount = 0;
let currentProducts = [];
let remainingRounds = rounds;
let previousProducts = [];

// Function to calculate click percentage
function calculateClickPercentage(product) {
  if (product.timesShown === 0) {
    product.clickPercentage = 0;
  } else {
    product.clickPercentage = (product.timesClicked / product.timesShown) * 100;
  }
}

// Function to display three random products
function displayRandomProducts() {
  const container = document.getElementById('product-container');
  previousProducts = currentProducts;
  currentProducts = getRandomUniqueProducts(products, 3, previousProducts);

  container.innerHTML = '';
  currentProducts.forEach((product) => {
    product.timesShown++;
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
        <img src="${product.imagePath}" alt="${product.name}">
        <p class="product-name">${product.name}</p>
        <p class="click-percentage">${product.clickPercentage.toFixed(2)}%</p>
      `;
    container.appendChild(productDiv);
  });

  attachEventListeners();

  const storedRemainingRounds = localStorage.getItem('remainingRounds');
  if (storedRemainingRounds !== null) {
    remainingRounds = parseInt(storedRemainingRounds, 10);
  }

  const remainingRoundsElement = document.getElementById('remaining-rounds');
  remainingRoundsElement.textContent = `Remaining Votes: ${remainingRounds}`;
}

// Function to get random unique products
function getRandomUniqueProducts(productList, count, previousProducts) {
  const shuffledProducts = productList.filter(product => !previousProducts.includes(product));
  const selectedProducts = shuffledProducts.slice(0, count);

  // Save the current products for future checks
  previousProducts.push(...selectedProducts);

  // If we have displayed all products, reset the previousProducts array
  if (previousProducts.length === productList.length) {
    previousProducts = [];
  }

  return selectedProducts;
}

// Function to attach event listeners to product images
function attachEventListeners() {
  const productDivs = document.getElementsByClassName('product');
  for (let i = 0; i < productDivs.length; i++) {
    productDivs[i].addEventListener('click', handleProductClick);
  }
}

// Function to handle product clicks
function handleProductClick(event) {
  votesCount++;
  const clickedProduct = event.target.alt;
  const product = currentProducts.find((p) => p.name === clickedProduct);
  if (product) {
    product.timesClicked++;
  }

  currentProducts.forEach((product) => {
    calculateClickPercentage(product);
  });
  saveProductsFromLocalStorage();

  if (votesCount === rounds) {
    removeEventListeners();
    showAllResults();
  } else {
    displayRandomProducts();
  }
  remainingRounds--;
  localStorage.setItem('remainingRounds', remainingRounds);
}

// Function to remove event listeners from product images
function removeEventListeners() {
  const productDivs = document.getElementsByClassName('product');
  for (let i = 0; i < productDivs.length; i++) {
    productDivs[i].removeEventListener('click', handleProductClick);
  }
}

// Function to show the voting results
function showAllResults() {
  const resultsContainer = document.getElementById('results-container');
  const votesData = currentProducts.map((product) => ({
    label: product.name,
    data: [product.timesClicked],
    backgroundColor: getRandomColor(),
  }));

  const ctx = document.getElementById('results-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: currentProducts.map(product => product.name),
      datasets: votesData,
    },
    options: {
      legend: {
        display: true,
      },
    },
  });

  const viewResultsBtn = document.getElementById('view-results-btn');
  viewResultsBtn.disabled = false;
  viewResultsBtn.addEventListener('click', () => {
    resultsContainer.removeChild(document.getElementById('chart-container'));
    viewResultsBtn.disabled = true;
    displayRandomProducts();
  });
}

// Function to generate random colors for chart
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to save products to local storage
function saveProductsFromLocalStorage() {
  localStorage.setItem('products', JSON.stringify(products));
}

// When the page loads, retrieve stored products from local storage (if any)
if (localStorage.getItem('products')) {
  const storedProducts = JSON.parse(localStorage.getItem('products'));
  storedProducts.forEach((product) => {
    const newProduct = new Product(product.name, product.imagePath);
    newProduct.timesShown = product.timesShown;
    newProduct.timesClicked = product.timesClicked;
    newProduct.clickPercentage = product.clickPercentage;
    products.push(newProduct);
  });
}

// Start the voting session
displayRandomProducts();

