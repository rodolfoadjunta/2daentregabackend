import { Router } from "express";
import { CartsMongo } from "../daos/managers/carts.mongo.js";

const router = Router();
const cartsService = new CartsMongo();

// Crear un carrito
router.post('/', async (req, res) => {
  try {
    if (!Array.isArray(req.body.products)) {
      throw new Error('El campo "products" debe ser un arreglo de objetos.');
    }

    const isValidProducts = req.body.products.every(
      (product) => product.productId !== undefined && product.quantity !== undefined
    );
    if (!isValidProducts) {
      throw new Error('Cada objeto en "products" debe tener los campos "productId" y "quantity".');
    }

    const cartCreated = await cartsService.create(req.body);
    res.json({ status: "success", data: cartCreated });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Traer todos los carritos
router.get("/", async (req, res) => {
  try {
    const allCarts = await cartsService.getAll();
    res.json({ status: "success", data: allCarts });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Eliminar todos los productos del carrito
router.delete("/:cid/products", async (req, res) => {
  try {
    const cartId = req.params.cid;
    await cartsService.deleteAllProducts(cartId);
    res.json({ status: "success", message: "Se han eliminado todos los productos del carrito" });
  } catch (error) {
    res.json({ status: "error", message: "Hubo un error al eliminar los productos del carrito." });
  }
});


// Eliminar un producto seleccionado del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartsService.deleteProduct(cid, pid);
    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

// Actualizar el carrito
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const updatedCart = await cartsService.update(cid, products);
    res.json({ status: "success", data: updatedCart });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Actualizar solo la cantidad
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    const updatedCart = await cartsService.updateProductQuantity(
      cartId,
      productId,
      quantity
    );

    res.json({ status: "success", data: updatedCart });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});


export { router as cartsRouter };

