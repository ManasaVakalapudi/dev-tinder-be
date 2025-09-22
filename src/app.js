const express = require('express');
const app = express();

app.use('/hello', (req,res)=> {
    res.send('Hello World hello');
})
app.listen(7000, ()=>{
    console.log('Server is running on port 7000');
})