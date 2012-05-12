/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const global = this;

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import("resource://gre/modules/AddonManager.jsm");
Cu.import("resource://gre/modules/Services.jsm");

function loadIntoWindow(window) {
}

function unloadFromWindow(window) {
}

/**
 * Handle the add-on being activated on install/enable.
 */
function startup({id}) AddonManager.getAddonByID(id, function(addon) {
  // Load various javascript includes for helper functions.
  ["prefs", "win"].forEach(function(fileName) {
    let fileURI = addon.getResourceURI("scripts/" + fileName + ".js");
    Services.scriptloader.loadSubScript(fileURI.spec, global);
  });

  // Always set the default prefs as they disappear on restart.
  setDefaultPrefs();
  onStartup();
});

/**
 * Handle the add-on being deactivated on uninstall/disable.
 */
function shutdown(data, reason) {
  onShutdown(reason);
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
