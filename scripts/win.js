/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

let WindowListener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading.
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);

    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      loadIntoWindow(domWindow);
    }, false);
  },
  onCloseWindow: function(aWindow) { },
  onWindowTitleChange: function(aWindow, aTitle) { }
};

/**
 * Handle the add-on being activated on install/enable.
 */
function onStartup() {
  // Load into any existing windows.
  let enumerator = Services.wm.getEnumerator("navigator:browser");
  while (enumerator.hasMoreElements()) {
    let win = enumerator.getNext().QueryInterface(Ci.nsIDOMWindow);
    loadIntoWindow(win);
  }

  // Load into any new windows.
  Services.wm.addListener(WindowListener);
}

/**
 * Handle the add-on being deactivated on uninstall/disable.
 */
function onShutdown(aReason) {
  // When the application is shutting down we normally don't have to clean up
  // any UI changes.
  if (aReason == APP_SHUTDOWN) return;

  // Stop watching for new windows.
  Services.wm.removeListener(WindowListener);

  // Unload from any existing windows.
  let enumerator = wm.getEnumerator("navigator:browser");
  while (enumerator.hasMoreElements()) {
    let win = enumerator.getNext().QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(win);
  }
}
