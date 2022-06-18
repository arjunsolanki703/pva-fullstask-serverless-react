import { Messages } from './messages';

import { DEFAULT_LANGUAGE } from '../../environments';

/**
 * i18nMessageCode for sending lang messages
 * @param {string} code - Message code for i18n.
 * @param {string} lang - lang of i18n.
 * @returns {string} message
 */
export const i18nMessageCode = (
	code = 'DEFAULT',
	lang: string = DEFAULT_LANGUAGE
): string => {
	try {
		return Messages[lang][code];
	} catch (error) {
		return Messages[DEFAULT_LANGUAGE]['DEFAULT'];
	}
};
