# products_mk

## Description
This is a backend built out for the products service inside of the e-commerce application [Hyper Fashion](https://github.com/maxwellrk/hyper_fashion). It uses Node.js to connect to an exisiting [MariaDB](https://github.com/maxwellrk/products_db_mk) database. The backend was deployed onto an AWS/EC2 instance with a load balancer to handle heavy loads. The high traffic end points are able to handle requests of 4000+ per second with 0% error rate. These were tested through Artillery.io locally and Loader.io when deployed. Unit testing was done through Jest and Supertest.

### Installing

```
git clone https://github.com/maxwellrk/products_mk.git
npm install
docker-compose up
```

## Built With

* [Node.js](https://nodejs.org/en/) - Runtime Environment
* [Express](https://expressjs.com/) - Backend Framework
* [Loader.io](https://loader.io/) - Cloud-Based Stress Testing
* [Artillery.io](https://artillery.io/) - Local Stress Testing
* [Jest](https://jestjs.io/) - Unit Testing Framework
