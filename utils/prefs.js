/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const Prefs = {

  /**
   * Initializes the preferences branch and map.
   * @param string aBranch
   * @param object aMap
   * @return self
   */
  init: function P_init(aBranch, aMap) {
    this._branch = Services.prefs.getBranch(aBranch);
    this._map = aMap;
    return this;
  },

  /**
   * Get the preference value of type specified in the map.
   * @param string aKey
   * @return boolean | number | string
   */
  getPref: function P_getPref(aKey) {
    // Figure out what type of pref to fetch.
    switch (typeof this._map[aKey]) {
      case "boolean":
        return this._branch.getBoolPref(aKey);
      case "number":
        return this._branch.getIntPref(aKey);
      case "string":
        return this._branch.getCharPref(aKey);
    }
  },

  /**
   * Initialize default preferences specified in the map.
   */
  setDefaults: function P_setDefaults() {
    for (let [key, val] in Iterator(this._map)) {
      switch (typeof val) {
        case "boolean":
          this._branch.setBoolPref(key, val);
          break;
        case "number":
          this._branch.setIntPref(key, val);
          break;
        case "string":
          this._branch.setCharPref(key, val);
          break;
      }
    }
  }
};

// Shortcut for accessing a pref.
const pref = Prefs.getPref.bind(Prefs);
