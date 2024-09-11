const { parentPort } = require("worker_threads")

let data = []
const sample = {
        a:"complexdata",
        b:"complexdata",
        c:"complexdata",
        d:"complexdata"
    }

for (let i = 0; i < 10_000_000; i++){
    data.push({...sample, n:i})
}

parentPort.postMessage(data)
