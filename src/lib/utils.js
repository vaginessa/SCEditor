function isTypeof(type, arg) {
	return typeof arg === type;
}
export var isString = isTypeof.bind(null, 'string');
export var isUndefined = isTypeof.bind(null, 'undefined');
export var isFunction = isTypeof.bind(null, 'function');
export var isNumber = isTypeof.bind(null, 'number');


/**
 * Returns true if an object has no keys
 *
 * @param obj {Object}
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}

export function extend(isDeep, target) {
	var isDeepSpecified = isDeep === !!isDeep;
	var i  = isDeepSpecified ? 2 : 1;
	target = isDeepSpecified ? target : isDeep;
	isDeep = isDeepSpecified ? isDeep : false;

	for (; i < arguments.length; i++) {
		var source = arguments[i] || {};

		// jQuery compatibility
		/* eslint guard-for-in: off */
		for (var key in source) {
			var value = source[key];
			// Skip undefined values to match jQuery and
			// skip if prevent infinite loop
			if (!isUndefined(value) && value !== target) {
				var isObject = value !== null && typeof value === 'object';
				var isArray = Array.isArray(value);

				if (isDeep && isObject || isArray) {
					target[key] = extend(
						true,
						target[key] || (isArray ? [] : {}),
						value
					);
				} else {
					target[key] = value;
				}
			}
		}
	}

	return target;
}

/**
 * @param {Array} arr
 * @param {*} item
 * @returns {void}
 */
export function arrayRemove(arr, item) {
	var i = arr.indexOf(item);

	if (i > -1) {
		arr.splice(i, 1);
	}
}

/**
 * @param {Object|Array} obj
 * @param {Function} fn
 * @returns {void}
 */
export function each(obj, fn) {
	if (Array.isArray(obj) || 'length' in obj && isNumber(obj.length)) {
		for (var i = 0; i < obj.length; i++) {
			fn(i, obj[i]);
		}
	} else {
		Object.keys(obj).forEach(function (key) {
			fn(key, obj[key]);
		});
	}
}
