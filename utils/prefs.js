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
   * Set a new or overwrites an existing preference value.
   * @param string aKey
   * @param boolean | number | string aValue
   */
  setPref: function P_setPref(aKey, aValue) {
    this._map[aKey] = aValue;

    // Figure out what type of pref to store.
    switch (typeof this._map[aKey]) {
      case "boolean":
        this._branch.setBoolPref(aKey, aValue);
        break;
      case "number":
        this._branch.setIntPref(aKey, aValue);
        break;
      case "string":
        this._branch.setCharPref(aKey, aValue);
        break;
    }
  },

  /**
   * Initialize default preferences specified in the map.
   */
  setDefaults: function P_setDefaults() {
    for (let [key, val] in Iterator(this._map)) {
      this.setPref(key, val);
    }
  }
};

// Shortcut for accessing a pref.
const pref = Prefs.getPref.bind(Prefs);

// Shortcut for saving a pref.
const save = Prefs.setPref.bind(Prefs);
