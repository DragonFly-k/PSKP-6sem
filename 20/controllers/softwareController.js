const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()

exports.add= (request, response, next)=>{
    const body = request.body;
    prisma.Software.create({data:{ Name:body.Name, Version: body.Version, Manufacturer: body.Manufacturer}})
        .then(() => {response.redirect("/software")})
        .catch(err =>next(`Error adding`))
};

exports.get = async function(request, response, next){
    try{
        const software = await prisma.Software.findMany()
        response.render("software.hbs",{software: software});
    }catch(err){
        next(`Error retrieving`)
    }
};

exports.getget = async (request, response, next)=>{
    const { id } = request.params;
    await prisma.Software.findUnique({where: {ID: parseInt(id),},})
    .then((software) => {
        if (!software) {throw new Error('software not found');} 
        else {response.render("software.hbs",{us: software});}
    })
    .catch((error) => {next(`Error retrieving software: ${error.message}`);});
};


exports.del = async function(request, response, next){
    const body = request.body;
    await prisma.Software.delete({where: {ID: parseInt(body.ID)}})
    .then((affectedRows) => { 
        if (!affectedRows) {throw new Error()}
        response.redirect("/software")})
    .catch(err =>{ 
        response.statusCode = 400;
        response.statusMessage = `Soft not found`
        response.end()})  
};

exports.upd= async function(request, response, next){
    const body = request.body;
    await prisma.Software.update({data:{Version: body.Version}, where:{ID: parseInt(body.ID)}})
    .then((affectedRows) => {
        if (!affectedRows) {throw new Error()}
        response.redirect("/software")})
    .catch(err =>{ 
        response.statusCode = 400;
        response.statusMessage = `Soft not found`
        response.end()})    
};