Restartless-Template
===

Simple template project for developing restartless Firefox Developer Tools addons.

![Screenshot](https://dl.dropboxusercontent.com/u/2388316/screenshots/firefox-restartless-addon.png)

## Workflow

This template allows you to create restartless Firefox add-ons. This means that your workflow can also benefit from it, and reduce the (likely annoying) code->build->install lag. See documentation about [setting up a bootstrapped addon extension environment](https://developer.mozilla.org/en-US/docs/Setting_up_extension_development_environment#Firefox_extension_proxy_file) for some in-depth explanation on how to do this.

tl;dr: A "Firefox extension proxy file" is a simple way of telling Firefox where an add-on is located, via an absolute path. Whenever you change the contents of the add-on, simply re-enabling it will update it; no need to tediously drag-and-drop-install it anymore.

### How to iterate fast

__Step 0__. Clone this repository.

__Step 1__. It's a good idea to customize your add-on's id and name *now*, before things get too complex. By default, this template has a vanilla `my-addon` id and `MyAddon` name. You should modify this using `./configure`.

* `./configure -i awesome-addon-id` to set the id; this will be useful when creating an extension proxy file.
* `./configure -n AwesomeTool` to set the name; this will be displayed in the Toolbox and various Firefox menus.

Initially, please try to only use alphanumeric characters for the add-on's id and name.

Optionally, you can also specify the add-on's author, version, description etc.:

* `./configure -v 1.0` to set the version; this is useful for tracking bugs and letting your users know which add-on version they're using.
* `./configure -d "An awesome description"` to set the description; this will be shown on [addons.mozilla.org](https://addons.mozilla.org/en-US/developers/) when publishing your add-on.
* `./configure -a "Your name"` to set the autor's name; this will be, as well, shown on [addons.mozilla.org](https://addons.mozilla.org/en-US/developers/).

__Step 2__. Locate your Firefox profile directory. Read [this](http://kb.mozillazine.org/Profile_folder_-_Firefox) for more information. It's usually in these folders:

* OS X: `~/Library/Application Support/Firefox/Profiles/<profile folder>`
* Linux: `~/.mozilla/firefox/<profile folder>`
* Windows: `%APPDATA%\Mozilla\Firefox\Profiles\<profile folder>`

Optionally, you might want to create a new Firefox profile used just for the development of your add-on. This will prevent unexpectedly and accidentally altering your main profile if you make mistakes during the development process. Read more about how to do this [here](https://developer.mozilla.org/en-US/Add-ons/Setting_up_extension_development_environment#Development_profile).

__Step 3__. Create a file in the "extensions" directory under your profile directory with the extension's ID as the file name. If there's no "extensions" folder, create it. The extension's ID is in the [install.rdf](https://github.com/victorporof/Restartless-Template/blob/master/install.rdf#L9) file.

For example, with this vanilla template, the extension proxy file name would be `my-addon@mozilla.com`.

__Step 4__. Set the (plain text) contents of this file to be the path to the directory that contains [install.rdf](https://github.com/victorporof/Restartless-Template/blob/master/install.rdf) (where you cloned this repository).

For example, the extension proxy file's contents could be `~/home/myself/work/Restartless-Template`.

__Step 5__. Restart Firefox. A dialog asking you whether "you would like to modify Firefox with the add-on" might show up; please allow the installation and continue.

Open Firefox Developer Tools using Ctrl/Cmd+Shift+I and you'll see your new addon in the Toolbox.

That's it :) Now, after you change something in the add-on, simply re-enable it for it to update automatically. You can do this from the [about:addons](about:addons) page in Firefox: click the "Disable", then the "Enable" button for your add-on.

## Releasing

Simply `make` inside the project folder to build and archive the latest version of the add-on. A build directory will be created, containing an .xpi file representing your add-on. Subsequent calls to `make` will update the add-on file with the latest changes.

To wipe the build directory, use `make clean`.

If you use git tags to nicely version your project, you can use `make xpi` to build a "release" version of your add-on based on the latest tag. This will not take uncommitted changes into consideration.

## Publish your add-on

Go to https://addons.mozilla.org/en-US/developers/ and publish your new awesome add-on.

## Read more

There's some (under development) documentation about the [Developer Tools API](https://developer.mozilla.org/en-US/docs/Tools/DevToolsAPI). If you need help, please ask around on irc.mozilla.org, in #devtools.

Thank you. Have fun!
