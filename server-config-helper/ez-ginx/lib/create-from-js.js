module.exports = {
	createFromJS
};

/**
 *
 * @param opts
 * @param opts.in   jsConfig
 * @param opts.out  outputPath for nginx.conf
 * @param cb(err,config)
 * @returns {*}
 */
function createFromJS(opts, cb) {
	if (!opts.in || !opts.out) {
		throw Error('Missing opts');
	}
	let nginxConf = formatObjProps(opts.in);
	return cb(null, nginxConf);

	function formatObjProps(obj, deep) {
		if (!deep) { deep = 0; }

		const startLine = key => `${makeTab(deep)}${key}`
		;
		let formatted = '';
		for (let i=0, keys=Object.keys(obj); i<keys.length; i++) {
			let line = '';
			if (keys[i] !== 'value') {
				// noinspection FallThroughInSwitchStatementJS
				switch (obj[keys[i]].constructor) {

					case Number:
						obj[keys[i]] += '';

					case String:
						line += `${startLine(keys[i])} ${obj[keys[i]]};\n`;
						break;

					case Array:
						for (let j = 0; j < obj[keys[i]].length; j++) {
							line += startLine(keys[i]);
							if (obj[keys[i]][j].constructor === String) {
								line += ` ${obj[keys[i]][j]};\n`;
							}  else {
								if (obj[keys[i]][j].value) {
									line += ` ${obj[keys[i]][j].value}`;
								}
								if (Object.keys(obj[keys[i]][j]).length === 1) {
									line += ';\n';
								} else {
									line += ` {\n${formatObjProps(obj[keys[i]][j], ++deep)}`;
									line += `${makeTab(--deep)}}\n`;
								}
							}
						}
						break;

					case Object:
						line += `${startLine(keys[i])}`;
						if (obj[keys[i]].value) {
							line += ` ${obj[keys[i]].value}`;
						}
						line += ' {\n';
						line += formatObjProps(obj[keys[i]], ++deep);
						--deep;
						line += startLine('}\n');
						break;

					default :
						return cb(Error(`Unknow type of ${keys[i]} propertie`));
				}
			}
			formatted += line;
		}

		return formatted;

		function makeTab(tab) {
			let ret = '';
			for (let i = 0; i < tab; i++){
				ret += '\t';
			}
			return ret;
		}
	}
}