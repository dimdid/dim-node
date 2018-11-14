const {createFromJS} = require('./lib/create-from-js')
	  , {asNodeProxyTemplate} = require('./templates/AsNodeProxy')
	, {resolve} = require('path')
;

asNodeProxyTemplate(
	{
		app: {
			name: 'monApp', address: '127.0.0.1:3000', location: '/'
		},
		server : {
			name: 'monApp.com', listen: '80', location : {'/public': resolve(process.cwd(),'public') }
		}
	},
	(err, config)=>{
	if (err) { throw err; }
	createFromJS( {in: config, out: './skel/asNodeProxy.nginx.conf'}, (err, conf)=> {
		if (err) { throw err; }
		console.log(conf);
	});
});

