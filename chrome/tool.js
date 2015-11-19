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
 * Load devtools actors.
 */

const { CallWatcherFront } = require("devtools/server/actors/call-watcher");

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
  yield initializeActor(target)
});

/**
 * Called when the user closes the toolbox or disables the add-on.
 *
 * @return object
 *         A promise that should be resolved when the tool completes closing.
 */
this.shutdown = Task.async(function*() {
  yield destroyActor();
});

/**
 * Below is an example for using devtools actors.
 * !!! In effect after bug 1226267 lands !!!
 */

// Trace all functions called on `Object` prototypes
const TRACED_GLOBALS = ["Object"];
// Trace these functions called on the global context.
const TRACED_FUNCTIONS = ["setTimeout"];

let gActorFront;

function* initializeActor(target) {
  gActorFront = new CallWatcherFront(target.client, target.form);
  gActorFront.on("call", onCall);
  yield gActorFront.setup({
    tracedGlobals: TRACED_GLOBALS,
    tracedFunctions: TRACED_FUNCTIONS,
    performReload: true
  });
  yield gActorFront.initTimestampEpoch();
  yield gActorFront.resumeRecording();
}

function* destroyActor() {
  gActorFront.off("call", onCall);
  yield gActorFront.destroy();
}

let onCall = Task.async(function*(functionCallActor) {
  if (functionCallActor.type == CallWatcherFront.METHOD_FUNCTION) {
    console.log(`Called method: ${functionCallActor.name}`);
  }
  else if (functionCallActor.type == CallWatcherFront.GETTER_FUNCTION) {
    console.log(`Called getter: ${functionCallActor.name}`);
  }
  else if (functionCallActor.type == CallWatcherFront.SETTER_FUNCTION) {
    console.log(`Called setter: ${functionCallActor.name}`);
  }

  console.log(`Callsite: ${functionCallActor.file}:${functionCallActor.line}`);
  console.log(`Timestamp: ${functionCallActor.timestamp}`);
  console.log(`Caller preview: ${functionCallActor.callerPreview}`);
  console.log(`Arguments preview: ${functionCallActor.argsPreview}`);
  console.log(`Returned preview: ${functionCallActor.resultPreview}`);

  let details = yield functionCallActor.getDetails();

  console.log(`Stack:\n${JSON.stringify(details.stack, null, 2)}`);
});
