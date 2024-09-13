## Introduction

Today I was delving deeper into the cluster module, which allows our nodejs horizontal scaling within the same server, by leveraging the cores available to open different processes. The max number of **workers** you're app is able to handle depends on the total amount of core your processor is provided with. This processes share the same port, but follow a completly separate path from each other. They might share memory with the main process, but ain't absolutly able to share memory with each other.\The algorithm that works under the hood of this module is the round-robin, which basically sends one request per active process at time. Even if it's a simple algorithm it's one of the two most efficients in case there aren't any know parameter regarding the services exposed by the application.

#### Description
I set up an ExpressJs server and exposed an endpoint on my localhost that works on a CPU intensive task. The I installed [*artillery*](https://docs.art) a tool that I used to create a **stress testing scenario** through a ```cluster-load-test.yml```.


#### Performance

I leave here the results of the test and invite you to try by your own. The **yml** it's easy to understand if you give a look to this guides:
* [Installation](https://www.artillery.io/docs/get-started/get-artillery)
* [File setup](https://www.artillery.io/docs/get-started/first-test)

Take a look to the [yml](./cluster-load-test.yml) for the testing details.

##### Testing scenario without cluster

Checks:
fail: http.response_time.p95 < 75
fail: http.response_time.p99 < 100

Apdex score: 0.098860103626943 (unacceptable)

##### Same scenario laveraging my local 6 Hyper-Threading Core (become 12)

Checks:
ok: http.response_time.p95 < 75
ok: http.response_time.p99 < 100

Apdex score: 0.9977128953771289 (excellent)


#### Conclusion

Let's try to implement clustering with [pm2]()