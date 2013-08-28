/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

this.EXPORTED_SYMBOLS = ["MyAddonPanel"];

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "EventEmitter",
  "resource:///modules/devtools/shared/event-emitter.js");
XPCOMUtils.defineLazyModuleGetter(this, "promise",
  "resource://gre/modules/commonjs/sdk/core/promise.js", "Promise");

this.MyAddonPanel = function MyAddonPanel(iframeWindow, toolbox) {
  this.panelWin = iframeWindow;
  this._toolbox = toolbox;
  this._destroyer = null;

  EventEmitter.decorate(this);
};

MyAddonPanel.prototype = {
  open: function() {
    let panelWin = this.panelWin;
    let panelLoaded = promise.defer();

    // Make sure the iframe content window is ready.
    panelWin.addEventListener("load", function onLoad() {
      panelWin.removeEventListener("load", onLoad, true);
      panelLoaded.resolve();
    }, true);

    return panelLoaded.promise
      .then(() => this.panelWin.startup(this._toolbox))
      .then(() => {
        this.isReady = true;
        this.emit("ready");
        return this;
      })
      .then(null, function onError(aReason) {
        Cu.reportError("MyAddonPanel open failed. " +
                       aReason.error + ": " + aReason.message);
      });
  },

  // DevToolPanel API

  get target() this._toolbox.target,

  destroy: function() {
    // Make sure this panel is not already destroyed.
    if (this._destroyer) {
      return this._destroyer;
    }

    return this._destroyer = this.panelWin.shutdown()
      .then(() => {
        this.isReady = false;
        this.emit("destroyed");
      })
      .then(null, function onError(aReason) {
        Cu.reportError("MyAddonPanel destroy failed. " +
                       aReason.error + ": " + aReason.message);
      });
  }
};
