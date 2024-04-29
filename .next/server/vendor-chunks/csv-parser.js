/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/csv-parser";
exports.ids = ["vendor-chunks/csv-parser"];
exports.modules = {

/***/ "(rsc)/./node_modules/csv-parser/index.js":
/*!******************************************!*\
  !*** ./node_modules/csv-parser/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { Transform } = __webpack_require__(/*! stream */ \"stream\")\n\nconst [cr] = Buffer.from('\\r')\nconst [nl] = Buffer.from('\\n')\nconst defaults = {\n  escape: '\"',\n  headers: null,\n  mapHeaders: ({ header }) => header,\n  mapValues: ({ value }) => value,\n  newline: '\\n',\n  quote: '\"',\n  raw: false,\n  separator: ',',\n  skipComments: false,\n  skipLines: null,\n  maxRowBytes: Number.MAX_SAFE_INTEGER,\n  strict: false\n}\n\nclass CsvParser extends Transform {\n  constructor (opts = {}) {\n    super({ objectMode: true, highWaterMark: 16 })\n\n    if (Array.isArray(opts)) opts = { headers: opts }\n\n    const options = Object.assign({}, defaults, opts)\n\n    options.customNewline = options.newline !== defaults.newline\n\n    for (const key of ['newline', 'quote', 'separator']) {\n      if (typeof options[key] !== 'undefined') {\n        ([options[key]] = Buffer.from(options[key]))\n      }\n    }\n\n    // if escape is not defined on the passed options, use the end value of quote\n    options.escape = (opts || {}).escape ? Buffer.from(options.escape)[0] : options.quote\n\n    this.state = {\n      empty: options.raw ? Buffer.alloc(0) : '',\n      escaped: false,\n      first: true,\n      lineNumber: 0,\n      previousEnd: 0,\n      rowLength: 0,\n      quoted: false\n    }\n\n    this._prev = null\n\n    if (options.headers === false) {\n      // enforce, as the column length check will fail if headers:false\n      options.strict = false\n    }\n\n    if (options.headers || options.headers === false) {\n      this.state.first = false\n    }\n\n    this.options = options\n    this.headers = options.headers\n  }\n\n  parseCell (buffer, start, end) {\n    const { escape, quote } = this.options\n    // remove quotes from quoted cells\n    if (buffer[start] === quote && buffer[end - 1] === quote) {\n      start++\n      end--\n    }\n\n    let y = start\n\n    for (let i = start; i < end; i++) {\n      // check for escape characters and skip them\n      if (buffer[i] === escape && i + 1 < end && buffer[i + 1] === quote) {\n        i++\n      }\n\n      if (y !== i) {\n        buffer[y] = buffer[i]\n      }\n      y++\n    }\n\n    return this.parseValue(buffer, start, y)\n  }\n\n  parseLine (buffer, start, end) {\n    const { customNewline, escape, mapHeaders, mapValues, quote, separator, skipComments, skipLines } = this.options\n\n    end-- // trim newline\n    if (!customNewline && buffer.length && buffer[end - 1] === cr) {\n      end--\n    }\n\n    const comma = separator\n    const cells = []\n    let isQuoted = false\n    let offset = start\n\n    if (skipComments) {\n      const char = typeof skipComments === 'string' ? skipComments : '#'\n      if (buffer[start] === Buffer.from(char)[0]) {\n        return\n      }\n    }\n\n    const mapValue = (value) => {\n      if (this.state.first) {\n        return value\n      }\n\n      const index = cells.length\n      const header = this.headers[index]\n\n      return mapValues({ header, index, value })\n    }\n\n    for (let i = start; i < end; i++) {\n      const isStartingQuote = !isQuoted && buffer[i] === quote\n      const isEndingQuote = isQuoted && buffer[i] === quote && i + 1 <= end && buffer[i + 1] === comma\n      const isEscape = isQuoted && buffer[i] === escape && i + 1 < end && buffer[i + 1] === quote\n\n      if (isStartingQuote || isEndingQuote) {\n        isQuoted = !isQuoted\n        continue\n      } else if (isEscape) {\n        i++\n        continue\n      }\n\n      if (buffer[i] === comma && !isQuoted) {\n        let value = this.parseCell(buffer, offset, i)\n        value = mapValue(value)\n        cells.push(value)\n        offset = i + 1\n      }\n    }\n\n    if (offset < end) {\n      let value = this.parseCell(buffer, offset, end)\n      value = mapValue(value)\n      cells.push(value)\n    }\n\n    if (buffer[end - 1] === comma) {\n      cells.push(mapValue(this.state.empty))\n    }\n\n    const skip = skipLines && skipLines > this.state.lineNumber\n    this.state.lineNumber++\n\n    if (this.state.first && !skip) {\n      this.state.first = false\n      this.headers = cells.map((header, index) => mapHeaders({ header, index }))\n\n      this.emit('headers', this.headers)\n      return\n    }\n\n    if (!skip && this.options.strict && cells.length !== this.headers.length) {\n      const e = new RangeError('Row length does not match headers')\n      this.emit('error', e)\n    } else {\n      if (!skip) this.writeRow(cells)\n    }\n  }\n\n  parseValue (buffer, start, end) {\n    if (this.options.raw) {\n      return buffer.slice(start, end)\n    }\n\n    return buffer.toString('utf-8', start, end)\n  }\n\n  writeRow (cells) {\n    const headers = (this.headers === false) ? cells.map((value, index) => index) : this.headers\n\n    const row = cells.reduce((o, cell, index) => {\n      const header = headers[index]\n      if (header === null) return o // skip columns\n      if (header !== undefined) {\n        o[header] = cell\n      } else {\n        o[`_${index}`] = cell\n      }\n      return o\n    }, {})\n\n    this.push(row)\n  }\n\n  _flush (cb) {\n    if (this.state.escaped || !this._prev) return cb()\n    this.parseLine(this._prev, this.state.previousEnd, this._prev.length + 1) // plus since online -1s\n    cb()\n  }\n\n  _transform (data, enc, cb) {\n    if (typeof data === 'string') {\n      data = Buffer.from(data)\n    }\n\n    const { escape, quote } = this.options\n    let start = 0\n    let buffer = data\n\n    if (this._prev) {\n      start = this._prev.length\n      buffer = Buffer.concat([this._prev, data])\n      this._prev = null\n    }\n\n    const bufferLength = buffer.length\n\n    for (let i = start; i < bufferLength; i++) {\n      const chr = buffer[i]\n      const nextChr = i + 1 < bufferLength ? buffer[i + 1] : null\n\n      this.state.rowLength++\n      if (this.state.rowLength > this.options.maxRowBytes) {\n        return cb(new Error('Row exceeds the maximum size'))\n      }\n\n      if (!this.state.escaped && chr === escape && nextChr === quote && i !== start) {\n        this.state.escaped = true\n        continue\n      } else if (chr === quote) {\n        if (this.state.escaped) {\n          this.state.escaped = false\n          // non-escaped quote (quoting the cell)\n        } else {\n          this.state.quoted = !this.state.quoted\n        }\n        continue\n      }\n\n      if (!this.state.quoted) {\n        if (this.state.first && !this.options.customNewline) {\n          if (chr === nl) {\n            this.options.newline = nl\n          } else if (chr === cr) {\n            if (nextChr !== nl) {\n              this.options.newline = cr\n            }\n          }\n        }\n\n        if (chr === this.options.newline) {\n          this.parseLine(buffer, this.state.previousEnd, i + 1)\n          this.state.previousEnd = i + 1\n          this.state.rowLength = 0\n        }\n      }\n    }\n\n    if (this.state.previousEnd === bufferLength) {\n      this.state.previousEnd = 0\n      return cb()\n    }\n\n    if (bufferLength - this.state.previousEnd < data.length) {\n      this._prev = data\n      this.state.previousEnd -= (bufferLength - data.length)\n      return cb()\n    }\n\n    this._prev = buffer\n    cb()\n  }\n}\n\nmodule.exports = (opts) => new CsvParser(opts)\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvY3N2LXBhcnNlci9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQSxRQUFRLFlBQVksRUFBRSxtQkFBTyxDQUFDLHNCQUFROztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekIsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCO0FBQ3hCLFlBQVkscUNBQXFDOztBQUVqRCxzQ0FBc0M7O0FBRXRDLG9DQUFvQzs7QUFFcEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQzs7QUFFaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZLGdCQUFnQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHdCQUF3QixTQUFTO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFlBQVksMEZBQTBGOztBQUV0RztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx5QkFBeUIsc0JBQXNCO0FBQy9DOztBQUVBLHdCQUF3QixTQUFTO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtEQUErRCxlQUFlOztBQUU5RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBLEtBQUssSUFBSTs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBWSxnQkFBZ0I7QUFDNUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHdCQUF3QixrQkFBa0I7QUFDMUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3N1LWZzZC8uL25vZGVfbW9kdWxlcy9jc3YtcGFyc2VyL2luZGV4LmpzPzVlNGYiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBUcmFuc2Zvcm0gfSA9IHJlcXVpcmUoJ3N0cmVhbScpXG5cbmNvbnN0IFtjcl0gPSBCdWZmZXIuZnJvbSgnXFxyJylcbmNvbnN0IFtubF0gPSBCdWZmZXIuZnJvbSgnXFxuJylcbmNvbnN0IGRlZmF1bHRzID0ge1xuICBlc2NhcGU6ICdcIicsXG4gIGhlYWRlcnM6IG51bGwsXG4gIG1hcEhlYWRlcnM6ICh7IGhlYWRlciB9KSA9PiBoZWFkZXIsXG4gIG1hcFZhbHVlczogKHsgdmFsdWUgfSkgPT4gdmFsdWUsXG4gIG5ld2xpbmU6ICdcXG4nLFxuICBxdW90ZTogJ1wiJyxcbiAgcmF3OiBmYWxzZSxcbiAgc2VwYXJhdG9yOiAnLCcsXG4gIHNraXBDb21tZW50czogZmFsc2UsXG4gIHNraXBMaW5lczogbnVsbCxcbiAgbWF4Um93Qnl0ZXM6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICBzdHJpY3Q6IGZhbHNlXG59XG5cbmNsYXNzIENzdlBhcnNlciBleHRlbmRzIFRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yIChvcHRzID0ge30pIHtcbiAgICBzdXBlcih7IG9iamVjdE1vZGU6IHRydWUsIGhpZ2hXYXRlck1hcms6IDE2IH0pXG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRzKSkgb3B0cyA9IHsgaGVhZGVyczogb3B0cyB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cbiAgICBvcHRpb25zLmN1c3RvbU5ld2xpbmUgPSBvcHRpb25zLm5ld2xpbmUgIT09IGRlZmF1bHRzLm5ld2xpbmVcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIFsnbmV3bGluZScsICdxdW90ZScsICdzZXBhcmF0b3InXSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIChbb3B0aW9uc1trZXldXSA9IEJ1ZmZlci5mcm9tKG9wdGlvbnNba2V5XSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgZXNjYXBlIGlzIG5vdCBkZWZpbmVkIG9uIHRoZSBwYXNzZWQgb3B0aW9ucywgdXNlIHRoZSBlbmQgdmFsdWUgb2YgcXVvdGVcbiAgICBvcHRpb25zLmVzY2FwZSA9IChvcHRzIHx8IHt9KS5lc2NhcGUgPyBCdWZmZXIuZnJvbShvcHRpb25zLmVzY2FwZSlbMF0gOiBvcHRpb25zLnF1b3RlXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZW1wdHk6IG9wdGlvbnMucmF3ID8gQnVmZmVyLmFsbG9jKDApIDogJycsXG4gICAgICBlc2NhcGVkOiBmYWxzZSxcbiAgICAgIGZpcnN0OiB0cnVlLFxuICAgICAgbGluZU51bWJlcjogMCxcbiAgICAgIHByZXZpb3VzRW5kOiAwLFxuICAgICAgcm93TGVuZ3RoOiAwLFxuICAgICAgcXVvdGVkOiBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMuX3ByZXYgPSBudWxsXG5cbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzID09PSBmYWxzZSkge1xuICAgICAgLy8gZW5mb3JjZSwgYXMgdGhlIGNvbHVtbiBsZW5ndGggY2hlY2sgd2lsbCBmYWlsIGlmIGhlYWRlcnM6ZmFsc2VcbiAgICAgIG9wdGlvbnMuc3RyaWN0ID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8IG9wdGlvbnMuaGVhZGVycyA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuc3RhdGUuZmlyc3QgPSBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnNcbiAgfVxuXG4gIHBhcnNlQ2VsbCAoYnVmZmVyLCBzdGFydCwgZW5kKSB7XG4gICAgY29uc3QgeyBlc2NhcGUsIHF1b3RlIH0gPSB0aGlzLm9wdGlvbnNcbiAgICAvLyByZW1vdmUgcXVvdGVzIGZyb20gcXVvdGVkIGNlbGxzXG4gICAgaWYgKGJ1ZmZlcltzdGFydF0gPT09IHF1b3RlICYmIGJ1ZmZlcltlbmQgLSAxXSA9PT0gcXVvdGUpIHtcbiAgICAgIHN0YXJ0KytcbiAgICAgIGVuZC0tXG4gICAgfVxuXG4gICAgbGV0IHkgPSBzdGFydFxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIC8vIGNoZWNrIGZvciBlc2NhcGUgY2hhcmFjdGVycyBhbmQgc2tpcCB0aGVtXG4gICAgICBpZiAoYnVmZmVyW2ldID09PSBlc2NhcGUgJiYgaSArIDEgPCBlbmQgJiYgYnVmZmVyW2kgKyAxXSA9PT0gcXVvdGUpIHtcbiAgICAgICAgaSsrXG4gICAgICB9XG5cbiAgICAgIGlmICh5ICE9PSBpKSB7XG4gICAgICAgIGJ1ZmZlclt5XSA9IGJ1ZmZlcltpXVxuICAgICAgfVxuICAgICAgeSsrXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFyc2VWYWx1ZShidWZmZXIsIHN0YXJ0LCB5KVxuICB9XG5cbiAgcGFyc2VMaW5lIChidWZmZXIsIHN0YXJ0LCBlbmQpIHtcbiAgICBjb25zdCB7IGN1c3RvbU5ld2xpbmUsIGVzY2FwZSwgbWFwSGVhZGVycywgbWFwVmFsdWVzLCBxdW90ZSwgc2VwYXJhdG9yLCBza2lwQ29tbWVudHMsIHNraXBMaW5lcyB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICBlbmQtLSAvLyB0cmltIG5ld2xpbmVcbiAgICBpZiAoIWN1c3RvbU5ld2xpbmUgJiYgYnVmZmVyLmxlbmd0aCAmJiBidWZmZXJbZW5kIC0gMV0gPT09IGNyKSB7XG4gICAgICBlbmQtLVxuICAgIH1cblxuICAgIGNvbnN0IGNvbW1hID0gc2VwYXJhdG9yXG4gICAgY29uc3QgY2VsbHMgPSBbXVxuICAgIGxldCBpc1F1b3RlZCA9IGZhbHNlXG4gICAgbGV0IG9mZnNldCA9IHN0YXJ0XG5cbiAgICBpZiAoc2tpcENvbW1lbnRzKSB7XG4gICAgICBjb25zdCBjaGFyID0gdHlwZW9mIHNraXBDb21tZW50cyA9PT0gJ3N0cmluZycgPyBza2lwQ29tbWVudHMgOiAnIydcbiAgICAgIGlmIChidWZmZXJbc3RhcnRdID09PSBCdWZmZXIuZnJvbShjaGFyKVswXSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtYXBWYWx1ZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZmlyc3QpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluZGV4ID0gY2VsbHMubGVuZ3RoXG4gICAgICBjb25zdCBoZWFkZXIgPSB0aGlzLmhlYWRlcnNbaW5kZXhdXG5cbiAgICAgIHJldHVybiBtYXBWYWx1ZXMoeyBoZWFkZXIsIGluZGV4LCB2YWx1ZSB9KVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICBjb25zdCBpc1N0YXJ0aW5nUXVvdGUgPSAhaXNRdW90ZWQgJiYgYnVmZmVyW2ldID09PSBxdW90ZVxuICAgICAgY29uc3QgaXNFbmRpbmdRdW90ZSA9IGlzUXVvdGVkICYmIGJ1ZmZlcltpXSA9PT0gcXVvdGUgJiYgaSArIDEgPD0gZW5kICYmIGJ1ZmZlcltpICsgMV0gPT09IGNvbW1hXG4gICAgICBjb25zdCBpc0VzY2FwZSA9IGlzUXVvdGVkICYmIGJ1ZmZlcltpXSA9PT0gZXNjYXBlICYmIGkgKyAxIDwgZW5kICYmIGJ1ZmZlcltpICsgMV0gPT09IHF1b3RlXG5cbiAgICAgIGlmIChpc1N0YXJ0aW5nUXVvdGUgfHwgaXNFbmRpbmdRdW90ZSkge1xuICAgICAgICBpc1F1b3RlZCA9ICFpc1F1b3RlZFxuICAgICAgICBjb250aW51ZVxuICAgICAgfSBlbHNlIGlmIChpc0VzY2FwZSkge1xuICAgICAgICBpKytcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKGJ1ZmZlcltpXSA9PT0gY29tbWEgJiYgIWlzUXVvdGVkKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMucGFyc2VDZWxsKGJ1ZmZlciwgb2Zmc2V0LCBpKVxuICAgICAgICB2YWx1ZSA9IG1hcFZhbHVlKHZhbHVlKVxuICAgICAgICBjZWxscy5wdXNoKHZhbHVlKVxuICAgICAgICBvZmZzZXQgPSBpICsgMVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvZmZzZXQgPCBlbmQpIHtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMucGFyc2VDZWxsKGJ1ZmZlciwgb2Zmc2V0LCBlbmQpXG4gICAgICB2YWx1ZSA9IG1hcFZhbHVlKHZhbHVlKVxuICAgICAgY2VsbHMucHVzaCh2YWx1ZSlcbiAgICB9XG5cbiAgICBpZiAoYnVmZmVyW2VuZCAtIDFdID09PSBjb21tYSkge1xuICAgICAgY2VsbHMucHVzaChtYXBWYWx1ZSh0aGlzLnN0YXRlLmVtcHR5KSlcbiAgICB9XG5cbiAgICBjb25zdCBza2lwID0gc2tpcExpbmVzICYmIHNraXBMaW5lcyA+IHRoaXMuc3RhdGUubGluZU51bWJlclxuICAgIHRoaXMuc3RhdGUubGluZU51bWJlcisrXG5cbiAgICBpZiAodGhpcy5zdGF0ZS5maXJzdCAmJiAhc2tpcCkge1xuICAgICAgdGhpcy5zdGF0ZS5maXJzdCA9IGZhbHNlXG4gICAgICB0aGlzLmhlYWRlcnMgPSBjZWxscy5tYXAoKGhlYWRlciwgaW5kZXgpID0+IG1hcEhlYWRlcnMoeyBoZWFkZXIsIGluZGV4IH0pKVxuXG4gICAgICB0aGlzLmVtaXQoJ2hlYWRlcnMnLCB0aGlzLmhlYWRlcnMpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIXNraXAgJiYgdGhpcy5vcHRpb25zLnN0cmljdCAmJiBjZWxscy5sZW5ndGggIT09IHRoaXMuaGVhZGVycy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGUgPSBuZXcgUmFuZ2VFcnJvcignUm93IGxlbmd0aCBkb2VzIG5vdCBtYXRjaCBoZWFkZXJzJylcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXNraXApIHRoaXMud3JpdGVSb3coY2VsbHMpXG4gICAgfVxuICB9XG5cbiAgcGFyc2VWYWx1ZSAoYnVmZmVyLCBzdGFydCwgZW5kKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5yYXcpIHtcbiAgICAgIHJldHVybiBidWZmZXIuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcsIHN0YXJ0LCBlbmQpXG4gIH1cblxuICB3cml0ZVJvdyAoY2VsbHMpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gKHRoaXMuaGVhZGVycyA9PT0gZmFsc2UpID8gY2VsbHMubWFwKCh2YWx1ZSwgaW5kZXgpID0+IGluZGV4KSA6IHRoaXMuaGVhZGVyc1xuXG4gICAgY29uc3Qgcm93ID0gY2VsbHMucmVkdWNlKChvLCBjZWxsLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgaGVhZGVyID0gaGVhZGVyc1tpbmRleF1cbiAgICAgIGlmIChoZWFkZXIgPT09IG51bGwpIHJldHVybiBvIC8vIHNraXAgY29sdW1uc1xuICAgICAgaWYgKGhlYWRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9baGVhZGVyXSA9IGNlbGxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9bYF8ke2luZGV4fWBdID0gY2VsbFxuICAgICAgfVxuICAgICAgcmV0dXJuIG9cbiAgICB9LCB7fSlcblxuICAgIHRoaXMucHVzaChyb3cpXG4gIH1cblxuICBfZmx1c2ggKGNiKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXNjYXBlZCB8fCAhdGhpcy5fcHJldikgcmV0dXJuIGNiKClcbiAgICB0aGlzLnBhcnNlTGluZSh0aGlzLl9wcmV2LCB0aGlzLnN0YXRlLnByZXZpb3VzRW5kLCB0aGlzLl9wcmV2Lmxlbmd0aCArIDEpIC8vIHBsdXMgc2luY2Ugb25saW5lIC0xc1xuICAgIGNiKClcbiAgfVxuXG4gIF90cmFuc2Zvcm0gKGRhdGEsIGVuYywgY2IpIHtcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICBkYXRhID0gQnVmZmVyLmZyb20oZGF0YSlcbiAgICB9XG5cbiAgICBjb25zdCB7IGVzY2FwZSwgcXVvdGUgfSA9IHRoaXMub3B0aW9uc1xuICAgIGxldCBzdGFydCA9IDBcbiAgICBsZXQgYnVmZmVyID0gZGF0YVxuXG4gICAgaWYgKHRoaXMuX3ByZXYpIHtcbiAgICAgIHN0YXJ0ID0gdGhpcy5fcHJldi5sZW5ndGhcbiAgICAgIGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW3RoaXMuX3ByZXYsIGRhdGFdKVxuICAgICAgdGhpcy5fcHJldiA9IG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXJMZW5ndGggPSBidWZmZXIubGVuZ3RoXG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBidWZmZXJMZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hyID0gYnVmZmVyW2ldXG4gICAgICBjb25zdCBuZXh0Q2hyID0gaSArIDEgPCBidWZmZXJMZW5ndGggPyBidWZmZXJbaSArIDFdIDogbnVsbFxuXG4gICAgICB0aGlzLnN0YXRlLnJvd0xlbmd0aCsrXG4gICAgICBpZiAodGhpcy5zdGF0ZS5yb3dMZW5ndGggPiB0aGlzLm9wdGlvbnMubWF4Um93Qnl0ZXMpIHtcbiAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignUm93IGV4Y2VlZHMgdGhlIG1heGltdW0gc2l6ZScpKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuc3RhdGUuZXNjYXBlZCAmJiBjaHIgPT09IGVzY2FwZSAmJiBuZXh0Q2hyID09PSBxdW90ZSAmJiBpICE9PSBzdGFydCkge1xuICAgICAgICB0aGlzLnN0YXRlLmVzY2FwZWQgPSB0cnVlXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9IGVsc2UgaWYgKGNociA9PT0gcXVvdGUpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZXNjYXBlZCkge1xuICAgICAgICAgIHRoaXMuc3RhdGUuZXNjYXBlZCA9IGZhbHNlXG4gICAgICAgICAgLy8gbm9uLWVzY2FwZWQgcXVvdGUgKHF1b3RpbmcgdGhlIGNlbGwpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5xdW90ZWQgPSAhdGhpcy5zdGF0ZS5xdW90ZWRcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuc3RhdGUucXVvdGVkKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZpcnN0ICYmICF0aGlzLm9wdGlvbnMuY3VzdG9tTmV3bGluZSkge1xuICAgICAgICAgIGlmIChjaHIgPT09IG5sKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubmV3bGluZSA9IG5sXG4gICAgICAgICAgfSBlbHNlIGlmIChjaHIgPT09IGNyKSB7XG4gICAgICAgICAgICBpZiAobmV4dENociAhPT0gbmwpIHtcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm5ld2xpbmUgPSBjclxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaHIgPT09IHRoaXMub3B0aW9ucy5uZXdsaW5lKSB7XG4gICAgICAgICAgdGhpcy5wYXJzZUxpbmUoYnVmZmVyLCB0aGlzLnN0YXRlLnByZXZpb3VzRW5kLCBpICsgMSlcbiAgICAgICAgICB0aGlzLnN0YXRlLnByZXZpb3VzRW5kID0gaSArIDFcbiAgICAgICAgICB0aGlzLnN0YXRlLnJvd0xlbmd0aCA9IDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLnByZXZpb3VzRW5kID09PSBidWZmZXJMZW5ndGgpIHtcbiAgICAgIHRoaXMuc3RhdGUucHJldmlvdXNFbmQgPSAwXG4gICAgICByZXR1cm4gY2IoKVxuICAgIH1cblxuICAgIGlmIChidWZmZXJMZW5ndGggLSB0aGlzLnN0YXRlLnByZXZpb3VzRW5kIDwgZGF0YS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX3ByZXYgPSBkYXRhXG4gICAgICB0aGlzLnN0YXRlLnByZXZpb3VzRW5kIC09IChidWZmZXJMZW5ndGggLSBkYXRhLmxlbmd0aClcbiAgICAgIHJldHVybiBjYigpXG4gICAgfVxuXG4gICAgdGhpcy5fcHJldiA9IGJ1ZmZlclxuICAgIGNiKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IChvcHRzKSA9PiBuZXcgQ3N2UGFyc2VyKG9wdHMpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/csv-parser/index.js\n");

/***/ })

};
;