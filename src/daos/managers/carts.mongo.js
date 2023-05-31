import fs from 'fs';
import path from 'path';

const dataFolderPath = path.resolve('src/data');
const cartsFilePath = path.join(dataFolderPath, 'carts.json');

export class CartsMongo {
  async getAll() {
    try {
      const cartsData = await fs.promises.readFile(cartsFilePath, 'utf8');
      const carts = JSON.parse(cartsData);
      return carts;
    } catch (error) {
      throw new Error(`Error al obtener todos los carritos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((cart) => cart.id === id);
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
    }
  }

  async create(cart) {
    try {
      const carts = await this.getAll();
      const newCart = { id: Date.now().toString(), ...cart };
      carts.push(newCart);
      await this.saveAll(carts);
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  async update(cartId, updatedData) {
    try {
      const carts = await this.getAll();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) {
        throw new Error(`No se encuentra el carrito con ID ${cartId}`);
      }
      const updatedCart = { ...carts[cartIndex], ...updatedData };
      carts[cartIndex] = updatedCart;
      await this.saveAll(carts);
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  async delete(cartId) {
    try {
      const carts = await this.getAll();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) {
        throw new Error(`No se encuentra el carrito con ID ${cartId}`);
      }
      carts.splice(cartIndex, 1);
      await this.saveAll(carts);
    } catch (error) {
      throw new Error(`Error al eliminar el carrito: ${error.message}`);
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((cart) => cart.id === cartId);
      if (!cart) {
        throw new Error(`No se encuentra el carrito con ID ${cartId}`);
      }
      const productIndex = cart.products.findIndex((product) => product.productId === productId);
      if (productIndex === -1) {
        throw new Error(`No se encuentra el producto con ID ${productId} en el carrito`);
      }
      cart.products.splice(productIndex, 1);
      await this.saveAll(carts);
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
  }

  async saveAll(carts) {
    try {
      const cartsData = JSON.stringify(carts, null, 2);
      await fs.promises.writeFile(cartsFilePath, cartsData);
    } catch (error) {
      throw new Error(`Error al guardar los carritos: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((cart) => cart.id === cartId);
      if (!cart) {
        throw new Error(`No se encuentra el carrito con ID ${cartId}`);
      }
      const product = cart.products.find((product) => product.productId === productId);
      if (!product) {
        throw new Error(`No se encuentra el producto con ID ${productId} en el carrito`);
      }
      product.quantity += quantity; // Sumar la cantidad al producto existente
      await this.saveAll(carts);
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
    }
  }
  
}
