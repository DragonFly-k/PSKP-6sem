const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()

exports.add= (request, response, next)=>{
    const body = request.body;
    prisma.Userr.create({data:{ Name:body.Name, Email: body.Email}})
        .then(() => {response.redirect("/user")})
        .catch(err =>next(`Error adding`))
};

exports.get = async function(request, response, next){
    try{
        const user = await prisma.Userr.findMany()
        response.render("user.hbs",{user: user});
    }catch(err){
        next(`Error retrieving`)
    }
    
};

exports.getget = (request, response, next)=>{
    const { id } = request.params;

    prisma.Userr.findUnique({where: {ID: parseInt(id),},})
    .then((user) => {
        if (!user) {throw new Error('User not found');} 
        else {response.render("user.hbs",{us: user});}
    })
    .catch((error) => {next(`Error retrieving user: ${error.message}`);});
};


exports.del = async function(request, response, next){
    const body = request.body;
    await prisma.Userr.delete({where: {ID: parseInt(body.ID)}})
    .then((affectedRows) => {
        if(!affectedRows){throw new Error()} 
        else{response.redirect("/user")}})
    .catch(err =>{ 
        response.statusCode = 400;
        response.statusMessage = `User not found`
        response.end()})  
};

exports.upd= async function(request, response, next){
    const body = request.body;
    await prisma.Userr.update({data:{Email: body.Email}, where:{ID: parseInt(body.ID)}})
    .then((affectedRows) => {
        if(!affectedRows){throw new Error()}
        else{  response.redirect("/user")}})
    .catch(err =>{ 
        response.statusCode = 400;
        response.statusMessage = `User not found`
        response.end()})  
};