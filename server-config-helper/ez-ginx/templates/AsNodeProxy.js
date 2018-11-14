const httpsproxied = require('./httpsProxied')
;
module.exports = {
	asNodeProxyTemplate: asNodeProxyTemplate
};



/**
 *
 * @param config
 * @param config.app            node_app
 * @param config.app.name         upstream name
 * @param config.app.address      upstream address (`${url}:${port}`)
 * @param config.app.location     www location
 * @param config.server         server
 * @param config.server.name      nginx server_name
 * @param config.server.listen    nginx listen
 * @param config.server.location  nginx direct serve path
 * @param config.redirects        redirected to server_name path
 * @param opts
 * @param opts.logger           default to console
 * @param cb
 * @returns cb(err,config)
 */
function asNodeProxyTemplate(config, opts, cb){
	if (!config) {
		throw Error('Template require config param');
	}
	const {app, server} = config;
	if (typeof opts === 'function') {
		cb = opts;
		opts = {};
	}
	let {
		logger = console
	} = opts;
	if (!cb) {
		cb = r => r;
	}
	if (!(app && server) || !((app.name && app.address) && (server.name && server.listen))) {
		return cb(Error('Something is mising in config'));
	}
	if (!app.location) {
		return cb(Error('Why redirect an app with no location to listen ?'));
	}
	if (!server.location) {
		logger.warn('NGINX can serve statics better than node...');
	}
	/*
	let nginxConf = config;
	conf.upstream.value = app.name;
	conf.upstream.server = app.address;

	conf.server[0].server_name = server.name;
	conf.server.listen = server.listen;
	*/
	let nginxConf = require('./httpsProxied')('dimdid', '127.13.0.1', 'DIMIDD.COM', {webPath:'/public',rootDir:'moncul/'}, {cert: 'non', key:'oui'}, true);
	console.log('oops')
	return cb(null, httpsproxied(app.name, app.address, hostname));
}
