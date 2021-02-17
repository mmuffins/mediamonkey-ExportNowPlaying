"use strict";

// Add global section to register addon actions if it doesn't exist yet
if(typeof window.window.addons == "undefined" )
	window.window.addons = {};
	
window.addons.exportNowPlaying = {
	addonName: () => "ExportNowPlaying",

	// Full path to folder where files will be exported to
	// Make sure to proberly escape backslashes, e.g. 'C:\\Users\\myuser\\Desktop'
	exportFolderPath: '',

	createListener: async function(){
		// Creates a listener that fires everytime the player state or track is changed,
		// which then calls a method to write the track details to a file
		var _this = this;

		if(0 === this.exportFolderPath.length){
			// No export directory was specified, export files to the desktop
			this.exportFolderPath = `${app.filesystem.getUserFolder()}\\Desktop`;
		}

		if(false == app.filesystem.dirExists(this.exportFolderPath)){
			alert(`Export Now Playing: Could not find directory ${this.exportFolderPath}.`);
		}

		app.listen(app.player, 'playbackState', async (e) => {
			// console.debug(e);
			if(e == 'play'){
				// changing tracks fires the event multiple times,
				// only run the export if a new track starts playing 
				await _this.exportTrackDetails();
			}
		});
		
	},

	exportTrackDetails: async function(){
		// Exports details of the currently playing track to files.
		// console.debug('Exporting track details to file.');
		var currentTrack = app.player.getCurrentTrack();

		// run the exports
		await this.savePropertyToFile(currentTrack, 'title', `${this.exportFolderPath}\\title.txt`);
		await this.savePropertyToFile(currentTrack, 'artist', `${this.exportFolderPath}\\artist.txt`);
		await this.saveCoverToFile(currentTrack, `${this.exportFolderPath}\\cover`); // the file extension is evaluated automatically, just provide the filename
	},
	
	savePropertyToFile: async function(track, property, path){
		// Saves the property of the provided track as plain text file to the specified location
		// console.debug(`Saving property ${property} (${track[property]}) to path ${path}.`);
		await app.filesystem.saveTextToFileAsync(path, track[property]);
	},


	saveCoverToFile: async function(track, path){
		// exports the first cover of the provided track to the specified location
		var _this = this;
		var covers = await track.loadCoverListAsync()

		if(covers.count > 0){
			// can also be executed with foreach to export all covers instead of just the first one
			await covers.whenLoaded(await covers.locked(async () =>{
				var exportCover = await covers.getValue(0);
				var ext = await _this.getCoverFileType(exportCover.pictureType);
				var exportPath = `${path}\.${ext}`;
				// console.debug(`Saving cover ${cover.hash} to path ${path}.`)
				await exportCover.saveToFile(exportPath);
			}))
		}
	},

	getCoverFileType: function (pictureType){
		// returns the file extension matching the picture type
		switch (pictureType) {
			case 'image/png':
				return 'png';
			case 'image/x-bmp':
				return 'bmp';
			case 'image/gif':
				return 'gif';
			default:
				return 'jpg';
		};	}
}

window.whenReady(async () => {
	await window.addons.exportNowPlaying.createListener();
});