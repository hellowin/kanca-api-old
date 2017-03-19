import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from 'config';
import router from 'app/router';
import _ from 'lodash';
import fbAuth from 'infra/middleware/fb-auth';
import response from 'infra/middleware/response';
import bootstrap from 'app/bootstrap';

// create webserver aka express app
const webserver = express();

// set middleware
webserver.use(cookieParser());
webserver.use(bodyParser());
webserver.use(cors());
webserver.use(response());
webserver.use(fbAuth());

// greetings
webserver.get('/', (req, res) => res.send('hai'));

// inject routers
_.each(router, route => webserver[route.method](route.endpoint, route.controller));

// bootstraping
bootstrap()
  .then(() => {
    // listening port
    const port = config.port;
    webserver.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch(console.error);


export default webserver;
