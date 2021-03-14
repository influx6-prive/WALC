const { ipcRenderer } = window.require('electron');

export default {
	async created() {
		this.settings = await ipcRenderer.invoke('getSettings', this.group);
		Object.keys(this.settings).forEach((key) => {
			this.$watch(`settings.${key}.value`, (value) => {
				ipcRenderer.invoke('setSettings', { [`${this.group}.${key}.value`]: value })
			});
		})
	},

	data() {
		return {
			settings: {},
		}
	},
}