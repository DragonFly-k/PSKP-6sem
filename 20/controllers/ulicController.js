const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()

exports.add= (request, response, next)=>{
    const body = request.body;
    prisma.UserLicenses.create({data:{ UserID: parseInt(body.UserID), LicenseID : parseInt(body.LicenseID) , LicenseKey: body.LicenseKey, 
        StartDate: new Date(body.StartDate),  EndDate : new Date(body.EndDate) }})
        .then(() => {response.redirect("/ulic")})
        .catch(err =>next(`Error adding`))
};

exports.get = async function(request, response, next){
    try{
        const user = await prisma.UserLicenses.findMany()
        response.render("ulic.hbs",{ulic: user});
    }catch(err){
        next(`Error retrieving`)
    }
    
};

exports.getget = (request, response, next)=>{
    const { id } = request.params;
    prisma.UserLicenses.findUnique({where: {ID: parseInt(id),},})
    .then((user) => {
        if (!user) {throw new Error('UserLicense not found');} 
        else {response.render("ulic.hbs",{us: user});}
    })
    .catch((error) => {next(`Error retrieving user: ${error.message}`);});
};


exports.del = async function(request, response, next){
    const body = request.body;
    await prisma.UserLicenses.delete({where: {ID: parseInt(body.ID)}})
    .then((affectedRows) => {
        if (!affectedRows) {throw new Error()}
        response.redirect("/ulic")})
    .catch(err =>{ 
        response.statusCode = 400;
        response.statusMessage = `User license not found`
        response.end()})  
};

exports.upd= async function(request, response, next){
    const body = request.body;
    await prisma.UserLicenses.update({data:{EndDate: new Date(body.EndDate)}, where:{ID: parseInt(body.ID)}})
    .then((affectedRows) => { 
        if (!affectedRows) {throw new Error()}
        response.redirect("/ulic")})
    .catch(err =>{ 
        response.statusCode = 400;
        response.statusMessage = `User license not found`
        response.end()})  
};