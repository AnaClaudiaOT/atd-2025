class Product {
  constructor(id, name, description, price, stock) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.createdAt = new Date();
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      createdAt: this.createdAt
    };
  }
}

// In-memory storage for products
const products = [];

// Initialize with 3 default products
const initializeProducts = () => {
  if (products.length === 0) {
    products.push(new Product(1, 'Laptop', 'High-performance laptop for work and gaming', 999.99, 1000));
    products.push(new Product(2, 'Smartphone', 'Latest model smartphone with advanced features', 699.99, 30));
    products.push(new Product(3, 'Headphones', 'Wireless noise-canceling headphones', 199.99, 100));
  }
};

// Initialize products when module is loaded
initializeProducts();

module.exports = {
  Product,
  products,
  findAll: () => products.map(p => p.toJSON()),
  create: (data) => {
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    const product = new Product(id, data.name, data.description, data.price, data.stock);
    products.push(product);
    return product.toJSON();
  }
};
