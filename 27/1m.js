const crypto =require('crypto');

module.exports.cipherFile = (rs,ws,key,cb)=>
{
    const alg ='aes-256-cbc';
    const piv = Buffer.alloc(16,0);
    const pk = key? key:crypto.randomBytes(32);
    const ch = crypto.createCipheriv(alg,pk,piv);// Создаем шифр с заданным алгоритмом, ключом и буф
    const rc = {cmd:'cipher',iv:piv,algorithm:alg,inbytes:0,outbytes:0,key:pk};//отслеживания информации о шифровании.
    const pb = cb?cb:((err,rc)=>{if(err) console.log();});
    rs.pipe(ch).pipe(ws);// входной поток rs в шифри шифр в выходной поток 
    ws.on('close',()=>{rc.inbytes= rs.bytesRead; rc.outbytes=ws.bytesWritten; pb(null,rc);});
}

module.exports.decipherFile = (rs,ws,key,iv,cb)=>
{
    const alg ='aes-256-cbc';
    const piv =iv?iv:Buffer.alloc(16,0);
    const dch = crypto.createDecipheriv(alg,key,piv);
    const rc = {cmd:'decipher',iv:piv,algorithm:alg,inbytes:0,outbytes:0,key:key};
    const pcb = cb?cb:((err,rc)=>{if(err) console.log();});
    rs.pipe(dch).pipe(ws);
    ws.on('close',()=>{rc.inbytes = rs.bytesRead; rc.outbytes=ws.bytesWritten; pcb(null,rc);});
    dch.on('error',(err)=>{console.log('error = ',err)});
}