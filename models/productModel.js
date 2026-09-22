const products = require('../data/products');

let nextId = products.length
  ? Math.max(...products.map(p => p.id)) + 1
  : 1;

exports.findAll = () => products;

exports.findById = (id) => {
  return products.find(p => p.id === Number(id));
};

exports.create = (data) => {
  const product = { id: nextId++, ...data };
  products.push(product);
  return product;
};

exports.update = (id, data) => {
  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...data,
    id: Number(id)
  };

  return products[index];
};

exports.remove = (id) => {
  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) return null;

  const [deleted] = products.splice(index, 1);
  return deleted;
};