import { boat_USERNAME, boat_PASSWORD } from '../../environments';
import axios from 'axios';

export const boatFetchNumber = async (website): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=request&user=${boat_USERNAME}&pass=${boat_PASSWORD}&service=${website}`
		);

		if (response.data.status === 'error') {
			return resolve(false);
		} else {
			return response.data.message && response.data.message.length
				? resolve(response.data.message[0])
				: resolve(response.data.message);
		}
	});
};

export const boatReadSms = async (mdn, website): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=read_sms&user=${boat_USERNAME}&pass=${boat_PASSWORD}&mdn=${mdn}&service=${website}`
		);

		if (response.data.status === 'error') {
			return resolve(false);
		} else {
			return response.data.message && response.data.message.length
				? resolve(response.data.message[0])
				: resolve(response.data.message);
		}
	});
};

export const boatNumber = async (): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=list_services&user=${boat_USERNAME}&pass=${boat_PASSWORD}`
		);
		if (response.data.status === 'error') {
			return resolve(false);
		} else {
			return resolve(response.data);
		}
	});
};

export const tellbotAutoService = async (service, location): Promise<any> => {
	return new Promise(async (resolve, _) => {
		let response
		if (location === "") {
			response = await axios.get(
				`https://www.boat.com/sims/api_command.php?cmd=request&user=${boat_USERNAME}&pass=${boat_PASSWORD}&service=${service}`
			);
		} else {

			response = await axios.get(
				`https://www.boat.com/sims/api_command.php?cmd=request&user=${boat_USERNAME}&pass=${boat_PASSWORD}&service=${service}&state=${location}`
			);
		}		
		if (response.data.status === 'error') {
			return resolve(response.data);
		} else {
			return response.data.message && response.data.message.length
				? resolve(response.data)
				: resolve(response.data);
		}
	});
};

export const reactivateboatNumber = async (service, mdn): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=request&user=${boat_USERNAME}&pass=${boat_PASSWORD}&service=${service}&mdn=${mdn}`
		);

		if (response.data.status === 'error') {
			return resolve(response.data);
		} else {
			return resolve(response.data);
		}
	});
};

export const longTermNumber = async (service): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=rent&user=${boat_USERNAME}&pass=${boat_PASSWORD}&service=${service}`
		);

		if (response.data.status === 'error') {
			return resolve(response.data);
		} else {
			return resolve(response.data);
		}
	});
};

export const autoReleaseMdn = async (id: string): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=timeout&user=${boat_USERNAME}&pass=${boat_PASSWORD}&id=${id}`
		);

		if (response.data.status === 'error') {
			return resolve(response.data);
		} else {
			return response.data.message && response.data.message.length
				? resolve(response.data)
				: resolve(response.data);
		}
	});
};

export const LTRReadSMS = async (
	mdn: string,
	serviceName: string
): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=read_sms&user=${boat_USERNAME}&pass=${boat_PASSWORD}&service=${serviceName}&mdn=${mdn}`
		);
		return resolve(response.data);
	});
};

export const ToggleLTR = async (
	serviceName: string,
	mdn: string,
	autorenew: boolean
): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=toggle_autorenew&user=${boat_USERNAME}&pass=${boat_PASSWORD}&service=${serviceName}&mdn=${mdn}&autorenew=${autorenew}`
		);
		return resolve(response.data);
	});
};

export const autoReadSms = async (
	mdn: string,
	serviceName: string,
	messageId: string
): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=read_sms&user=${boat_USERNAME}&pass=${boat_PASSWORD}&id=${messageId}&service=${serviceName}&mdn=${mdn}`
		);

		if (response.data.status === 'error') {
			return resolve(response.data);
		} else {
			return response.data.message && response.data.message.length
				? resolve(response.data)
				: resolve(response.data);
		}
	});
};

export const activateLTRNumber = async (
	mdn: string,
): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=ltr_activate&user=${boat_USERNAME}&pass=${boat_PASSWORD}&mdn=${mdn}`
		);
		return resolve(response.data);
	});
};

export const LTRnumberStatusCheck = async (
	mdn: string,
): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=ltr_status&user=${boat_USERNAME}&pass=${boat_PASSWORD}&mdn=${mdn}`
		);
		return resolve(response.data);
	});
};

export const LTRReleaseMdn = async (id: string): Promise<any> => {
	return new Promise(async (resolve, _) => {
		const response = await axios.get(
			`https://www.boat.com/sims/api_command.php?cmd=ltr_release&user=${boat_USERNAME}&pass=${boat_PASSWORD}&id=${id}`
		);

		if (response.data.status === 'error') {
			return resolve(response.data);
		} else {
			return response.data.message && response.data.message.length
				? resolve(response.data)
				: resolve(response.data);
		}
	});
};
