const express = require("./configs/express");
const mongoose = require('./configs/mongoose')

const db = mongoose();
const app = express()



app.get("/", (req, res) => {
    const ipInfo = req.ipInfo;
    res.send(ipInfo);
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
