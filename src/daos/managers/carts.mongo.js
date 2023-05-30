import { cartsModel } from "../models/cart.model.js";

export class CartsMongo{
    constructor(){
        this.model = cartsModel;
    };
    async create(cart) {
        try {
          const result = await this.model.create(cart);
          return result;
        } catch (error) {
          throw new Error(`Error al crear el carito: ${error.message}`);
        }
      }
      
    async getAll() {
        try {
          const carts = await this.model.find().exec();
          return carts;
        } catch (error) {
          throw new Error(`Error al traer todos los caritos: ${error.message}`);
        }
      }

      async getById(id) {
        try {
          const cart = await this.model.findById(id);
          return cart;
        } catch (error) {
          throw new Error(`Error al traer carros por ID ${error.message}`);
        }
      }
    
      async update(cartId, updatedData) {
        try {
          const cart = await this.getById(cartId);
          if (!cart) {
            throw new Error(`No se encuentra el carrito ${cartId}`);
          }
          Object.assign(cart, updatedData);
          const updatedCart = await cart.save();
          return updatedCart;
        } catch (error) {
          throw new Error(`Error al cargar el carrito: ${error.message}`);
        }
      }

      async delete(cartId) {
        try {
          await this.model.findByIdAndDelete(cartId);
        } catch (error) {
          throw new Error(`Error al borrar el carrito: ${error.message}`);
        }
      }

      async deleteAllProducts(cartId) {
        try {
          await this.model.findByIdAndUpdate(cartId, { products: [] });
        } catch (error) {
          throw new Error(`Error al borrar productos del carrito: ${error.message}`);
        }
      }

      async deleteProduct(cartId, productId) {
        try {
          const result = await this.model.findByIdAndUpdate(
            cartId,
            { $pull: { products: { productId } } },
            { new: true }
          );
          return result;
        } catch (error) {
          throw new Error(`Error borrando productos del carrito: ${error.message}`);
        }
      }

      
      async update(cartId, products) {
        try {
          const updatedCart = await this.model.findByIdAndUpdate(
            cartId,
            { products },
            { new: true }
          );
          return updatedCart;
        } catch (error) {
          throw new Error(`Error cargando el carrito: ${error.message}`);
        }
      }

      async updateProductQuantity(cartId, productId, quantity) {
        try {
          const updatedCart = await this.model.findOneAndUpdate(
            { _id: cartId, "products.productId": productId },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
          );
      
          if (!updatedCart) {
            throw new Error("Carrito o producto no se encuentra");
          }
      
          return updatedCart;
        } catch (error) {
          throw new Error(`Error cargando cantidad de producto: ${error.message}`);
        }
      }
      
}
