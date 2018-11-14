# ez-ginx

## confFromJS
~~~js
const {createConfFromJS} = require('ez-ginx')
    , myJsConfig = require('myJsConfigFile')
;
let opts = { 
  in:  myJsConfig, //have to export nginx config as default
  out: 'where/output/nginxConf',
};

createConfFromJS( opts, (err, conf)=> {
	if (err) { throw err; }
	console.log('conf created');
});
~~~