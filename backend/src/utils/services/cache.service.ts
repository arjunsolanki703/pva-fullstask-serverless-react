declare const redisCache: any;

/**
 * A helper function which is used to get data from Redis Store.
 * @param {string} key - name of key in which data is stored.
 * @returns {any} data - Return value stored in key in Redis Store.
 */
export const getDataFromCacheByKey = async (key: string): Promise<any> => {
	return new Promise((resolve, _) => {
		redisCache.get(key, (err, result) => {
			if (err) return resolve(false);
			resolve(result);
		});
	});
};

/**
 * A helper function which is used to set value in Redis Store.
 * @param {string} key  - name of key in which data is stored.
 * @param {any} data - Value of key.
 * @param {number} ttl - data time to live in Redis Store.
 */

export const setDataTOCache = async (
	key: string,
	data: string,
	ttl?: number
): Promise<any> => {
	if (!ttl) {
		return new Promise((resolve, reject) => {
			redisCache.set(key.toString(), data.toString(), (err, result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});
	} else {
		return new Promise((resolve, reject) => {
			redisCache.set(key, data, (err) => {
				if (err) {
					return reject(err);
				}
				redisCache.expire(key, ttl, (err, done) => {
					if (err) {
						// console.log('err 2', err);
						return reject(err);
					}
					resolve(done);
				});
			});
		});
	}
};

/**
 * A helper function which is used to delete key from redis cache.
 * @param {string} key  - name of key in which data is stored.
 */
export const deleteDataFromCache = async (key: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		redisCache.del(key, (err) => {
			if (err) return reject(err);
			resolve(true);
		});
	});
};
