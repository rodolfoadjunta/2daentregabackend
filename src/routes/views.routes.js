import { Router } from "express";
import { ProductsMongo } from "../daos/managers/products.mongo.js";
import { CartsMongo } from "../daos/managers/carts.mongo.js";

const productsService = new ProductsMongo();
const cartsService = new CartsMongo();

const router = Router();

router.get("/", (req,res)=>{
res.render("home");
})

router.get("/products",async(req,res)=>{
    try {
        const {limit=3,page=1,sort="asc",category,stock} = req.query;
        if(!["asc","desc"].includes(sort)){
            return res.json({status:"error", message:"ordenamiento no valido, solo puede ser asc o desc"})
        };
        const sortValue = sort === "asc" ? 1 : -1;
        const stockValue = stock === 0 ? undefined : parseInt(stock);

        let query = {};
        if(category && stockValue){
            query = {category: category, stock:stockValue}
        } else {
            if(category || stockValue){
                if(category){
                    query={category:category}
                } else {
                    query={stock:stockValue}
                }
            }
        }
      
        
        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        console.log("baseUrl", baseUrl);
      
        
        const result = await productsService.getPaginate(query, {
            page,
            limit,
            sort:{price:sortValue},
            lean:true
        });
      console.log("result:", result);
        
        const response = {
            status:"success",
            payload:result.docs,
            totalPages:result.totalPages,
            totalDocs:result.totalDocs,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page:result.page,
            hasPrevPage:result.hasPrevPage,
            hasNextPage:result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl.replace( `page=${result.page}` , `page=${result.prevPage}` )}` : null,
            nextLink: result.hasNextPage ? `${baseUrl.replace( `page=${result.page}` , `page=${result.nextPage}` )}` : null,
        }
        console.log("response: ", response);
        res.render("products",response);
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
    res.render("products");
});

router.get("/carts/:id", async (req, res) => {
    try {
      const cartId = req.params.id;
      const cart = await cartsService.getById(cartId);
      res.json({ status: "success", data: cart });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });
  
export{ router as viewsRouter};