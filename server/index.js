const express = require('express')
const app = express()
const {eventi} = require('./eventi')

//primo endpoint: metodo GET
app.get('/api/eventi', (req, res)=>{
    res.status(200).json({data: eventi});
})

//secondo endpoint: metodo GET
app.get('/api/eventi/:id', (req, res)=>{ 
    const {id} = req.params
    
    const evento = eventi.find(
        (evento) => evento.id === id
        )
        res.json(evento)
})

/*mettiamo in ascolto il server*/
app.listen(3000)
