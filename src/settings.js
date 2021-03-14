const Store = require('electron-store');
const dotProp = require('dot-prop');

const settings = {};
const schema = {
	general: {
		askOnExit: {
			default: true,
			name: 'Ask on Exit',
			description: 'If enabled, WALC will confirm everytime you want to close it. Default is true.'
		},
		alwaysOnTop: {
			default: false,
			name: 'Always On Top',
			description: 'Allow WALC to always be shown in front of other apps'
		},
	},
	notification: {
		newStatus: {
			default: false,
			name: 'New Status Updates',
			description: 'Display Notification when someone updates their status.'
		},
	},
	trayIcon: {
		trayEnabled: {
			default: true,
			name: 'Enable tray icon',
		},
		closeToTray: {
			default: false,
			name: 'Close to Tray',
			description: 'If enabled, WALC will be hidden everytime you want to close it. Default is false.'
		},
		startHidden: {
			default: false,
			name: 'Start Hidden',
			description: 'Hide WALC on startup'
		},
		countMuted: {
			default: true,
			name: 'Include Muted Chats',
			description: 'Count muted chats in the badge counter'
		},
	},
	advanced: {
		multiInstance: {
			default: false,
			name: 'Allow Multiple Instances',
			description: "It allows you open multiple instances of WALC so you can login to more than one WhatsApp account. It is disabled by default."
		},
	},
};

// get default value from schema
const defaults = Object.keys(schema).reduce((defaults, group) => {
	defaults[group] = Object.keys(schema[group]).reduce((groups, key) => {
		groups[key] = schema[group][key].default;
		return groups;
	}, {});
	return defaults;
}, {});

// init electron-store
const store = new Store({
	name: 'settings',
	defaults: defaults,
	// defaults: {
	// 	general: {
	// 		askOnExit: {
	// 			value: true,
	// 			name: 'Ask on Exit',
	// 			description: 'If enabled, WALC will confirm everytime you want to close it. Default is true.'
	// 		},
	// 		alwaysOnTop: {
	// 			value: false,
	// 			name: 'Always On Top',
	// 			description: 'Allow WALC to always be shown in front of other apps'
	// 		},
	// 	},
	// 	notification: {
	// 		newStatus: {
	// 			value: false,
	// 			name: 'New Status Updates',
	// 			description: 'Display Notification when someone updates their status.'
	// 		},
	// 	},
	// 	trayIcon: {
	// 		trayEnabled: {
	// 			value: true,
	// 			name: 'Enable tray icon',
	// 		},
	// 		closeToTray: {
	// 			value: false,
	// 			name: 'Close to Tray',
	// 			description: 'If enabled, WALC will be hidden everytime you want to close it. Default is false.'
	// 		},
	// 		startHidden: {
	// 			value: false,
	// 			name: 'Start Hidden',
	// 			description: 'Hide WALC on startup'
	// 		},
	// 		countMuted: {
	// 			value: true,
	// 			name: 'Include Muted Chats',
	// 			description: 'Count muted chats in the badge counter'
	// 		},
	// 	},
	// 	advanced: {
	// 		multiInstance: {
	// 			value: false,
	// 			name: 'Allow Multiple Instances',
	// 			description: "It allows you open multiple instances of WALC so you can login to more than one WhatsApp account. It is disabled by default."
	// 		},
	// 	},
	// },
	// migrations: {
	// 	'0.1.12': (settings) => {
	// 		const store = settings.store;

	// 		const newSettings = {
	// 			general: {
	// 				askOnExit: store.askOnExit.value,
	// 				alwaysOnTop: store.alwaysOnTop.value,
	// 			},
	// 			notification: {
	// 				newStatus: store.newStatusNotification.value,
	// 			},
	// 			trayIcon: {
	// 				closeToTray: store.closeToTray.value,
	// 				startHidden: store.startHidden.value,
	// 				countMuted: store.countMuted.value,
	// 			},
	// 			advanced: {
	// 				multiInstance: store.multiInstance,
	// 			},
	// 		};

	// 		settings.store = newSettings;
	// 		settings.delete('darkMode');
	// 		settings.delete('autoHideMenuBar');
	// 	}
	// },
});

// attach value getter and setter to electron-store
Object.keys(schema).forEach((group) => {
	Object.keys(schema[group]).forEach((key) => {
		schema[group][key].value = store.store[group][key];

		// NOTE: I'd use getter and setter but it won't appear in JSON
		// Object.defineProperty(schema[group][key], 'value', {
		// 	get: () => store.get(`${group}.${key}`),
		// 	set: (value) => store.set(`${group}.${key}`, value),
		// });
	});
});

settings.store = schema;
settings.get = (key) => dotProp.get(schema, key);
settings.set = (key, value) => {
	dotProp.set(schema, key, value);
	store.set(key, value);
};

module.exports = settings;
