## Introduction

Since I was recently working a web scraper to test out my python skills and I needed to delve deeper in some optimization topics. I though I want apply the multithreading technic on a Nodejs environment, for those task that require a high CPU consumption such as I/O operations or loops.

#### Description
I set up an ExpressJs server and exposed two endpoints on my localhost, a fast endpoint and a slow one:
* **Fast**: returns a string saying I'm fast.
* **Slow**: returns an array of obj based on a sample obj, with n objs, where n is the number of iterations done by the loop in the main logic.

#### First case

Run first the slow endpoint and then the fast one. When the server is handled by a single thread it won't be able to respond to any other requestes till the first one is fulfilled.

Fast page example:
```
$ time curl -X GET http://localhost:3000/fast-page
This page is fast
real    0m0.108s
user    0m0.015s
sys     0m0.000s
```

Slow page example:
```
$ time curl -X GET http://localhost:3000/slow-page
This page is SLOW
real    0m20.359s
user    0m0.000s
sys     0m0.015s
```

#### Second case

The goal is to open another thread that manages the loop within the ```/slow-page``` endpoint. So the server will be able to take in charge other requestes. In contrast with the previous case, you'll now be able to hit ```/fast-page``` eventhough ```/fast-page``` hasn't responded yet.

##### Setup
 
First from *worker_threads* I've imported *parentPort*, which exposes a method called *postMessage*. **This method allows to pass data through the threads**.
I moved the slowLogic in a new file that I called ```worker.js``` and passed the result to ```parentPort.postMessage(data)```.