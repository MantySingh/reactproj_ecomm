const router = require('express').Router()
const passport = require('passport')

router.get(
    "/google/callback",
    passport.authenticate('google',{
        successRedirect:process.env.CLIENT_URL,
        failureRedirect:'/login/failed',
    })
)

router.get('/google', passport.authenticate('google',['profile', 'email']))

router.get('/login/success', (req,resp) =>{
    if(req.user){
        resp.status(200).json({
            error: false,
            message: 'Successfully Loged in',
            user: req.user,
        })
    } else {
        resp.status(403).json({error: true, message: 'Not Authorized'})
    }
})

router.get('/login/failed', (req,resp) =>{
    resp.status(401).json({
        error:true,
        message: 'Login failure',
    })
})

router.get('/logout', (req, resp) =>{
    req.logout()
    resp.redirect(process.env.CLIENT_URL)
})

module.exports = router