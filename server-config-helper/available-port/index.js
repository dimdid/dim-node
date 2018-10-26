const {scannForAvailablePort} = require('./lib/available-port')
;

module.exports = {
	scannForAvailablePort
};


if (isCalledFromCmdLine(__filename)){
	//TODO: parse opts || update README

	scannForAvailablePort({})
		.then(ports=> console.log('Available ports :', ports))
		.catch(e=>console.error(`No port available with this options`))
	;
}



function isCalledFromCmdLine(runnablePath) {
	if (!runnablePath) throw ReferenceError('Invalid runnablePath. (usually pass `__filename`)');
	//assume file or it' s folder is called directly from terminal
	  return (runnablePath.slice(0, runnablePath.lastIndexOf('/')).match(process.argv[1]) || []).length  > 0;
}