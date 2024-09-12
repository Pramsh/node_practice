## Introduction

Since I was recently working a web scraper to test out my python skills and I needed to delve deeper in some optimization topics. I though I want apply the multithreading technic on a Nodejs environment, for those task that require an intense CPU workload.

#### Description
I set up an ExpressJs server and exposed two endpoints on my localhost, a fast endpoint and a slow one:
* **Fast**: returns a string saying I'm fast.
* **Slow**: returns an array of obj based on a sample obj, with n objs, where n is the number of iterations done by the loop in the main logic.

#### Step
Each step has its own branch with it's own files
You'll find the branch to visit on the top of the description on the cases below.
After each step you may come back here if you don't remember the other branch name.


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


#### Third case

What we want to achieve now is to spend part of the computation power of our pc to create N threads.

In linux you can see how many processes might be open concurrently typing ```nproc```. In my case the returned value is 12.

I want half of them resolve our SlowLogic.

##### Setup
I create a file called ```six-workers.js```. Into this file I placed our know SlowLogic. This time I also import *workerData* from **worker_threads module**, this will allow us to pass a parameter from the parent thread to the children. In the index we moved the logic of the **Worker** inside a **Promise** *createWorker* returned by a function, passing to the variable declared through the *workerData* earlier, the value of the **MAX_THREADS** to run concurrently.
Lastly I pushed as many time as the **MAX_THREADS**, the promise *createWorker*.
I decided to create another index (**six-workers-index.js**) for this step, in order to allow to run both web servers and see the performance differences. Here the results on my pc.


* index.js:
```
$ time curl http://localhost:3000/slow-page
Result len is NaN
real    0m34.392s
user    0m0.015s
sys     0m0.015s
```
* six-workers-index.js:
```
$ time curl http://localhost:3000/slow-page
real    0m14.155s
user    0m0.000s
sys     0m0.000s
```

linux command: ```time curl http://localhost:3000/slow-page```


###### Reference
I'm following these [tutorials](https://www.youtube.com/playlist?list=PL5Lsd0YA4OMGN86vWiW7O52izu-cTxcS3) to improve my Nodejs skills.