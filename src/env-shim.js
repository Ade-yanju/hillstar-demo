/* eslint-env browser, node */
/**
 * Minimal env shim for the browser.
 * Creates a safe `process.env` so code that reads `process.env.X`
 * won't crash. Avoids restricted globals like `self` and `location`.
 */
(() => {
  // Pick a global object without using restricted globals
  var root =
    typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : {};

  // Ensure process + env exist
  if (!root.process) root.process = {};
  if (!root.process.env) root.process.env = {};

  // Default NODE_ENV if absent (use a conservative default)
  if (typeof root.process.env.NODE_ENV === "undefined") {
    // Prefer development in dev servers; otherwise production
    var devHost = false;
    try {
      devHost =
        typeof window !== "undefined" &&
        window.location &&
        /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
    } catch (e) {
      devHost = false;
    }
    root.process.env.NODE_ENV = devHost ? "development" : "production";
  }
})();
