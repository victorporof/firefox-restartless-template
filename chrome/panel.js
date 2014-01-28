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

  EventEmitter.decorate(this);
};

MyAddonPanel.prototype = {
  open: function() {
    return this.panelWin.startup().then(() => {
      this.isReady = true;
      this.emit("ready");
    });
  },

  get target() this._toolbox.target,

  destroy: function() {
    return this.panelWin.shutdown().then(() => {
      this.isReady = false;
      this.emit("destroyed");
    });
  }
};
