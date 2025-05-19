const express = require('express');
const cors = require('cors');
const app=express()
const port=process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Hobby hub server is running')
})

app.listen(port,()=>{
    console.log(`Hobby hub is runnig on port ${port}`)
})

