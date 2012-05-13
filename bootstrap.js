/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const global = this;
const includes = [
  "utils/prefs.js",
  "utils/win.js",
  "main.js"
];

const PREF_BRANCH = "extensions.my-addon.";
const PREF_MAP = {
  example: "my-pref"
};

const { classes: Cc, interfaces: Ci, manager: Cm, utils: Cu } = Components;
Cu.import("resource://gre/modules/AddonManager.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

/**
 * Handle the add-on being activated on install/enable.
 */
function startup({id}) AddonManager.getAddonByID(id, function(addon) {
  global.addon = addon;

  // Load various javascript includes for helper functions.
  includes.forEach(function(fileName) {
    let fileURI = addon.getResourceURI(fileName);
    Services.scriptloader.loadSubScript(fileURI.spec, global);
  });

  // Always set the default prefs as they disappear on restart.
  Prefs.init(PREF_BRANCH, PREF_MAP).setDefaults();

  // Adds listeners for specific chrome window events.
  WindowManager.addListeners({ load: [loadIntoWindow], unload: [unloadFromWindow] });
  WindowManager.onStartup();
});

/**
 * Handle the add-on being deactivated on uninstall/disable.
 */
function shutdown(data, reason) {
  WindowManager.onShutdown(reason);
}

/**
 * Handle the add-on being installed.
 */
function install(data, reason) {
}

/**
 * Handle the add-on being uninstalled.
 */
function uninstall(data, reason) {
}
