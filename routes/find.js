const express = require('express')
const router = express.Router()

router.get('/:lat/:lon/:num', (req,res) => {
    console.log(req.params)
    return res.render('index.html', {title : 'hi'})
});


module.exports = router;