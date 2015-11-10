/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

/**
 * This file has access to the `window` and `document` objects of the add-on's
 * iframe, and is included in tool.xhtml. This is the add-on's controller.
 */

const { require, loader } = Components.utils.import("resource://devtools/shared/Loader.jsm", {});

/**
 * Import files using `require` and `loader.lazyRequireGetter`. You should use
 * the latter for modules that aren't immediately needed.
 */

const { Task } = require("resource://gre/modules/Task.jsm");
loader.lazyRequireGetter(this, "Services");
loader.lazyRequireGetter(this, "promise");
loader.lazyRequireGetter(this, "EventEmitter", "devtools/shared/event-emitter");

/**
 * Define lazy getters for expensive IO using `loader.lazyGetter`.
 */

loader.lazyGetter(this, "toolStrings", () => {
  return Services.strings.createBundle("chrome://my-addon/locale/strings.properties");
});

/**
 * DOM query helpers.
 */
const $ = (selector, target = document) => target.querySelector(selector);
const $$ = (selector, target = document) => target.querySelectorAll(selector);

/**
 * Called when the user select the tool tab.
 *
 * @param Toolbox toolbox
 *        The developer tools toolbox, containing all tools.
 * @param object target
 *        The local or remote target being debugged.
 * @return object
 *         A promise that should be resolved when the tool completes opening.
 */
this.startup = Task.async(function*(toolbox, target) {
  // $("#hello").textContent = toolStrings.GetStringFromName("greeting");
  $("#hello").textContent = toolStrings.formatStringFromName("customizedGreeting", ["MyAddon"], 1);
});

/**
 * Called when the user closes the toolbox or disables the add-on.
 *
 * @return object
 *         A promise that should be resolved when the tool completes closing.
 */
this.shutdown = Task.async(function*() {
  // Nothing to do here yet.
});
