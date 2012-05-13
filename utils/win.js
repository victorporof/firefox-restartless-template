/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const WindowManager = {
  _listeners: [], // Array of { event, callback } listeners.

  /**
   * Window manager events.
   * @see addListener and removeListener.
   */
  EVENTS: {
    LOAD: "load",
    UNLOAD: "unload"
  },

  /**
   * Adds multiple listeners for specific chrome window events.
   *
   * @param aListeners
   *        An object containing the event listeners and associated callbacks.
   */
  addListeners: function WM_addListeners(aListeners) {
    for (let event in aListeners) {
      for each (let func in aListeners[event]) {
        this.addListener(event, func);
      }
    }
  },

  /**
   * Adds a listener for a specific chrome window event.
   *
   * @param string aEvent
   *        The event to be listened.
   * @param string aFunction
   *        The callback issued when the event fires.
   */
  addListener: function WM_addListener(aEvent, aFunc) {
    this._listeners.push({ event: aEvent, func: aFunc });
  },

  /**
   * Removes a listener for a specific chrome window event.
   *
   * @param string aEvent
   *        The event to be listened.
   * @param string aFunction
   *        The callback issued when the event fires.
   */
  removeListener: function WM_removeListener(aEvent, aFunc) {
    this._listeners =
      this._listeners.filter(function(e) e.event != aEvent && e.func != aFunc);
  },

  /**
   * Gets listeners for a specific event.
   * @return array
   */
  getListeners: function WM_getListeners(aEvent) {
    return this._listeners.filter(function(e) e.event == aEvent);
  },

  /**
   * Handle the add-on being activated on install/enable.
   */
  onStartup: function WM_function() {
    // Load into any existing windows.
    let enumerator = Services.wm.getEnumerator("navigator:browser");
    while (enumerator.hasMoreElements()) {
      let win = enumerator.getNext().QueryInterface(Ci.nsIDOMWindow);
      this.getListeners(this.EVENTS.LOAD).forEach(function(e) e.func(win));
    }

    // Load into any new windows.
    Services.wm.addListener(this._chromeWindowListener);
  },

  /**
   * Handle the add-on being deactivated on uninstall/disable.
   */
  onShutdown: function WM_onShutdown(aReason) {
    // When the application is shutting down we normally don't have to clean up
    // any UI changes.
    if (aReason == APP_SHUTDOWN) return;

    // Stop watching for new windows.
    Services.wm.removeListener(this._chromeWindowListener);

    // Unload from any existing windows.
    let enumerator = Services.wm.getEnumerator("navigator:browser");
    while (enumerator.hasMoreElements()) {
      let win = enumerator.getNext().QueryInterface(Ci.nsIDOMWindow);
      this.getListeners(this.EVENTS.UNLOAD).forEach(function(e) e.func(win));
    }
  },

  /**
   * Watch the load event for a particular dom window, and issue all registered
   * load callbacks when ready.
   *
   * @param nsIDOMWindow aWindow
   *        The window to be watched.
   * @param function aCallback
   *        Function called when the window was already loaded.
   */
  watch: function WM_watch(aWindow, aCallback) {
    if (aWindow.document.readyState == "complete" && typeof aCallback == "function") {
      return aCallback(aWindow.content);
    }
    aWindow.addEventListener("load", function onLoad() {
      aWindow.removeEventListener("load", onLoad, false);
      this.getListeners(this.EVENTS.LOAD).forEach(function(e) e.func(aWindow));
    }.bind(this), false);
  },

  /**
   * A listener handling any new chrome window events.
   */
  _chromeWindowListener: {
    onOpenWindow: function(aWindow) {
      // Wait for the window to finish loading.
      WindowManager.watch(aWindow
        .QueryInterface(Ci.nsIInterfaceRequestor)
        .getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow));
    },
    onCloseWindow: function(aWindow) { },
    onWindowTitleChange: function(aWindow, aTitle) { }
  }
};

// Shortcut for logging a string message to the console.
const log = Services.console.logStringMessage.bind(Services.console);
