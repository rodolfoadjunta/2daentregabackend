import { Router } from "express";
import { ProductsMongo } from "../daos/managers/products.mongo.js";

const router = Router();
const productsService = new ProductsMongo();

router.get("/", async(req,res)=>{
    try {
        const {limit=10,page=1,sort,category,stock} = req.query;
        if(!["asc","desc"].includes(sort)){
            res.json({status:"error", message:"el ordenamiento no es valido, solo puede ser ascencente o descendente"})
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

        const result = await productsService.getPaginate(query, {
            page,
            limit,
            sort:{price:sortValue},
            lean:true
        });
        
        
        const response = {
            status:"success",
            payload:result.docs,
            totalPages:result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page:result.page,
            hasPrevPage:result.hasPrevPage,
            hasNextPage:result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null,
        }
        console.log("response: ", response);
        res.json(response);

    } catch (error) {
        res.json({status:"error", message:error.message});
    }
});

router.post("/",async(req,res)=>{
    try {
        const productCreated = await productsService.create(req.body);
        res.json({status:"success", data:productCreated});
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
})
export {router as productsRouter};