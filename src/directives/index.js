export const imgError = {
  inserted: function(dom, options) {
    // console.log(111)
    dom.onerror = function() {
      dom.src = options.value
    }
  }
}
