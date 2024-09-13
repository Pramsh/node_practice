import cluster from "cluster"
import express from "express"
import { cpus } from 'os'
const PORT = 3000
const allProcesses = {}
if(cluster.isPrimary){
    console.log("master process going on pin: "+process.pid);
    const cpuCount = cpus().length
    for (let i = 0; i < cpuCount; i++){
        const worker = cluster.fork()

        worker.on("message", (message) => {
            if(message.type === "updateProcess") {
                const { pid } = message
                if(!(pid in allProcesses)){
                    allProcesses[pid] = 0
                }else{
                    allProcesses[pid] += 1 
                }
            }
        })
    }
}else{
    const app = express()
    app.get("/", (req,res) => {          
        let a = 0
        for(let i = 0; i < 5_000_000; i++){
            a += i
        }     
        
        process.send({
            type: 'updateProcess',
            pid: process.pid
        });

        res.status(200).send("totale is "+a)
    } )

    app.listen(PORT, () => {
        console.table({PORT, pid:process.pid});
        
    })
}
