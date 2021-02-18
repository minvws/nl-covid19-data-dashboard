(function () {
  /**
   * Detect javascript
   */
  try {
    window.document.documentElement.classList.remove('has-no-js');
  } catch (err) {
    /** */
  }

  /**
   * Detect webp support
   */
  try {
    var webp = new Image();
    webp.onload = function () {
      window.document.documentElement.classList.add('has-webp-support');
    };
    webp.src =
      'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';
  } catch (err) {
    /** */
  }
})();
