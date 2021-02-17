# Export Now Playing Addon for MediaMonkey
Exports information of the currently playing track to external files.

Please note that this repository is intended as sample, not as standalone addon.

## Installation
Clone the repository and add all of its files to a subfolder in the scripts folder in the MediaMonkey installation directory, e.g. `[Installation Directory]\scripts\ExportNowPlaying\`, and update the value of property `exportFolderPath` to the folder where exported files should be created. If no folder is specified, all files will be exported to the desktop of the current user.

## Customization
To add additional properties to be exported, call savePropertyToFile in exportTrackDetails with the needed parameters, e.g.

`await this.savePropertyToFile(currentTrack, 'album', `${this.exportFolderPath}\\album.txt`);`