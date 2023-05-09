const { PrismaClient } = require( '@prisma/client');
const prisma = new PrismaClient();

const checkUser = async (login, password) => {
    return  await prisma.Userr.findFirst({where : {username: login,password: password}});
};

const getUser = async (login) => {
    return await prisma.Userr.findFirst({where : {username: login}})
};

const createUser = async (login, password) => {
    await prisma.Userr.create({data:{username:login,password:password}})
};

const CheckById = async (id)=>{
    return await prisma.Userr.findFirst({where:{ id: id}})
}

module.exports={checkUser,getUser,createUser,CheckById}