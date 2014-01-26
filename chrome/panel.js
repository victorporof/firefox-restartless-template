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
XPCOMUtils.defineLazyModuleGetter(this, "Task",
  "resource://gre/modules/Task.jsm");

this.MyAddonPanel = function MyAddonPanel(iframeWindow, toolbox) {
  this.panelWin = iframeWindow;
  this._toolbox = toolbox;

  EventEmitter.decorate(this);
};

MyAddonPanel.prototype = {
  open: function() {
    return Task.spawn(function*() {
      yield once(this.panelWin, "load");
      yield this.panelWin.startup(this._toolbox);
      this.isReady = true;
      this.emit("ready");
    }.bind(this));
  },

  get target() this._toolbox.target,

  destroy: function() {
    return Task.spanw(function*() {
      yield this.panelWin.shutdown();
      this.isReady = false;
      this.emit("destroyed");
    }.bind(this));
  }
};

function once(node, event) {
  let deferred = promise.defer();
  node.addEventListener(event, function onEvent() {
    node.removeEventListener(event, onEvent);
    deferred.resolve();
  }, true);
  return deferred.promise;
}
