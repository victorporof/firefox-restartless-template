/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

this.EXPORTED_SYMBOLS = ["MyAddonPanel"];

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "EventEmitter",
  "resource://gre/modules/devtools/event-emitter.js");
XPCOMUtils.defineLazyModuleGetter(this, "promise",
  "resource://gre/modules/commonjs/sdk/core/promise.js", "Promise");

/**
 * This is the add-on's panel, wrapping the tool's contents.
 *
 * @param nsIDOMWindow iframeWindow
 *        The iframe window containing the tool's markup and logic.
 * @param Toolbox toolbox
 *        The developer tools toolbox, containing all tools.
 */
function MyAddonPanel(iframeWindow, toolbox) {
  this.panelWin = iframeWindow;
  this._toolbox = toolbox;

  EventEmitter.decorate(this);
};

MyAddonPanel.prototype = {
  get target() this._toolbox.target,

  /**
   * Open is effectively an asynchronous constructor.
   * Called when the user select the tool tab.
   *
   * @return object
   *         A promise that is resolved when the tool completes opening.
   */
  open: function() {
    return this.panelWin.startup(this._toolbox, this.target).then(() => {
      this.isReady = true;
      this.emit("ready");
      return this;
    });
  },

  /**
   * Called when the user closes the toolbox or disables the add-on.
   *
   * @return object
   *         A promise that is resolved when the tool completes closing.
   */
  destroy: function() {
    return this.panelWin.shutdown().then(() => {
      this.isReady = false;
      this.emit("destroyed");
    });
  }
};
