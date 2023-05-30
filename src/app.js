import express from "express";
import {engine} from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { connectDB } from "./config/dbConnection.js";
import { productsRouter } from "./routes/products.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";

const port = 8080;
const app =express();


//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")))
connectDB();

app.listen(port,()=>console.log(`Server listening on port ${port}`));

//configuracion de handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

app.use(viewsRouter);
app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);

// Ruta para renderizar la vista de carritos
app.get("/carts", (req, res) => {
  res.render("carts");
});
