const router = require ('express').Router()
const {User} = require('./model/sampleUser')


//login
router.put('/login', async (req, res, next) => {
  try {
    await User.findOne({
     where: {
     email: req.body.email
     }
   })
   .then(user => {
     if (!user) res.status(401).send('User not found')
     else if (!user.hasMatchingPassword(req.body.password)){
      res.status(401).send('Incorrect password');
     }
     else {
       req.login(user, err => {
         if (err) next(err);
         else res.json(user);
       });
     }
   })
  } catch (error) {
    next(error)
 }
 }
);

//sign up
//  router.post('/signup', async(req,res,next)=>{
//    try {
//        const user = await User.findOne({
//        where:{
//          email: req.body.email
//        }
//      })
//      if(!user){
//       await User.create(req.body)

//      }else{

//      }
//    } catch (error) {
//      next(error)
//    }
//  })

 router.post('/signup', async (req, res, next) => {
  await User.create(req.body)
    .then(user => {
      req.login(user, err => {
        if (err) next(err);
        else res.json(user);
      });
    })
    .catch(next);
});

//logout
 router.delete('/logout', (req,res,next)=>{
   delete req.session.userId
   res.sendStatus(204)
 })

//get me??
router.get('/me',(req,res,next)=>{
  res.json(req.user)
})


module.export = router
