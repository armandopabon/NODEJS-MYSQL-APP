const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } =require('../lib/auth');

router.get('/add', isLoggedIn ,(req, res) =>{
    res.render('links/add');
})

router.post('/add', async (req, res) =>{
    const {title, url, description} = req.body;
    const newLink ={
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links SET ?', [newLink])
    //creando mensajes 
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
})

router.get('/', isLoggedIn , async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', {links});
 
    
})

router.get('/delete/:id', isLoggedIn , async (req, res) =>{
    const id   = req.params.id;
    console.log(id);
    await pool.query('DELETE FROM links WHERE ID = ?', [id])
    req.flash('success', 'Link removed succesfully')
        res.redirect('/links');    
})

router.get('/edit/:id', isLoggedIn , async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
    console.log(links);
    //Al realizar el Queryse pueden recibir varias filas es por eso que se envia solo la primera 
    res.render('./links/edit', {link: links[0]});
})

router.post('/edit/:id', async (req, res) => {
    const {id} = req.params;
    const {title, url, description} = req.body;
    const editLink ={
        title,
        url,
        description
    };
    await pool.query('UPDATE links set ? where id = ?', [editLink,id]);
    req.flash('success', 'Link edited succesfully')
    res.redirect('/links');
})
module.exports = router;