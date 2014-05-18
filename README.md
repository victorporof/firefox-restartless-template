Restartless-Template
===

Simple template project for developing restartless Firefox Developer Tools addons.

![Screenshot](https://dl.dropboxusercontent.com/u/2388316/screenshots/firefox-restartless-addon.png)

## Workflow

This template allows you to create restartless Firefox add-ons. This means that your workflow can also benefit from it, and reduce the (likely annoying) code->build->install lag. See documentation about [setting up a bootstrapped addon extension environment](https://developer.mozilla.org/docs/Setting_up_extension_development_environment#Firefox_extension_proxy_file) for some in-depth explanation on how to do this.

tl;dr: A "Firefox extension proxy file" is a simple way of telling Firefox where an add-on is located, via an absolute path. Whenever you change the contents of the add-on, simply re-enabling it will update it; no need to tediously drag-and-drop-install it anymore.

### How to iterate fast

#### The quick and easy version

This will probably work in most unix-like shell environments, like in OS X and Linux:
```bash
git clone https://github.com/victorporof/Restartless-Template.git
cd Restartless-Template
./configure -i "your-addon-id" -n "YourAddonName" -d "Your addon description" -a "Your name" -P "default"
```

__Caveats__: Temporarily, until [issue #3](https://github.com/victorporof/Restartless-Template/issues/3) is fixed:
* `./configure` can only be used *once* after cloning the repo;
* `-i` and `-n` *must not* contain spaces, and only use alphanumeric characters.

That's it :) Now, after you change something in the add-on, simply re-enable it for it to update automatically. You can do this from the [about:addons](about:addons) page in Firefox: click the "Disable", then the "Enable" button for your add-on.

#### The detailed version

__Step 0__. Clone this repository.

__Step 1__. It's a good idea to customize your add-on's id and name *now*, before things get too complex. By default, this template has a vanilla `my-addon` id and `MyAddon` name. You should modify this using `./configure`.

* `./configure -i awesome-addon-id` to set the id; this will be useful when creating an extension proxy file.
* `./configure -n AwesomeTool` to set the name; this will be displayed in the Toolbox and various Firefox menus.

Initially, please try to only use alphanumeric characters for the add-on's id and name.

Optionally, you can also specify the add-on's author, version, description etc.:

* `./configure -v 1.0` to set the version; this is useful for tracking bugs and letting your users know which add-on version they're using.
* `./configure -d "An awesome description"` to set the description; this will be shown on [addons.mozilla.org](https://addons.mozilla.org/developers/) when publishing your add-on.
* `./configure -a "Your name"` to set the autor's name; this will be, as well, shown on [addons.mozilla.org](https://addons.mozilla.org/developers/).

__Step 2__. Locate your Firefox profile directory. Read [this](http://kb.mozillazine.org/Profile_folder_-_Firefox) for more information. It's usually in these folders:

* OS X: `~/Library/Application Support/Firefox/Profiles/<profile folder>`
* Linux: `~/.mozilla/firefox/<profile folder>`
* Windows: `%APPDATA%\Mozilla\Firefox\Profiles\<profile folder>`

Optionally, you might want to create a new Firefox profile used just for the development of your add-on. This will prevent unexpectedly and accidentally altering your main profile if you make mistakes during the development process. Read more about how to do this [here](https://developer.mozilla.org/Add-ons/Setting_up_extension_development_environment#Development_profile).

__Step 3__. Create a file in the "extensions" directory under your profile directory with the extension's ID as the file name. If there's no "extensions" folder, create it. The extension's ID is in the [install.rdf](https://github.com/victorporof/Restartless-Template/blob/master/install.rdf#L9) file.

For example, with this vanilla template, the extension proxy file name would be `my-addon@mozilla.com`.

__Step 4__. Set the (plain text) contents of this file to be the path to the directory that contains [install.rdf](https://github.com/victorporof/Restartless-Template/blob/master/install.rdf) (where you cloned this repository).

For example, the extension proxy file's contents could be `~/home/myself/work/Restartless-Template`.

__Step 5__. Restart Firefox. A dialog asking you whether "you would like to modify Firefox with the add-on" might show up; please allow the installation and continue.

Open Firefox Developer Tools using Ctrl/Cmd+Shift+I and you'll see your new addon in the Toolbox.

## Debugging

Starting with Firefox 31 ([download Aurora](https://www.mozilla.org/en-US/firefox/channel/#aurora)), you can easily debug your add-on using the built-in developer tools. Simply go to the [about:addons](about:addons) page and click the "Debug" button next to your add-on. Keep in mind that scripts are lazily evaluated, so if no code was executed, no source files will be shown.

## Theming

Starting with Firefox 29, the developer tools can be "light" or "dark" themed, based on a user preference in the Options panel of the Toolbox. To make your add-on look good regardless of the theme, you should use the `.theme-dark` and `.theme-light` selectors, as exemplified in [skin/style.css](https://github.com/victorporof/Restartless-Template/blob/master/skin/style.css).

```css
.theme-dark #my-node {
  color: #f5f7fa;
}
.theme-light #my-node {
  color: #ed2655;
}
```

Take a look at [this wiki](https://developer.mozilla.org/en-US/docs/Tools/DevToolsColors) for the recommended pallete used by default throughout the Firefox developer tools. Try using those colors for a consistent look and feel.

## Making the add-on work for remote targets

The Firefox Developer Tools have support for remote debugging. The protocol is described in depth [here](https://wiki.mozilla.org/Remote_Debugging_Protocol). If you want to make your add-on work with remote debugging, you'll have to support remote targets and [allow the add-on to use them](https://github.com/victorporof/Restartless-Template/blob/master/bootstrap.js#L59).

Certain tools in Firefox will always use remote targets, so, for example, your add-on won't show up in the [App Manager](https://developer.mozilla.org/en-US/Firefox_OS/Using_the_App_Manager) if remote targets are not supported.

Take a look at [firefox-client](https://github.com/harthur/firefox-client) repo for an example use of the remote debugging API.

## Releasing

Simply `make` inside the project folder to build and archive the latest version of the add-on. A build directory will be created, containing an .xpi file representing your add-on. Subsequent calls to `make` will update the add-on file with the latest changes.

To wipe the build directory, use `make clean`.

If you use git tags to nicely version your project, you can use `make head` to build a "release" version of your add-on based on the latest commit. This will not take uncommitted changes into consideration.

## Publish your add-on

Go to https://addons.mozilla.org/developers/ and publish your new awesome add-on.

## Read more

There's some (under development) documentation about the [Developer Tools API](https://developer.mozilla.org/docs/Tools/DevToolsAPI). If you need help, please ask around on irc.mozilla.org, in #devtools.

Thank you. Have fun!
