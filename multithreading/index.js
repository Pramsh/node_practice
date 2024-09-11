const express = require("express")
const { Worker } = require("worker_threads")
const app = express()
const PORT = 3000

app.get("/fast-page", (req,res) => {
    console.log("fast");
    res.status(200).send("This page is fast")
})

// const slowLogic = () => {
//     let data = []
//     const sample = {
//             a:"complexdata",
//             b:"complexdata",
//             c:"complexdata",
//             d:"complexdata"
//         }
//     for (let i = 0; i < 13_000_000; i++){
//         data.push({...sample, n:i})
//     }
// }

app.get("/slow-page", (req,res) => {
    // slowLogic()
    const worker = new Worker("./worker.js")

    worker.on("message", (data) => {
        console.log("slow");
        
        res.status(200).send("result len is "+data.length)
    })

    worker.on("error", (err) => {
        res.status(404).send(err)
    })

//    res.status(200).send("This page is SLOW")
})

app.listen(PORT,() => {
    console.log("app is listening on port "+PORT);
})