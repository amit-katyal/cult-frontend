/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/varint";
exports.ids = ["vendor-chunks/varint"];
exports.modules = {

/***/ "(ssr)/./node_modules/varint/decode.js":
/*!***************************************!*\
  !*** ./node_modules/varint/decode.js ***!
  \***************************************/
/***/ ((module) => {

eval("module.exports = read\n\nvar MSB = 0x80\n  , REST = 0x7F\n\nfunction read(buf, offset) {\n  var res    = 0\n    , offset = offset || 0\n    , shift  = 0\n    , counter = offset\n    , b\n    , l = buf.length\n\n  do {\n    if (counter >= l) {\n      read.bytes = 0\n      throw new RangeError('Could not decode varint')\n    }\n    b = buf[counter++]\n    res += shift < 28\n      ? (b & REST) << shift\n      : (b & REST) * Math.pow(2, shift)\n    shift += 7\n  } while (b >= MSB)\n\n  read.bytes = counter - offset\n\n  return res\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdmFyaW50L2RlY29kZS5qcyIsIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjs7QUFFQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGhlLWN1bHQvLi9ub2RlX21vZHVsZXMvdmFyaW50L2RlY29kZS5qcz84MGMwIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVhZFxuXG52YXIgTVNCID0gMHg4MFxuICAsIFJFU1QgPSAweDdGXG5cbmZ1bmN0aW9uIHJlYWQoYnVmLCBvZmZzZXQpIHtcbiAgdmFyIHJlcyAgICA9IDBcbiAgICAsIG9mZnNldCA9IG9mZnNldCB8fCAwXG4gICAgLCBzaGlmdCAgPSAwXG4gICAgLCBjb3VudGVyID0gb2Zmc2V0XG4gICAgLCBiXG4gICAgLCBsID0gYnVmLmxlbmd0aFxuXG4gIGRvIHtcbiAgICBpZiAoY291bnRlciA+PSBsKSB7XG4gICAgICByZWFkLmJ5dGVzID0gMFxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0NvdWxkIG5vdCBkZWNvZGUgdmFyaW50JylcbiAgICB9XG4gICAgYiA9IGJ1Zltjb3VudGVyKytdXG4gICAgcmVzICs9IHNoaWZ0IDwgMjhcbiAgICAgID8gKGIgJiBSRVNUKSA8PCBzaGlmdFxuICAgICAgOiAoYiAmIFJFU1QpICogTWF0aC5wb3coMiwgc2hpZnQpXG4gICAgc2hpZnQgKz0gN1xuICB9IHdoaWxlIChiID49IE1TQilcblxuICByZWFkLmJ5dGVzID0gY291bnRlciAtIG9mZnNldFxuXG4gIHJldHVybiByZXNcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/varint/decode.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/varint/encode.js":
/*!***************************************!*\
  !*** ./node_modules/varint/encode.js ***!
  \***************************************/
/***/ ((module) => {

eval("module.exports = encode\n\nvar MSB = 0x80\n  , REST = 0x7F\n  , MSBALL = ~REST\n  , INT = Math.pow(2, 31)\n\nfunction encode(num, out, offset) {\n  out = out || []\n  offset = offset || 0\n  var oldOffset = offset\n\n  while(num >= INT) {\n    out[offset++] = (num & 0xFF) | MSB\n    num /= 128\n  }\n  while(num & MSBALL) {\n    out[offset++] = (num & 0xFF) | MSB\n    num >>>= 7\n  }\n  out[offset] = num | 0\n  \n  encode.bytes = offset - oldOffset + 1\n  \n  return out\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdmFyaW50L2VuY29kZS5qcyIsIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGhlLWN1bHQvLi9ub2RlX21vZHVsZXMvdmFyaW50L2VuY29kZS5qcz9mZTlmIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZW5jb2RlXG5cbnZhciBNU0IgPSAweDgwXG4gICwgUkVTVCA9IDB4N0ZcbiAgLCBNU0JBTEwgPSB+UkVTVFxuICAsIElOVCA9IE1hdGgucG93KDIsIDMxKVxuXG5mdW5jdGlvbiBlbmNvZGUobnVtLCBvdXQsIG9mZnNldCkge1xuICBvdXQgPSBvdXQgfHwgW11cbiAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDBcbiAgdmFyIG9sZE9mZnNldCA9IG9mZnNldFxuXG4gIHdoaWxlKG51bSA+PSBJTlQpIHtcbiAgICBvdXRbb2Zmc2V0KytdID0gKG51bSAmIDB4RkYpIHwgTVNCXG4gICAgbnVtIC89IDEyOFxuICB9XG4gIHdoaWxlKG51bSAmIE1TQkFMTCkge1xuICAgIG91dFtvZmZzZXQrK10gPSAobnVtICYgMHhGRikgfCBNU0JcbiAgICBudW0gPj4+PSA3XG4gIH1cbiAgb3V0W29mZnNldF0gPSBudW0gfCAwXG4gIFxuICBlbmNvZGUuYnl0ZXMgPSBvZmZzZXQgLSBvbGRPZmZzZXQgKyAxXG4gIFxuICByZXR1cm4gb3V0XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/varint/encode.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/varint/index.js":
/*!**************************************!*\
  !*** ./node_modules/varint/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = {\n    encode: __webpack_require__(/*! ./encode.js */ \"(ssr)/./node_modules/varint/encode.js\")\n  , decode: __webpack_require__(/*! ./decode.js */ \"(ssr)/./node_modules/varint/decode.js\")\n  , encodingLength: __webpack_require__(/*! ./length.js */ \"(ssr)/./node_modules/varint/length.js\")\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdmFyaW50L2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsWUFBWSxtQkFBTyxDQUFDLDBEQUFhO0FBQ2pDLFlBQVksbUJBQU8sQ0FBQywwREFBYTtBQUNqQyxvQkFBb0IsbUJBQU8sQ0FBQywwREFBYTtBQUN6QyIsInNvdXJjZXMiOlsid2VicGFjazovL3RoZS1jdWx0Ly4vbm9kZV9tb2R1bGVzL3ZhcmludC9pbmRleC5qcz9mMjNlIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVuY29kZTogcmVxdWlyZSgnLi9lbmNvZGUuanMnKVxuICAsIGRlY29kZTogcmVxdWlyZSgnLi9kZWNvZGUuanMnKVxuICAsIGVuY29kaW5nTGVuZ3RoOiByZXF1aXJlKCcuL2xlbmd0aC5qcycpXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/varint/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/varint/length.js":
/*!***************************************!*\
  !*** ./node_modules/varint/length.js ***!
  \***************************************/
/***/ ((module) => {

eval("\nvar N1 = Math.pow(2,  7)\nvar N2 = Math.pow(2, 14)\nvar N3 = Math.pow(2, 21)\nvar N4 = Math.pow(2, 28)\nvar N5 = Math.pow(2, 35)\nvar N6 = Math.pow(2, 42)\nvar N7 = Math.pow(2, 49)\nvar N8 = Math.pow(2, 56)\nvar N9 = Math.pow(2, 63)\n\nmodule.exports = function (value) {\n  return (\n    value < N1 ? 1\n  : value < N2 ? 2\n  : value < N3 ? 3\n  : value < N4 ? 4\n  : value < N5 ? 5\n  : value < N6 ? 6\n  : value < N7 ? 7\n  : value < N8 ? 8\n  : value < N9 ? 9\n  :              10\n  )\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdmFyaW50L2xlbmd0aC5qcyIsIm1hcHBpbmdzIjoiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aGUtY3VsdC8uL25vZGVfbW9kdWxlcy92YXJpbnQvbGVuZ3RoLmpzP2E3NzEiXSwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgTjEgPSBNYXRoLnBvdygyLCAgNylcbnZhciBOMiA9IE1hdGgucG93KDIsIDE0KVxudmFyIE4zID0gTWF0aC5wb3coMiwgMjEpXG52YXIgTjQgPSBNYXRoLnBvdygyLCAyOClcbnZhciBONSA9IE1hdGgucG93KDIsIDM1KVxudmFyIE42ID0gTWF0aC5wb3coMiwgNDIpXG52YXIgTjcgPSBNYXRoLnBvdygyLCA0OSlcbnZhciBOOCA9IE1hdGgucG93KDIsIDU2KVxudmFyIE45ID0gTWF0aC5wb3coMiwgNjMpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAoXG4gICAgdmFsdWUgPCBOMSA/IDFcbiAgOiB2YWx1ZSA8IE4yID8gMlxuICA6IHZhbHVlIDwgTjMgPyAzXG4gIDogdmFsdWUgPCBONCA/IDRcbiAgOiB2YWx1ZSA8IE41ID8gNVxuICA6IHZhbHVlIDwgTjYgPyA2XG4gIDogdmFsdWUgPCBONyA/IDdcbiAgOiB2YWx1ZSA8IE44ID8gOFxuICA6IHZhbHVlIDwgTjkgPyA5XG4gIDogICAgICAgICAgICAgIDEwXG4gIClcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/varint/length.js\n");

/***/ })

};
;