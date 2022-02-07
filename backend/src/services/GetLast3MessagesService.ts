import prismaClient from "../prisma";

class GetLast3MessagesService {
    async execute() {
        try {
            const messages = await prismaClient.message.findMany({
                take: 3,
                orderBy: {
                    created_at: "desc"
                },
                include: {
                    user: true
                }
            })
            return messages;
        } catch (error) {
            return null;
        }
        
    }
}

export { GetLast3MessagesService }