/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/explain-error";
exports.ids = ["vendor-chunks/explain-error"];
exports.modules = {

/***/ "(ssr)/./node_modules/explain-error/index.js":
/*!*********************************************!*\
  !*** ./node_modules/explain-error/index.js ***!
  \*********************************************/
/***/ ((module) => {

eval("\nfunction getStack(err) {\n  if(err.stack && err.name && err.message)\n    return err.stack.substring(err.name.length + 3 + err.message.length)\n      .split('\\n')\n  else if(err.stack)\n    return err.stack.split('\\n')\n}\n\nfunction removePrefix (a, b) {\n  return a.filter(function (e) {\n    return !~b.indexOf(e)\n  })\n}\n\nvar explain = module.exports = function (err, message) {\n  if(!(err.stack && err.name && err.message)) {\n    console.error(new Error('stackless error'))\n    return err\n  }\n\n  var _err = new Error(message)\n  var stack = removePrefix(getStack(_err).slice(1), getStack(err)).join('\\n')\n\n  _err.__proto__ = err\n\n  _err.stack =\n    _err.name + ': ' + _err.message + '\\n' +\n    stack + '\\n  ' + err.stack\n\n  return _err\n}\n\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXhwbGFpbi1lcnJvci9pbmRleC5qcyIsIm1hcHBpbmdzIjoiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RoZS1jdWx0Ly4vbm9kZV9tb2R1bGVzL2V4cGxhaW4tZXJyb3IvaW5kZXguanM/ZWRkZSJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmZ1bmN0aW9uIGdldFN0YWNrKGVycikge1xuICBpZihlcnIuc3RhY2sgJiYgZXJyLm5hbWUgJiYgZXJyLm1lc3NhZ2UpXG4gICAgcmV0dXJuIGVyci5zdGFjay5zdWJzdHJpbmcoZXJyLm5hbWUubGVuZ3RoICsgMyArIGVyci5tZXNzYWdlLmxlbmd0aClcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgZWxzZSBpZihlcnIuc3RhY2spXG4gICAgcmV0dXJuIGVyci5zdGFjay5zcGxpdCgnXFxuJylcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUHJlZml4IChhLCBiKSB7XG4gIHJldHVybiBhLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuICAgIHJldHVybiAhfmIuaW5kZXhPZihlKVxuICB9KVxufVxuXG52YXIgZXhwbGFpbiA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVyciwgbWVzc2FnZSkge1xuICBpZighKGVyci5zdGFjayAmJiBlcnIubmFtZSAmJiBlcnIubWVzc2FnZSkpIHtcbiAgICBjb25zb2xlLmVycm9yKG5ldyBFcnJvcignc3RhY2tsZXNzIGVycm9yJykpXG4gICAgcmV0dXJuIGVyclxuICB9XG5cbiAgdmFyIF9lcnIgPSBuZXcgRXJyb3IobWVzc2FnZSlcbiAgdmFyIHN0YWNrID0gcmVtb3ZlUHJlZml4KGdldFN0YWNrKF9lcnIpLnNsaWNlKDEpLCBnZXRTdGFjayhlcnIpKS5qb2luKCdcXG4nKVxuXG4gIF9lcnIuX19wcm90b19fID0gZXJyXG5cbiAgX2Vyci5zdGFjayA9XG4gICAgX2Vyci5uYW1lICsgJzogJyArIF9lcnIubWVzc2FnZSArICdcXG4nICtcbiAgICBzdGFjayArICdcXG4gICcgKyBlcnIuc3RhY2tcblxuICByZXR1cm4gX2VyclxufVxuXG5cblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/explain-error/index.js\n");

/***/ })

};
;