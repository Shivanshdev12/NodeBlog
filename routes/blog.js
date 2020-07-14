const express = require('express');
const {
    ensureAuth
} = require('../middleware/auth');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

//route /blogs/add  GET add block
router.get('/add', ensureAuth, (req, res) => {
    res.render('blogs/add')
});


//route  /blogs  POST  on clicking save '/' that is '/blogs'
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Blog.create(req.body)
        res.redirect('/')
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
})

router.get('/', ensureAuth, async (req, res) => {
    try {
        const blogs = await Blog.find({
                status: 'public'
            })
            .populate('user')
            .lean()

        res.render('blogs/index', {
            blogs
        });
    } catch (err) {
        console.error(err);
        res.render('error/404');
    }
});

router.get('/:id', ensureAuth, async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('user').lean()
        if (!blog) {
            res.render('error/404');
            next();
        }
        return res.render('blogs/show', {
            blog
        });
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
});

//route GET all blogs of a user
router.get('/user/:userId', ensureAuth, async (req, res, next) => {
    try {
        const blogs = await Blog.find({
                user: req.params.userId,
                status: 'public',
            })
            .populate('user')
            .lean()
        return res.render('blogs/index', {
            blogs
        })
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
});


//route PUT edit a blog
router.get('/edit/:id',ensureAuth,async (req,res,next)=>{
    try{
        let blog = await Blog.findOne({
            _id:req.params.id,
        }).lean()
        if(!blog)
        {
            return res.render('error/404')
        }
        if(blog.user!=req.user.id){
            res.redirect('/blogs')
        }
        else{
            res.render('blogs/edit',{
                blog
            })
        }
    }
    catch(err)
    {
        console.error(err);
        return res.render('error/500');
    }
});

router.put('/:id',ensureAuth,async (req,res)=>{
    try{
        let blog = await Blog.findById(req.params.id).lean()
        if(!blog)
        {
            return res.render('error/404')   
        }
        if(blog.user!=req.user.id){
            res.redirect('/blogs')
        }
        else{
            Blog = await Blog.findByIdAndUpdate({_id:req.params.id},req.body,{
                new:true,
                runValidators:true   
            })
            res.redirect('/dashboard')
        }
    }
    catch(err){
        console.error(err)
        return res.redirect('error/500')
    }
});

//route DELETE delete a Blog
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
      let blog = await Blog.findById(req.params.id).lean()
  
      if (!blog) {
        return res.render('error/404')
      }
  
      if (blog.user != req.user.id) {
        res.redirect('/blogs')
      } else {
        await Blog.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })


module.exports = router;