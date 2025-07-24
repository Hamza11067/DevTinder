const express = require('express');
const app = express();

app.use("/", (req, res)=> {
    res.send("Hello, world! from DevTinder! This is the main page.");
});

app.use("/test",(req,res) => {
    res.send("Hello, world! from DevTinder test!");
})

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});