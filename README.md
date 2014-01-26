Restartless-Template
===

Simple template project for developing restartless Firefox Developer Tools addons.

![Screenshot](https://dl.dropboxusercontent.com/u/2388316/screenshots/firefox-restartless-addon.png)

## Workflow

This template allows you to create restartless Firefox add-ons. This means that your workflow can also benefit from it, and reduce the (likely annoying) code->build->install lag. See documentation about [setting up a bootstrapped addon extension environment](https://developer.mozilla.org/en-US/docs/Setting_up_extension_development_environment#Firefox_extension_proxy_file) for some in-depth explanation on how to do this.

tl;dr: A "Firefox extension proxy file" is a simple way of telling Firefox where an add-on is located, via an absolute path. Whenever you change the contents of the add-on, simply re-enabling it will update it; no need to tediously drag-and-drop-install it anymore.

### How to iterate fast

__Step 0__. Clone this repository somewhere.

__Step 1__. Locate your Firefox profile directory. Read [this](http://kb.mozillazine.org/Profile_folder_-_Firefox) for more information. It's usually in these folders:

* OS X: `~/Library/Application Support/Firefox/Profiles/<profile folder>`
* Linux: `~/.mozilla/firefox/<profile folder>`
* Windows: `%APPDATA%\Mozilla\Firefox\Profiles\<profile folder>`

__Step 2__. Create a file in the "extensions" directory under your profile directory with the extension's ID as the file name. If there's no "extensions" folder, create it. The extension's ID is in the [install.rdf](https://github.com/victorporof/Restartless-Template/blob/master/install.rdf#L9) file.

For example, with this vanilla template, the extension proxy file name would be `my-addon@mozilla.com`.

__Step 3__. Set the (plain text) contents of this file to be the path to the directory that contains [install.rdf](https://github.com/victorporof/Restartless-Template/blob/master/install.rdf) (where you cloned this repository).

For example, the extension proxy file's contents could be `~/home/myself/work/Restartless-Template`.

__Step 4__. Restart Firefox. A dialog asking you whether "you would like to modify Firefox with the add-on" might show up; please allow the installation and continue.

That's it :) Now, after you change something in the add-on, simply re-enable it for it to update automatically. You can do this from the [about:addons](about:addons) page in Firefox.

## Releasing

Simply `make` inside the project folder to build and archive the latest version of the add-on. A build directory will be created, containing an .xpi file representing your add-on. Subsequent calls to `make` will update the add-on file with the latest changes.

To wipe the build directory, use `make clean`.

If you use git tags to nicely version your project, you can use `make xpi` to build a "release" version of your add-on based on the latest tag. This will not take uncommitted changes into consideration.

## Read more

There's some (under development) documentation about the [Developer Tools API](https://developer.mozilla.org/en-US/docs/Tools/DevToolsAPI). If you need help, please ask around on irc.mozilla.org, in #devtools.

Thank you. Have fun!
