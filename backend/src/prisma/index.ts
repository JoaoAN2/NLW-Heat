import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();
console.log("Banco de Dados no ar 😜");

export default prismaClient;