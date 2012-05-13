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
    this._branchName = aBranch;
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
    // Figure out what type of pref to store.
    switch (typeof (this._map[aKey] = aValue)) {
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

const Localization = {

  /**
   * Initializes the localization bundle.
   * @param object aAddon
   * @param string aLocale
   * @return self
   */
  init: function L_init(aAddon, aLocale) {
    let propertyPath = "locales/" + aLocale + ".properties";
    let propertyFile = global.addon.getResourceURI(propertyPath);

    this._localeName = aLocale;
    this._bundlePath = propertyFile;
    return this;
  },

  /**
   * Returns a (optionally formatted) string in the string bundle.
   *
   * @param string aName
   *        The string name in the bundle.
   * @param array aArgs
   *        Arguments for the formatted string.
   *
   * @return string The equivalent string from the bundle.
   */
  getString: function L_getString(aName, aArgs)
  {
    if (!aName) {
      return null;
    }
    if (!aArgs) {
      return this._bundle.GetStringFromName(aName);
    }
    return this._bundle.formatStringFromName(aName, aArgs, aArgs.length);
  }
};

XPCOMUtils.defineLazyGetter(Prefs, "_branch", function() {
  return Services.prefs.getBranch(Prefs._branchName);
});

// set the necessary string bundle
XPCOMUtils.defineLazyGetter(Localization, "_bundle", function() {
  // Avoid caching issues by always getting a new file.
  let uniqueFileSpec = Localization._bundlePath.spec + "#" + Math.random();
  return Services.strings.createBundle(uniqueFileSpec);
});

// Shortcut for accessing a pref.
const pref = Prefs.getPref.bind(Prefs);

// Shortcut for saving a pref.
const save = Prefs.setPref.bind(Prefs);

// Shortcut for accessing a localized string.
const l10n = Localization.getString.bind(Localization);
