import * as express from 'express'
import {createProxyMiddleware} from 'http-proxy-middleware'
import helmet from 'helmet'
//@ts-ignore
import {getPaths} from './RouterInfo'

const cors = require('cors');
const Keycloak = require('@cttic/keycloak-connect');
const session = require('express-session');
const rootCas = require('ssl-root-cas').create();
const path = require('path');

//在JenkinsFile中，根据环境把是本地根证书或生产环境的中间证书copy到目录下
rootCas.addFile(path.resolve(__dirname, 'cert.pem'));
require('https').globalAgent.options.ca = rootCas;

const app = express.default();

app.use(helmet());

const trusted = ['\'self\''];

if (process.env.KEYCLOAK_URL && process.env.CLIENT_SECRET) {
	trusted.push(process.env.KEYCLOAK_URL.replace(/^https:\/\//, '').replace(/^http:\/\//, ''))
}else{
  process.exit(1)
}

if (process.env.GIS_MAP_URL) {
	trusted.push(process.env.GIS_MAP_URL.replace(/^https:\/\//, '').replace(/^http:\/\//, ''))
}

let websockets=[]


if (process.env.WS_URL) {
  let the_ws_base_url = process.env.IS_HTTPS? `wss://${process.env.WS_URL}`:`ws://${process.env.WS_URL}`
	websockets.push(`${the_ws_base_url}/fence`)
  websockets.push(`${the_ws_base_url}/alert`)
}


// //@ts-ignore
// if (process.env.BASE_URL) {
//   trusted.push(process.env.BASE_URL.replace(/^https:\/\//, '').replace(/^http:\/\//, ''))
// } else {
//   //@ts-ignore
//   process.exit(1)
// }

let imgSrc = ['data:', 'blob:', '*.tianditu.gov.cn'];

// if (process.env.FILE_SERVICE) {
//   let temp = process.env.FILE_SERVICE;
//   let reg = /^http(s)?:\/\/(.*?)\//;
//   // @ts-ignore
//   let nmxfFileHost = reg.exec(temp)[2];
//   trusted.push(nmxfFileHost)
// }

const helmetConfig = {
  defaultSrc: trusted,
  scriptSrc: [
    '\'unsafe-eval\'',
    '\'unsafe-inline\''
  ].concat(trusted),
  styleSrc: ['\'unsafe-inline\''].concat(trusted),
  frameSrc: trusted,
  fontSrc: ['data:'].concat(trusted),
  imgSrc: imgSrc.concat(trusted),
  connectSrc: websockets.concat(trusted),
  frameAncestors: trusted,
  mediaSrc: trusted
};

app.use(
  helmet.contentSecurityPolicy({
    directives: helmetConfig
  })
);

const memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: 'web-express-secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  })
);

const ckConfig = {
  clientId: 'web-express',
  bearerOnly: false, //false 时，没有权限会自动跳登录页面
  authServerUrl: `${process.env.KEYCLOAK_URL}/auth`,
  secret: process.env.CLIENT_SECRET,
  realm: 'NMXF',
  sslRequired: true
};

const keycloak = new Keycloak({ store: memoryStore }, ckConfig);

app.use(
  keycloak.middleware({
    logout: '/logout',
    admin: '/'
  })
);

if (process.env.MOCK_SERVICE) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${process.env.MOCK_SERVICE}`,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/mock'
      }
    })
  )
  
}

const protocol = process.env.IS_HTTPS ? 'https://' : 'http://'
const whitelist = [protocol + process.env.BASE_URL,process.env.KEYCLOAK_URL]
app.use(
  cors({
    origin:whitelist
  })
)

if (process.env.BASE_API) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `${process.env.BASE_API}`,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/gateway'
      }
    })
  )
}


if(process.env.NO_KEYCLOAK){
  //web访问iframe，进行鉴权
  app.use(
    '/ssoAuth',
    function (req, res) {
      res.status(200).send('SSO Auth Success.')
    }
  );
}else{

  app.use(
    '/ssoAuth',
    keycloak.protect(),
    function (req, res) {
      res.status(200).send('SSO Auth Success.')
    }
  );
}


const paths = getPaths();

//@ts-ignore
paths.forEach((the_path) => {
  app.get(the_path, (req, res) => {
    res.sendFile('index.html', {root: __dirname + '/dist'})
  })
});

app.use(express.static(path.join(__dirname, '/dist')));

app.listen(8881);
