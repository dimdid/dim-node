module.exports = httpsProxied;

/**
 * Standard https nginx site.conf
 *
 * @param {String} app_name     App name      my_app    (used as upstream name)
 * @param {String} app_listen   App address   127.0.0.1 (used as upstream listen)
 * @param {String} host_name    web url       myweb.com (used as server_name)
 * @param {Object} serveStatics     nginx directly serve requetes from this webpath with file from rootDir
 * @param {String} serveStatics.webPath
 * @param {String} serveStatics.rootDir
 * @param {String} serveStatics.errorPage
 * @param ssl
 * @param {String} ssl.key
 * @param {String} ssl.cert
 * @param {Boolean} needSocket  Does app require to update sockets
 */
function httpsProxied(app_name, app_listen, host_name, serveStatics, ssl, needSocket) {
	let conf = {};

	if (!ssl.cert || !ssl.key) {
		throw Error('Need ssl to set an https server...');
	}

	let sslConfig = {
		ssl_protocols: 'TLSv1 TLSv1.1 LSv1.2',
		ssl_certificate: ssl.cert,
		ssl_certificate_key: ssl.key,
		ssl_session_cache: 'shared:SSL:10m',
		ssl_session_timeout: '24h'
	};

	let locations = [];
	locations[0] = {//proxied location
		value: '/',
		proxy_http_version: '1.1',
		proxy_set_header: [
			'X-Real-IP $remote_addr',
			'X-Forwarded-For $proxy_add_x_forwarded_for',
			'Host $http_host',
			'X-Nginx-Proxy true'
		],
		proxy_pass: app_name
	};
	if (needSocket) {
		locations[0].proxy_set_header.push( 'Upgrade $http_upgrade', 'Connection "upgrade"' );
	}
	if (serveStatics && serveStatics.hasOwnProperty('webPath') && serveStatics.hasOwnProperty('rootDir')) {
		locations[1] = { value: serveStatics.webPath, root: serveStatics.rootDir };

		if (serveStatics.hasOwnProperty('errorPage')) {
			locations[0].error_page = serveStatics.errorPage;
		}
	}
	locations.push(
		//ignore dotfiles exepts well-know (used by certbot)
		{value: String.raw`~* /\.(?!well-known\/)`, deny: 'all'},
		//medias
		{
			value: String.raw`~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|mp4|ogg|ogv|webm|htc)$`,
			access_log: 'off',
			add_header: 'Cache-Control "max-age=2592000"'
		},
		//js && css
		{
			value: String.raw`~* \.(?:css|js)$`,
			add_header: 'Cache-Control "max-age=31536000"',
			access_log: 'off'
		},
		//fonts
		{
			value: String.raw`~* \.(?:ttf|ttc|otf|eot|woff|woff2)$`,
			add_header: 'Cache-Control "max-age=2592000"',
			access_log: 'off'
		}
	);

	let servers = [];
	servers[0] = {// main server
		server_name: host_name,
		listen: [
			'443 ssl http2',
			'[::]:443 ssl http2'
		],
		location : locations,
		charset: 'utf-8'
	};

	conf.upstream = {
		value: app_name,
		server: app_listen
	};

	conf.server = [...servers, ...[
		{
			// www redirect
			server_name: `www.${host_name}`,
			listen: ['[::]:443 ssl http2', '443 ssl http2'],
			return: `301 https://${host_name}$request_uri`
		},
		{
			//http -> https redirect (both www & not)
			server_name: `www.${host_name} ${host_name}`,
			listen: ['[::]:80', '80'],
			return: `301 https://${host_name}$request_uri`
		}
	]];

	return conf;
}