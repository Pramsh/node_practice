const express = require("express")
const { Worker } = require("worker_threads")
const app = express()
const PORT = 3000
const MAX_THREADS = 6

app.get("/fast-page", (req,res) => 
    res.status(200).send("This page is fast")
)

const createWorker = () => 
    new Promise((resolve, reject) => {

        const worker = new Worker("./six-workers.js", {
            workerData: { thread_count:MAX_THREADS }
        })
    
        worker.on("message", (data) => {           
            resolve(data.length)
        })
    
        worker.on("error", (err) => {        
            reject(err)
        })
    })

app.get("/slow-page", async(req,res) => {
    const workerPromises = []
    for(let i = 0; i < MAX_THREADS; i++){
        workerPromises.push(createWorker())
    }    
    const resArr = await Promise.all(workerPromises)    
    const totalLenghtSum = resArr.reduce((prev, current) => prev+=current,0)
    res.status(200).send("Result len is "+totalLenghtSum)
})

app.listen(PORT,() => {
    console.log("app is listening on port "+PORT);
})