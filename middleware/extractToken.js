const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const extractToken = async (req, res, next) => {
    const uuid = req.decodedUser.uuid
    try {
        const result = await prisma.userAccount.findUnique({
            where: {
                uuid: uuid
            }
        });
        req.userID = result.id;
        next()
    } catch (err) {
        console.log(err);
        req.userId = null;
        next()
    }
}

module.exports = extractToken