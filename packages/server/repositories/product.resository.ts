import { PrismaClient, type Product } from "../generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

      
const adapter = new PrismaMariaDb({
    host: "localhost",
    user: "root",
    password: "Dhiyaan@123",
    database: "review_summarizer",
    port: 3306,
    connectionLimit: 5,
  });

  
  const prisma = new PrismaClient({ adapter });
export const productRepository = {

    getProduct: async (productId:number) => {
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })

       return product || null

    }
}