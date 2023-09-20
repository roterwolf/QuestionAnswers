const sendJwtToClient = (user,res) => {
 
    const{JWT_COOKIE,NODE_ENV} = process.env;

    const token = user.generateJwtFromUser();
    return res.status(200)
    .cookie("access_token",token,{
        httpOnly : true,
        expires: new Date((Date.now() + parseInt(JWT_COOKIE) * 1000 * 60 * 60)),        
        secure : NODE_ENV === "development" ? false : true

        /*doğru tarihi alabilmek için
                    const nDate = new Date().toLocaleString('tr-TR', {
                        timeZone: 'Europe/Istanbul'
                    });

                const nDate2 = new Date(Date.parse(nDate+' GMT-0:00'));
        */
    })
    .json({
        success : true,
        access_token : token,
        data: {
            name : user.name,
            email : user.email,
            password : user.password
        }
    })
}
const isTokenIncluded = (req) =>{
    return (req.headers.authorization && req.headers.authorization.startsWith("Bearer:")  );
}
const getAccessTokenFromHeader = (req) =>{
    const authorization = req.headers.authorization;
    const access_token = authorization.split(" ")[1];
    return access_token;
}

module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader
};  