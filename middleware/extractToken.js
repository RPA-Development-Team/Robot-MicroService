// const prisma = require('rpa-prisma-module')

// exports.extractToken = async(req, res, next) => {
//     const uuid = req.decodedUser.uuid
//     try {
//         const result = await prisma.userAccount.findUnique({
//             where: {
//                 uuid: uuid
//             }
//         });
//         req.userID = result.id;
//     } catch (err) {
//         console.log(err);
//         return null;
//     }
//     next()
// }
