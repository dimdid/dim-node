const {createServer} = require('net')
;

module.exports = {
	scannForAvailablePort
};

/**
 *
 * @param opts
 * @param opts.host                 Hostname | address where listen for port
 * (`'localhost'`)
 * @param opts.portRange            Range where to found port
 *                                  can be a range, the port to try or `0`:
 *                                  - Range: an Array of two values `[3000,3030]`
 *                                  - Port to try: a String: `'3000'` or a Number `3000`
 *                                  - 0 : random listenable port
 *                                        (must have quantity or stopOnFirst)
 * (`0`)
 * @param opts.stopOnFirstAvailable Boolean, equivalent to quantity=1
 *                                  cannot be true with quantity !== 0.
 * (`true`)
 * @param opts.quantity             Number of port requested
 * (`1`)
 * @returns {Promise<any>}  Array of available ports
 */
function scannForAvailablePort(opts) {
	let {
		host = 'localhost',
		portRange = 0,
		timeout = 500,
		stopOnFirstAvailable = true,
		quantity = 1
	} = opts;

	return new Promise((resolve, reject) => {
		let rangeHaveMax = true;
		//TODO: really assume params are valid exept range ??
		//check range
		if (!(portRange instanceof Array)) {
			if (typeof portRange === 'string' || portRange instanceof String) {
				portRange = Number(portRange);
			}
			if (isNaN(portRange) || !(typeof portRange === 'number' || portRange instanceof Number)) {
				//TODO: euh du coup avec isNaN, pas besoins de check type && instance ? non ?
				return reject(TypeError('Array or Number is expected for range..'));
			}
			// noinspection JSValidateTypes (type mismatch.. mais si j' en suis là c' est que justement ce n' est pas un array..
			portRange = [portRange, 0];
			rangeHaveMax = false;
		}
		if (portRange.length > 2) {
			return reject(RangeError('range array expected only 2 values..'));
		}
		for (let i = 0; i < 2; i++) {
			if (isNaN(portRange[i])) {
				return reject(TypeError('Number expected for port values in range option.'));
			}
		}

		if (quantity && quantity > 1) { stopOnFirstAvailable = false }

		if (!quantity && !rangeHaveMax && !stopOnFirstAvailable) {
			return reject('getFreePort is not planned to scann all ports.\n\t Please put an upper value in range or stop on first available.');
		}

		let current = portRange[0]
			, availablePorts = []
			, count = 0
		;
		const loop = portToScann => {
			let isLast = rangeHaveMax && current >= portRange[1] || count + 1 === quantity;
			testPort(portToScann)
				.then( available => {
					if (stopOnFirstAvailable) {
						return resolve([available]);
					}
					availablePorts.push(available);
					count++;
					if (isLast) {
						return resolve(availablePorts);
					}
					loop(current === 0 ? 0 :++current);

				}, indispo => {
					if (isLast) {
						return reject();
					}
					loop(++current);
				})
				.catch(allFailed => {
					reject('All failed');
				})

			;
		};
		loop(current);

		function testPort(port) {
			return new Promise((res, rej) => {
				const tmpServ = createServer();
				tmpServ
					.on('listening', () => {
						res(tmpServ.address().port);
						tmpServ.close();
					})
					.on('error', (err) => { rej(err.message); })
					.listen(port, host)
				;
			});
		}
	});
}