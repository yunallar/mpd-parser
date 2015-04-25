var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.global.CLOSURE_UNCOMPILED_DEFINES;
goog.global.CLOSURE_DEFINES;
goog.isDef = function(val) {
    return val !== void 0
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
    var parts = name.split(".");
    var cur = opt_objectToExportTo || goog.global;
    if (!(parts[0] in cur) && cur.execScript) cur.execScript("var " + parts[0]);
    for (var part; parts.length && (part = parts.shift());)
        if (!parts.length && goog.isDef(opt_object)) cur[part] = opt_object;
        else if (cur[part]) cur = cur[part];
    else cur = cur[part] = {}
};
goog.define = function(name, defaultValue) {
    var value = defaultValue;
    if (!COMPILED)
        if (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
        else if (goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) value = goog.global.CLOSURE_DEFINES[name];
    goog.exportPath_(name, value)
};
goog.define("goog.DEBUG", true);
goog.define("goog.LOCALE", "en");
goog.define("goog.TRUSTED_SITE", true);
goog.define("goog.STRICT_MODE_COMPATIBLE", false);
goog.define("goog.DISALLOW_TEST_ONLY_CODE", COMPILED && !goog.DEBUG);
goog.provide = function(name) {
    if (!COMPILED)
        if (goog.isProvided_(name)) throw Error('Namespace "' + name + '" already declared.');
    goog.constructNamespace_(name)
};
goog.constructNamespace_ = function(name, opt_obj) {
    if (!COMPILED) {
        delete goog.implicitNamespaces_[name];
        var namespace = name;
        while (namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
            if (goog.getObjectByName(namespace)) break;
            goog.implicitNamespaces_[namespace] = true
        }
    }
    goog.exportPath_(name, opt_obj)
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
    if (!goog.isString(name) || !name || name.search(goog.VALID_MODULE_RE_) == -1) throw Error("Invalid module identifier");
    if (!goog.isInModuleLoader_()) throw Error("Module " + name + " has been loaded incorrectly.");
    if (goog.moduleLoaderState_.moduleName) throw Error("goog.module may only be called once per module.");
    goog.moduleLoaderState_.moduleName = name;
    if (!COMPILED) {
        if (goog.isProvided_(name)) throw Error('Namespace "' + name + '" already declared.');
        delete goog.implicitNamespaces_[name]
    }
};
goog.module.get = function(name) {
    return goog.module.getInternal_(name)
};
goog.module.getInternal_ = function(name) {
    if (!COMPILED)
        if (goog.isProvided_(name)) return name in goog.loadedModules_ ? goog.loadedModules_[name] : goog.getObjectByName(name);
        else return null
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
    return goog.moduleLoaderState_ != null
};
goog.module.declareTestMethods = function() {
    if (!goog.isInModuleLoader_()) throw new Error("goog.module.declareTestMethods must be called from " + "within a goog.module");
    goog.moduleLoaderState_.declareTestMethods = true
};
goog.module.declareLegacyNamespace = function() {
    if (!COMPILED && !goog.isInModuleLoader_()) throw new Error("goog.module.declareLegacyNamespace must be called from " + "within a goog.module");
    if (!COMPILED && !goog.moduleLoaderState_.moduleName) throw Error("goog.module must be called prior to " + "goog.module.declareLegacyNamespace.");
    goog.moduleLoaderState_.declareLegacyNamespace = true
};
goog.setTestOnly = function(opt_message) {
    if (goog.DISALLOW_TEST_ONLY_CODE) {
        opt_message = opt_message || "";
        throw Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
    }
};
goog.forwardDeclare = function(name) {};
if (!COMPILED) {
    goog.isProvided_ = function(name) {
        return name in goog.loadedModules_ || !goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name))
    };
    goog.implicitNamespaces_ = {
        "goog.module": true
    }
}
goog.getObjectByName = function(name, opt_obj) {
    var parts = name.split(".");
    var cur = opt_obj || goog.global;
    for (var part; part = parts.shift();)
        if (goog.isDefAndNotNull(cur[part])) cur = cur[part];
        else return null;
    return cur
};
goog.globalize = function(obj, opt_global) {
    var global = opt_global || goog.global;
    for (var x in obj) global[x] = obj[x]
};
goog.addDependency = function(relPath, provides, requires, opt_isModule) {
    if (goog.DEPENDENCIES_ENABLED) {
        var provide, require;
        var path = relPath.replace(/\\/g, "/");
        var deps = goog.dependencies_;
        for (var i = 0; provide = provides[i]; i++) {
            deps.nameToPath[provide] = path;
            deps.pathIsModule[path] = !!opt_isModule
        }
        for (var j = 0; require = requires[j]; j++) {
            if (!(path in deps.requires)) deps.requires[path] = {};
            deps.requires[path][require] = true
        }
    }
};
goog.define("goog.ENABLE_DEBUG_LOADER", true);
goog.logToConsole_ = function(msg) {
    if (goog.global.console) goog.global.console["error"](msg)
};
goog.require = function(name) {
    if (!COMPILED) {
        if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) goog.maybeProcessDeferredDep_(name);
        if (goog.isProvided_(name))
            if (goog.isInModuleLoader_()) return goog.module.getInternal_(name);
            else return null;
        if (goog.ENABLE_DEBUG_LOADER) {
            var path = goog.getPathFromDeps_(name);
            if (path) {
                goog.included_[path] = true;
                goog.writeScripts_();
                return null
            }
        }
        var errorMessage = "goog.require could not find: " + name;
        goog.logToConsole_(errorMessage);
        throw Error(errorMessage);
    }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {};
goog.abstractMethod = function() {
    throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
    ctor.getInstance = function() {
        if (ctor.instance_) return ctor.instance_;
        if (goog.DEBUG) goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
        return ctor.instance_ = new ctor
    }
};
goog.instantiatedSingletons_ = [];
goog.define("goog.LOAD_MODULE_USING_EVAL", true);
goog.define("goog.SEAL_MODULE_EXPORTS", goog.DEBUG);
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
if (goog.DEPENDENCIES_ENABLED) {
    goog.included_ = {};
    goog.dependencies_ = {
        pathIsModule: {},
        nameToPath: {},
        requires: {},
        visited: {},
        written: {},
        deferred: {}
    };
    goog.inHtmlDocument_ = function() {
        var doc = goog.global.document;
        return typeof doc != "undefined" && "write" in doc
    };
    goog.findBasePath_ = function() {
        if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
            goog.basePath = goog.global.CLOSURE_BASE_PATH;
            return
        } else if (!goog.inHtmlDocument_()) return;
        var doc = goog.global.document;
        var scripts = doc.getElementsByTagName("SCRIPT");
        for (var i =
                scripts.length - 1; i >= 0; --i) {
            var script = (scripts[i]);
            var src = script.src;
            var qmark = src.lastIndexOf("?");
            var l = qmark == -1 ? src.length : qmark;
            if (src.substr(l - 7, 7) == "base.js") {
                goog.basePath = src.substr(0, l - 7);
                return
            }
        }
    };
    goog.importScript_ = function(src, opt_sourceText) {
        var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
        if (importScript(src, opt_sourceText)) goog.dependencies_.written[src] = true
    };
    goog.IS_OLD_IE_ = !!(!goog.global.atob && goog.global.document && goog.global.document.all);
    goog.importModule_ =
        function(src) {
            var bootstrap = 'goog.retrieveAndExecModule_("' + src + '");';
            if (goog.importScript_("", bootstrap)) goog.dependencies_.written[src] = true
        };
    goog.queuedModules_ = [];
    goog.wrapModule_ = function(srcUrl, scriptText) {
        if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) return "" + "goog.loadModule(function(exports) {" + '"use strict";' + scriptText + "\n" + ";return exports" + "});" + "\n//# sourceURL=" + srcUrl + "\n";
        else return "" + "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl +
            "\n") + ");"
    };
    goog.loadQueuedModules_ = function() {
        var count = goog.queuedModules_.length;
        if (count > 0) {
            var queue = goog.queuedModules_;
            goog.queuedModules_ = [];
            for (var i = 0; i < count; i++) {
                var path = queue[i];
                goog.maybeProcessDeferredPath_(path)
            }
        }
    };
    goog.maybeProcessDeferredDep_ = function(name) {
        if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
            var path = goog.getPathFromDeps_(name);
            goog.maybeProcessDeferredPath_(goog.basePath + path)
        }
    };
    goog.isDeferredModule_ = function(name) {
        var path = goog.getPathFromDeps_(name);
        if (path && goog.dependencies_.pathIsModule[path]) {
            var abspath = goog.basePath + path;
            return abspath in goog.dependencies_.deferred
        }
        return false
    };
    goog.allDepsAreAvailable_ = function(name) {
        var path = goog.getPathFromDeps_(name);
        if (path && path in goog.dependencies_.requires)
            for (var requireName in goog.dependencies_.requires[path])
                if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) return false;
        return true
    };
    goog.maybeProcessDeferredPath_ = function(abspath) {
        if (abspath in goog.dependencies_.deferred) {
            var src =
                goog.dependencies_.deferred[abspath];
            delete goog.dependencies_.deferred[abspath];
            goog.globalEval(src)
        }
    };
    goog.loadModule = function(moduleDef) {
        var previousState = goog.moduleLoaderState_;
        try {
            goog.moduleLoaderState_ = {
                moduleName: undefined,
                declareTestMethods: false
            };
            var exports;
            if (goog.isFunction(moduleDef)) exports = moduleDef.call(goog.global, {});
            else if (goog.isString(moduleDef)) exports = goog.loadModuleFromSource_.call(goog.global, moduleDef);
            else throw Error("Invalid module definition");
            var moduleName = goog.moduleLoaderState_.moduleName;
            if (!goog.isString(moduleName) || !moduleName) throw Error('Invalid module name "' + moduleName + '"');
            if (goog.moduleLoaderState_.declareLegacyNamespace) goog.constructNamespace_(moduleName, exports);
            else if (goog.SEAL_MODULE_EXPORTS && Object.seal) Object.seal(exports);
            goog.loadedModules_[moduleName] = exports;
            if (goog.moduleLoaderState_.declareTestMethods)
                for (var entry in exports)
                    if (entry.indexOf("test", 0) === 0 || entry == "tearDown" || entry == "setUp" || entry == "setUpPage" || entry == "tearDownPage") goog.global[entry] = exports[entry]
        } finally {
            goog.moduleLoaderState_ =
                previousState
        }
    };
    goog.loadModuleFromSource_ = function(source) {
        var exports = {};
        eval(arguments[0]);
        return exports
    };
    goog.writeScriptTag_ = function(src, opt_sourceText) {
        if (goog.inHtmlDocument_()) {
            var doc = goog.global.document;
            if (doc.readyState == "complete") {
                var isDeps = /\bdeps.js$/.test(src);
                if (isDeps) return false;
                else throw Error('Cannot write "' + src + '" after document load');
            }
            var isOldIE = goog.IS_OLD_IE_;
            if (opt_sourceText === undefined)
                if (!isOldIE) doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
                else {
                    var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
                    doc.write('<script type="text/javascript" src="' + src + '"' + state + "></" + "script>")
                } else doc.write('<script type="text/javascript">' + opt_sourceText + "</" + "script>");
            return true
        } else return false
    };
    goog.lastNonModuleScriptIndex_ = 0;
    goog.onScriptLoad_ = function(script, scriptIndex) {
        if (script.readyState == "complete" && goog.lastNonModuleScriptIndex_ == scriptIndex) goog.loadQueuedModules_();
        return true
    };
    goog.writeScripts_ =
        function() {
            var scripts = [];
            var seenScript = {};
            var deps = goog.dependencies_;

            function visitNode(path) {
                if (path in deps.written) return;
                if (path in deps.visited) {
                    if (!(path in seenScript)) {
                        seenScript[path] = true;
                        scripts.push(path)
                    }
                    return
                }
                deps.visited[path] = true;
                if (path in deps.requires)
                    for (var requireName in deps.requires[path])
                        if (!goog.isProvided_(requireName))
                            if (requireName in deps.nameToPath) visitNode(deps.nameToPath[requireName]);
                            else throw Error("Undefined nameToPath for " + requireName);
                if (!(path in seenScript)) {
                    seenScript[path] =
                        true;
                    scripts.push(path)
                }
            }
            for (var path in goog.included_)
                if (!deps.written[path]) visitNode(path);
            for (var i = 0; i < scripts.length; i++) {
                var path = scripts[i];
                goog.dependencies_.written[path] = true
            }
            var moduleState = goog.moduleLoaderState_;
            goog.moduleLoaderState_ = null;
            var loadingModule = false;
            for (var i = 0; i < scripts.length; i++) {
                var path = scripts[i];
                if (path)
                    if (!deps.pathIsModule[path]) goog.importScript_(goog.basePath + path);
                    else {
                        loadingModule = true;
                        goog.importModule_(goog.basePath + path)
                    } else {
                    goog.moduleLoaderState_ =
                        moduleState;
                    throw Error("Undefined script input");
                }
            }
            goog.moduleLoaderState_ = moduleState
        };
    goog.getPathFromDeps_ = function(rule) {
        if (rule in goog.dependencies_.nameToPath) return goog.dependencies_.nameToPath[rule];
        else return null
    };
    goog.findBasePath_();
    if (!goog.global.CLOSURE_NO_DEPS) goog.importScript_(goog.basePath + "deps.js")
}
goog.normalizePath_ = function(path) {
    var components = path.split("/");
    var i = 0;
    while (i < components.length)
        if (components[i] == ".") components.splice(i, 1);
        else if (i && components[i] == ".." && components[i - 1] && components[i - 1] != "..") components.splice(--i, 2);
    else i++;
    return components.join("/")
};
goog.retrieveAndExecModule_ = function(src) {
    if (!COMPILED) {
        var originalPath = src;
        src = goog.normalizePath_(src);
        var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
        var scriptText = null;
        var xhr = new goog.global["XMLHttpRequest"];
        xhr.onload = function() {
            scriptText = this.responseText
        };
        xhr.open("get", src, false);
        xhr.send();
        scriptText = xhr.responseText;
        if (scriptText != null) {
            var execModuleScript = goog.wrapModule_(src, scriptText);
            var isOldIE = goog.IS_OLD_IE_;
            if (isOldIE) {
                goog.dependencies_.deferred[originalPath] =
                    execModuleScript;
                goog.queuedModules_.push(originalPath)
            } else importScript(src, execModuleScript)
        } else throw new Error("load of " + src + "failed");
    }
};
goog.typeOf = function(value) {
    var s = typeof value;
    if (s == "object")
        if (value) {
            if (value instanceof Array) return "array";
            else if (value instanceof Object) return s;
            var className = Object.prototype.toString.call((value));
            if (className == "[object Window]") return "object";
            if (className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) return "array";
            if (className == "[object Function]" || typeof value.call !=
                "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) return "function"
        } else return "null";
    else if (s == "function" && typeof value.call == "undefined") return "object";
    return s
};
goog.isNull = function(val) {
    return val === null
};
goog.isDefAndNotNull = function(val) {
    return val != null
};
goog.isArray = function(val) {
    return goog.typeOf(val) == "array"
};
goog.isArrayLike = function(val) {
    var type = goog.typeOf(val);
    return type == "array" || type == "object" && typeof val.length == "number"
};
goog.isDateLike = function(val) {
    return goog.isObject(val) && typeof val.getFullYear == "function"
};
goog.isString = function(val) {
    return typeof val == "string"
};
goog.isBoolean = function(val) {
    return typeof val == "boolean"
};
goog.isNumber = function(val) {
    return typeof val == "number"
};
goog.isFunction = function(val) {
    return goog.typeOf(val) == "function"
};
goog.isObject = function(val) {
    var type = typeof val;
    return type == "object" && val != null || type == "function"
};
goog.getUid = function(obj) {
    return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.hasUid = function(obj) {
    return !!obj[goog.UID_PROPERTY_]
};
goog.removeUid = function(obj) {
    if ("removeAttribute" in obj) obj.removeAttribute(goog.UID_PROPERTY_);
    try {
        delete obj[goog.UID_PROPERTY_]
    } catch (ex) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1E9 >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
    var type = goog.typeOf(obj);
    if (type == "object" || type == "array") {
        if (obj.clone) return obj.clone();
        var clone = type == "array" ? [] : {};
        for (var key in obj) clone[key] = goog.cloneObject(obj[key]);
        return clone
    }
    return obj
};
goog.bindNative_ = function(fn, selfObj, var_args) {
    return (fn.call.apply(fn.bind, arguments))
};
goog.bindJs_ = function(fn, selfObj, var_args) {
    if (!fn) throw new Error;
    if (arguments.length > 2) {
        var boundArgs = Array.prototype.slice.call(arguments, 2);
        return function() {
            var newArgs = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(newArgs, boundArgs);
            return fn.apply(selfObj, newArgs)
        }
    } else return function() {
        return fn.apply(selfObj, arguments)
    }
};
goog.bind = function(fn, selfObj, var_args) {
    if (Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) goog.bind = goog.bindNative_;
    else goog.bind = goog.bindJs_;
    return goog.bind.apply(null, arguments)
};
goog.partial = function(fn, var_args) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var newArgs = args.slice();
        newArgs.push.apply(newArgs, arguments);
        return fn.apply(this, newArgs)
    }
};
goog.mixin = function(target, source) {
    for (var x in source) target[x] = source[x]
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
    return +new Date
};
goog.globalEval = function(script) {
    if (goog.global.execScript) goog.global.execScript(script, "JavaScript");
    else if (goog.global.eval) {
        if (goog.evalWorksForGlobals_ == null) {
            goog.global.eval("var _et_ = 1;");
            if (typeof goog.global["_et_"] != "undefined") {
                delete goog.global["_et_"];
                goog.evalWorksForGlobals_ = true
            } else goog.evalWorksForGlobals_ = false
        }
        if (goog.evalWorksForGlobals_) goog.global.eval(script);
        else {
            var doc = goog.global.document;
            var scriptElt = doc.createElement("SCRIPT");
            scriptElt.type = "text/javascript";
            scriptElt.defer = false;
            scriptElt.appendChild(doc.createTextNode(script));
            doc.body.appendChild(scriptElt);
            doc.body.removeChild(scriptElt)
        }
    } else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
    var getMapping = function(cssName) {
        return goog.cssNameMapping_[cssName] || cssName
    };
    var renameByParts = function(cssName) {
        var parts = cssName.split("-");
        var mapped = [];
        for (var i = 0; i < parts.length; i++) mapped.push(getMapping(parts[i]));
        return mapped.join("-")
    };
    var rename;
    if (goog.cssNameMapping_) rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts;
    else rename = function(a) {
        return a
    };
    if (opt_modifier) return className + "-" + rename(opt_modifier);
    else return rename(className)
};
goog.setCssNameMapping = function(mapping, opt_style) {
    goog.cssNameMapping_ = mapping;
    goog.cssNameMappingStyle_ = opt_style
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
goog.getMsg = function(str, opt_values) {
    if (opt_values) str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
        return key in opt_values ? opt_values[key] : match
    });
    return str
};
goog.getMsgWithFallback = function(a, b) {
    return a
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
    goog.exportPath_(publicPath, object, opt_objectToExportTo)
};
goog.exportProperty = function(object, publicName, symbol) {
    object[publicName] = symbol
};
goog.inherits = function(childCtor, parentCtor) {
    function tempCtor() {}
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor;
    childCtor.prototype.constructor = childCtor;
    childCtor.base = function(me, methodName, var_args) {
        var args = new Array(arguments.length - 2);
        for (var i = 2; i < arguments.length; i++) args[i - 2] = arguments[i];
        return parentCtor.prototype[methodName].apply(me, args)
    }
};
goog.base = function(me, opt_methodName, var_args) {
    var caller = arguments.callee.caller;
    if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) throw Error("arguments.caller not defined.  goog.base() cannot be used " + "with strict mode code. See " + "http://www.ecma-international.org/ecma-262/5.1/#sec-C");
    if (caller.superClass_) {
        var ctorArgs = new Array(arguments.length - 1);
        for (var i = 1; i < arguments.length; i++) ctorArgs[i - 1] = arguments[i];
        return caller.superClass_.constructor.apply(me, ctorArgs)
    }
    var args = new Array(arguments.length -
        2);
    for (var i = 2; i < arguments.length; i++) args[i - 2] = arguments[i];
    var foundCaller = false;
    for (var ctor = me.constructor; ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor)
        if (ctor.prototype[opt_methodName] === caller) foundCaller = true;
        else if (foundCaller) return ctor.prototype[opt_methodName].apply(me, args);
    if (me[opt_methodName] === caller) return me.constructor.prototype[opt_methodName].apply(me, args);
    else throw Error("goog.base called from a method of one name " + "to a method of a different name");
};
goog.scope = function(fn) {
    fn.call(goog.global)
};
if (!COMPILED) goog.global["COMPILED"] = COMPILED;
goog.defineClass = function(superClass, def) {
    var constructor = def.constructor;
    var statics = def.statics;
    if (!constructor || constructor == Object.prototype.constructor) constructor = function() {
        throw Error("cannot instantiate an interface (no constructor defined).");
    };
    var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
    if (superClass) goog.inherits(cls, superClass);
    delete def.constructor;
    delete def.statics;
    goog.defineClass.applyProperties_(cls.prototype, def);
    if (statics != null)
        if (statics instanceof Function) statics(cls);
        else goog.defineClass.applyProperties_(cls, statics);
    return cls
};
goog.defineClass.ClassDescriptor;
goog.define("goog.defineClass.SEAL_CLASS_INSTANCES", goog.DEBUG);
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
    if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
        if (superClass && superClass.prototype && superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) return ctr;
        var wrappedCtr = function() {
            var instance = ctr.apply(this, arguments) || this;
            instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
            if (this.constructor === wrappedCtr) Object.seal(instance);
            return instance
        };
        return wrappedCtr
    }
    return ctr
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.defineClass.applyProperties_ = function(target, source) {
    var key;
    for (key in source)
        if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
    for (var i = 0; i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; i++) {
        key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
        if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key]
    }
};
goog.tagUnsealableClass = function(ctr) {
    if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.provide("shaka.util.PublicPromise");
shaka.util.PublicPromise = function() {
    var resolvePromise;
    var rejectPromise;
    var promise = new Promise(function(resolve, reject) {
        resolvePromise = resolve;
        rejectPromise = reject
    });
    promise.resolve = resolvePromise;
    promise.reject = rejectPromise;
    return promise
};
shaka.util.PublicPromise.prototype.resolve;
shaka.util.PublicPromise.prototype.reject;
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.define("goog.string.DETECT_DOUBLE_ESCAPING", false);
goog.define("goog.string.FORCE_NON_DOM_HTML_UNESCAPING", false);
goog.string.Unicode = {
    NBSP: "\u00a0"
};
goog.string.startsWith = function(str, prefix) {
    return str.lastIndexOf(prefix, 0) == 0
};
goog.string.endsWith = function(str, suffix) {
    var l = str.length - suffix.length;
    return l >= 0 && str.indexOf(suffix, l) == l
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
    return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
    return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
    return str1.toLowerCase() == str2.toLowerCase()
};
goog.string.subs = function(str, var_args) {
    var splitParts = str.split("%s");
    var returnString = "";
    var subsArguments = Array.prototype.slice.call(arguments, 1);
    while (subsArguments.length && splitParts.length > 1) returnString += splitParts.shift() + subsArguments.shift();
    return returnString + splitParts.join("%s")
};
goog.string.collapseWhitespace = function(str) {
    return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmptyOrWhitespace = function(str) {
    return /^[\s\xa0]*$/.test(str)
};
goog.string.isEmptyString = function(str) {
    return str.length == 0
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(str) {
    return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str))
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(str) {
    return !/[^\t\n\r ]/.test(str)
};
goog.string.isAlpha = function(str) {
    return !/[^a-zA-Z]/.test(str)
};
goog.string.isNumeric = function(str) {
    return !/[^0-9]/.test(str)
};
goog.string.isAlphaNumeric = function(str) {
    return !/[^a-zA-Z0-9]/.test(str)
};
goog.string.isSpace = function(ch) {
    return ch == " "
};
goog.string.isUnicodeChar = function(ch) {
    return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd"
};
goog.string.stripNewlines = function(str) {
    return str.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(str) {
    return str.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(str) {
    return str.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(str) {
    return str.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(str) {
    return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(str) {
    return str.trim()
} : function(str) {
    return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(str) {
    return str.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(str) {
    return str.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
    var test1 = String(str1).toLowerCase();
    var test2 = String(str2).toLowerCase();
    if (test1 < test2) return -1;
    else if (test1 == test2) return 0;
    else return 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
    if (str1 == str2) return 0;
    if (!str1) return -1;
    if (!str2) return 1;
    var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
    var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
    var count = Math.min(tokens1.length, tokens2.length);
    for (var i = 0; i < count; i++) {
        var a = tokens1[i];
        var b = tokens2[i];
        if (a != b) {
            var num1 = parseInt(a, 10);
            if (!isNaN(num1)) {
                var num2 = parseInt(b, 10);
                if (!isNaN(num2) && num1 - num2) return num1 - num2
            }
            return a < b ? -1 : 1
        }
    }
    if (tokens1.length !=
        tokens2.length) return tokens1.length - tokens2.length;
    return str1 < str2 ? -1 : 1
};
goog.string.urlEncode = function(str) {
    return encodeURIComponent(String(str))
};
goog.string.urlDecode = function(str) {
    return decodeURIComponent(str.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(str, opt_xml) {
    return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
    if (opt_isLikelyToContainHtmlChars) {
        str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;");
        if (goog.string.DETECT_DOUBLE_ESCAPING) str = str.replace(goog.string.E_RE_, "&#101;");
        return str
    } else {
        if (!goog.string.ALL_RE_.test(str)) return str;
        if (str.indexOf("&") !=
            -1) str = str.replace(goog.string.AMP_RE_, "&amp;");
        if (str.indexOf("<") != -1) str = str.replace(goog.string.LT_RE_, "&lt;");
        if (str.indexOf(">") != -1) str = str.replace(goog.string.GT_RE_, "&gt;");
        if (str.indexOf('"') != -1) str = str.replace(goog.string.QUOT_RE_, "&quot;");
        if (str.indexOf("'") != -1) str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;");
        if (str.indexOf("\x00") != -1) str = str.replace(goog.string.NULL_RE_, "&#0;");
        if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf("e") != -1) str = str.replace(goog.string.E_RE_, "&#101;");
        return str
    }
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
    if (goog.string.contains(str, "&"))
        if (!goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global) return goog.string.unescapeEntitiesUsingDom_(str);
        else return goog.string.unescapePureXmlEntities_(str);
    return str
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
    if (goog.string.contains(str, "&")) return goog.string.unescapeEntitiesUsingDom_(str, document);
    return str
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
    var seen = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"'
    };
    var div;
    if (opt_document) div = opt_document.createElement("div");
    else div = goog.global.document.createElement("div");
    return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
        var value = seen[s];
        if (value) return value;
        if (entity.charAt(0) == "#") {
            var n = Number("0" + entity.substr(1));
            if (!isNaN(n)) value = String.fromCharCode(n)
        }
        if (!value) {
            div.innerHTML = s + " ";
            value = div.firstChild.nodeValue.slice(0, -1)
        }
        return seen[s] = value
    })
};
goog.string.unescapePureXmlEntities_ = function(str) {
    return str.replace(/&([^;]+);/g, function(s, entity) {
        switch (entity) {
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            case "quot":
                return '"';
            default:
                if (entity.charAt(0) == "#") {
                    var n = Number("0" + entity.substr(1));
                    if (!isNaN(n)) return String.fromCharCode(n)
                }
                return s
        }
    })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
    return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml)
};
goog.string.preserveSpaces = function(str) {
    return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP)
};
goog.string.stripQuotes = function(str, quoteChars) {
    var length = quoteChars.length;
    for (var i = 0; i < length; i++) {
        var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
        if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) return str.substring(1, str.length - 1)
    }
    return str
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
    if (opt_protectEscapedCharacters) str = goog.string.unescapeEntities(str);
    if (str.length > chars) str = str.substring(0, chars - 3) + "...";
    if (opt_protectEscapedCharacters) str = goog.string.htmlEscape(str);
    return str
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
    if (opt_protectEscapedCharacters) str = goog.string.unescapeEntities(str);
    if (opt_trailingChars && str.length > chars) {
        if (opt_trailingChars > chars) opt_trailingChars = chars;
        var endPoint = str.length - opt_trailingChars;
        var startPoint = chars - opt_trailingChars;
        str = str.substring(0, startPoint) + "..." + str.substring(endPoint)
    } else if (str.length > chars) {
        var half = Math.floor(chars / 2);
        var endPos = str.length - half;
        half += chars % 2;
        str = str.substring(0,
            half) + "..." + str.substring(endPos)
    }
    if (opt_protectEscapedCharacters) str = goog.string.htmlEscape(str);
    return str
};
goog.string.specialEscapeChars_ = {
    "\x00": "\\0",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\x0B": "\\x0B",
    '"': '\\"',
    "\\": "\\\\"
};
goog.string.jsEscapeCache_ = {
    "'": "\\'"
};
goog.string.quote = function(s) {
    s = String(s);
    if (s.quote) return s.quote();
    else {
        var sb = ['"'];
        for (var i = 0; i < s.length; i++) {
            var ch = s.charAt(i);
            var cc = ch.charCodeAt(0);
            sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch))
        }
        sb.push('"');
        return sb.join("")
    }
};
goog.string.escapeString = function(str) {
    var sb = [];
    for (var i = 0; i < str.length; i++) sb[i] = goog.string.escapeChar(str.charAt(i));
    return sb.join("")
};
goog.string.escapeChar = function(c) {
    if (c in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[c];
    if (c in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
    var rv = c;
    var cc = c.charCodeAt(0);
    if (cc > 31 && cc < 127) rv = c;
    else {
        if (cc < 256) {
            rv = "\\x";
            if (cc < 16 || cc > 256) rv += "0"
        } else {
            rv = "\\u";
            if (cc < 4096) rv += "0"
        }
        rv += cc.toString(16).toUpperCase()
    }
    return goog.string.jsEscapeCache_[c] = rv
};
goog.string.contains = function(str, subString) {
    return str.indexOf(subString) != -1
};
goog.string.caseInsensitiveContains = function(str, subString) {
    return goog.string.contains(str.toLowerCase(), subString.toLowerCase())
};
goog.string.countOf = function(s, ss) {
    return s && ss ? s.split(ss).length - 1 : 0
};
goog.string.removeAt = function(s, index, stringLength) {
    var resultStr = s;
    if (index >= 0 && index < s.length && stringLength > 0) resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength);
    return resultStr
};
goog.string.remove = function(s, ss) {
    var re = new RegExp(goog.string.regExpEscape(ss), "");
    return s.replace(re, "")
};
goog.string.removeAll = function(s, ss) {
    var re = new RegExp(goog.string.regExpEscape(ss), "g");
    return s.replace(re, "")
};
goog.string.regExpEscape = function(s) {
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(string, length) {
    return (new Array(length + 1)).join(string)
};
goog.string.padNumber = function(num, length, opt_precision) {
    var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
    var index = s.indexOf(".");
    if (index == -1) index = s.length;
    return goog.string.repeat("0", Math.max(0, length - index)) + s
};
goog.string.makeSafe = function(obj) {
    return obj == null ? "" : String(obj)
};
goog.string.buildString = function(var_args) {
    return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
    var x = 2147483648;
    return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(version1, version2) {
    var order = 0;
    var v1Subs = goog.string.trim(String(version1)).split(".");
    var v2Subs = goog.string.trim(String(version2)).split(".");
    var subCount = Math.max(v1Subs.length, v2Subs.length);
    for (var subIdx = 0; order == 0 && subIdx < subCount; subIdx++) {
        var v1Sub = v1Subs[subIdx] || "";
        var v2Sub = v2Subs[subIdx] || "";
        var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
        var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
        do {
            var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
            var v2Comp =
                v2CompParser.exec(v2Sub) || ["", "", ""];
            if (v1Comp[0].length == 0 && v2Comp[0].length == 0) break;
            var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
            var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
            order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2])
        } while (order == 0)
    }
    return order
};
goog.string.compareElements_ = function(left, right) {
    if (left < right) return -1;
    else if (left > right) return 1;
    return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
    var result = 0;
    for (var i = 0; i < str.length; ++i) {
        result = 31 * result + str.charCodeAt(i);
        result %= goog.string.HASHCODE_MAX_
    }
    return result
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
    return "goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(str) {
    var num = Number(str);
    if (num == 0 && goog.string.isEmptyOrWhitespace(str)) return NaN;
    return num
};
goog.string.isLowerCamelCase = function(str) {
    return /^[a-z]+([A-Z][a-z]*)*$/.test(str)
};
goog.string.isUpperCamelCase = function(str) {
    return /^([A-Z][a-z]*)+$/.test(str)
};
goog.string.toCamelCase = function(str) {
    return String(str).replace(/\-([a-z])/g, function(all, match) {
        return match.toUpperCase()
    })
};
goog.string.toSelectorCase = function(str) {
    return String(str).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(str, opt_delimiters) {
    var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
    delimiters = delimiters ? "|[" + delimiters + "]+" : "";
    var regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
    return str.replace(regexp, function(all, p1, p2) {
        return p1 + p2.toUpperCase()
    })
};
goog.string.capitalize = function(str) {
    return String(str.charAt(0)).toUpperCase() + String(str.substr(1)).toLowerCase()
};
goog.string.parseInt = function(value) {
    if (isFinite(value)) value = String(value);
    if (goog.isString(value)) return /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
    return NaN
};
goog.string.splitLimit = function(str, separator, limit) {
    var parts = str.split(separator);
    var returnVal = [];
    while (limit > 0 && parts.length) {
        returnVal.push(parts.shift());
        limit--
    }
    if (parts.length) returnVal.push(parts.join(separator));
    return returnVal
};
goog.string.editDistance = function(a, b) {
    var v0 = [];
    var v1 = [];
    if (a == b) return 0;
    if (!a.length || !b.length) return Math.max(a.length, b.length);
    for (var i = 0; i < b.length + 1; i++) v0[i] = i;
    for (var i = 0; i < a.length; i++) {
        v1[0] = i + 1;
        for (var j = 0; j < b.length; j++) {
            var cost = a[i] != b[j];
            v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost)
        }
        for (var j = 0; j < v0.length; j++) v0[j] = v1[j]
    }
    return v1[b.length]
};
goog.provide("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
    var navigator = goog.labs.userAgent.util.getNavigator_();
    if (navigator) {
        var userAgent = navigator.userAgent;
        if (userAgent) return userAgent
    }
    return ""
};
goog.labs.userAgent.util.getNavigator_ = function() {
    return goog.global.navigator
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(opt_userAgent) {
    goog.labs.userAgent.util.userAgent_ = opt_userAgent || goog.labs.userAgent.util.getNativeUserAgentString_()
};
goog.labs.userAgent.util.getUserAgent = function() {
    return goog.labs.userAgent.util.userAgent_
};
goog.labs.userAgent.util.matchUserAgent = function(str) {
    var userAgent = goog.labs.userAgent.util.getUserAgent();
    return goog.string.contains(userAgent, str)
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(str) {
    var userAgent = goog.labs.userAgent.util.getUserAgent();
    return goog.string.caseInsensitiveContains(userAgent, str)
};
goog.labs.userAgent.util.extractVersionTuples = function(userAgent) {
    var versionRegExp = new RegExp("(\\w[\\w ]+)" + "/" + "([^\\s]+)" + "\\s*" + "(?:\\((.*?)\\))?", "g");
    var data = [];
    var match;
    while (match = versionRegExp.exec(userAgent)) data.push([match[1], match[2], match[3] || undefined]);
    return data
};
goog.provide("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.platform.isAndroid = function() {
    return goog.labs.userAgent.util.matchUserAgent("Android")
};
goog.labs.userAgent.platform.isIpod = function() {
    return goog.labs.userAgent.util.matchUserAgent("iPod")
};
goog.labs.userAgent.platform.isIphone = function() {
    return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad")
};
goog.labs.userAgent.platform.isIpad = function() {
    return goog.labs.userAgent.util.matchUserAgent("iPad")
};
goog.labs.userAgent.platform.isIos = function() {
    return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod()
};
goog.labs.userAgent.platform.isMacintosh = function() {
    return goog.labs.userAgent.util.matchUserAgent("Macintosh")
};
goog.labs.userAgent.platform.isLinux = function() {
    return goog.labs.userAgent.util.matchUserAgent("Linux")
};
goog.labs.userAgent.platform.isWindows = function() {
    return goog.labs.userAgent.util.matchUserAgent("Windows")
};
goog.labs.userAgent.platform.isChromeOS = function() {
    return goog.labs.userAgent.util.matchUserAgent("CrOS")
};
goog.labs.userAgent.platform.getVersion = function() {
    var userAgentString = goog.labs.userAgent.util.getUserAgent();
    var version = "",
        re;
    if (goog.labs.userAgent.platform.isWindows()) {
        re = /Windows (?:NT|Phone) ([0-9.]+)/;
        var match = re.exec(userAgentString);
        if (match) version = match[1];
        else version = "0.0"
    } else if (goog.labs.userAgent.platform.isIos()) {
        re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
        var match = re.exec(userAgentString);
        version = match && match[1].replace(/_/g, ".")
    } else if (goog.labs.userAgent.platform.isMacintosh()) {
        re =
            /Mac OS X ([0-9_.]+)/;
        var match = re.exec(userAgentString);
        version = match ? match[1].replace(/_/g, ".") : "10"
    } else if (goog.labs.userAgent.platform.isAndroid()) {
        re = /Android\s+([^\);]+)(\)|;)/;
        var match = re.exec(userAgentString);
        version = match && match[1]
    } else if (goog.labs.userAgent.platform.isChromeOS()) {
        re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
        var match = re.exec(userAgentString);
        version = match && match[1]
    }
    return version || ""
};
goog.labs.userAgent.platform.isVersionOrHigher = function(version) {
    return goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), version) >= 0
};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
    for (var key in obj) f.call(opt_obj, obj[key], key, obj)
};
goog.object.filter = function(obj, f, opt_obj) {
    var res = {};
    for (var key in obj)
        if (f.call(opt_obj, obj[key], key, obj)) res[key] = obj[key];
    return res
};
goog.object.map = function(obj, f, opt_obj) {
    var res = {};
    for (var key in obj) res[key] = f.call(opt_obj, obj[key], key, obj);
    return res
};
goog.object.some = function(obj, f, opt_obj) {
    for (var key in obj)
        if (f.call(opt_obj, obj[key], key, obj)) return true;
    return false
};
goog.object.every = function(obj, f, opt_obj) {
    for (var key in obj)
        if (!f.call(opt_obj, obj[key], key, obj)) return false;
    return true
};
goog.object.getCount = function(obj) {
    var rv = 0;
    for (var key in obj) rv++;
    return rv
};
goog.object.getAnyKey = function(obj) {
    for (var key in obj) return key
};
goog.object.getAnyValue = function(obj) {
    for (var key in obj) return obj[key]
};
goog.object.contains = function(obj, val) {
    return goog.object.containsValue(obj, val)
};
goog.object.getValues = function(obj) {
    var res = [];
    var i = 0;
    for (var key in obj) res[i++] = obj[key];
    return res
};
goog.object.getKeys = function(obj) {
    var res = [];
    var i = 0;
    for (var key in obj) res[i++] = key;
    return res
};
goog.object.getValueByKeys = function(obj, var_args) {
    var isArrayLike = goog.isArrayLike(var_args);
    var keys = isArrayLike ? var_args : arguments;
    for (var i = isArrayLike ? 0 : 1; i < keys.length; i++) {
        obj = obj[keys[i]];
        if (!goog.isDef(obj)) break
    }
    return obj
};
goog.object.containsKey = function(obj, key) {
    return key in obj
};
goog.object.containsValue = function(obj, val) {
    for (var key in obj)
        if (obj[key] == val) return true;
    return false
};
goog.object.findKey = function(obj, f, opt_this) {
    for (var key in obj)
        if (f.call(opt_this, obj[key], key, obj)) return key;
    return undefined
};
goog.object.findValue = function(obj, f, opt_this) {
    var key = goog.object.findKey(obj, f, opt_this);
    return key && obj[key]
};
goog.object.isEmpty = function(obj) {
    for (var key in obj) return false;
    return true
};
goog.object.clear = function(obj) {
    for (var i in obj) delete obj[i]
};
goog.object.remove = function(obj, key) {
    var rv;
    if (rv = key in obj) delete obj[key];
    return rv
};
goog.object.add = function(obj, key, val) {
    if (key in obj) throw Error('The object already contains the key "' + key + '"');
    goog.object.set(obj, key, val)
};
goog.object.get = function(obj, key, opt_val) {
    if (key in obj) return obj[key];
    return opt_val
};
goog.object.set = function(obj, key, value) {
    obj[key] = value
};
goog.object.setIfUndefined = function(obj, key, value) {
    return key in obj ? obj[key] : obj[key] = value
};
goog.object.setWithReturnValueIfNotSet = function(obj, key, f) {
    if (key in obj) return obj[key];
    var val = f();
    obj[key] = val;
    return val
};
goog.object.equals = function(a, b) {
    for (var k in a)
        if (!(k in b) || a[k] !== b[k]) return false;
    for (var k in b)
        if (!(k in a)) return false;
    return true
};
goog.object.clone = function(obj) {
    var res = {};
    for (var key in obj) res[key] = obj[key];
    return res
};
goog.object.unsafeClone = function(obj) {
    var type = goog.typeOf(obj);
    if (type == "object" || type == "array") {
        if (obj.clone) return obj.clone();
        var clone = type == "array" ? [] : {};
        for (var key in obj) clone[key] = goog.object.unsafeClone(obj[key]);
        return clone
    }
    return obj
};
goog.object.transpose = function(obj) {
    var transposed = {};
    for (var key in obj) transposed[obj[key]] = key;
    return transposed
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
    var key, source;
    for (var i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (key in source) target[key] = source[key];
        for (var j = 0; j < goog.object.PROTOTYPE_FIELDS_.length; j++) {
            key = goog.object.PROTOTYPE_FIELDS_[j];
            if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key]
        }
    }
};
goog.object.create = function(var_args) {
    var argLength = arguments.length;
    if (argLength == 1 && goog.isArray(arguments[0])) return goog.object.create.apply(null, arguments[0]);
    if (argLength % 2) throw Error("Uneven number of arguments");
    var rv = {};
    for (var i = 0; i < argLength; i += 2) rv[arguments[i]] = arguments[i + 1];
    return rv
};
goog.object.createSet = function(var_args) {
    var argLength = arguments.length;
    if (argLength == 1 && goog.isArray(arguments[0])) return goog.object.createSet.apply(null, arguments[0]);
    var rv = {};
    for (var i = 0; i < argLength; i++) rv[arguments[i]] = true;
    return rv
};
goog.object.createImmutableView = function(obj) {
    var result = obj;
    if (Object.isFrozen && !Object.isFrozen(obj)) {
        result = Object.create(obj);
        Object.freeze(result)
    }
    return result
};
goog.object.isImmutableView = function(obj) {
    return !!Object.isFrozen && Object.isFrozen(obj)
};
goog.provide("goog.dom.NodeType");
goog.dom.NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    CDATA_SECTION: 4,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    PROCESSING_INSTRUCTION: 7,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    NOTATION: 12
};
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, goog.debug.Error);
    else {
        var stack = (new Error).stack;
        if (stack) this.stack = stack
    }
    if (opt_msg) this.message = String(opt_msg);
    this.reportErrorToServer = true
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.dom.NodeType");
goog.require("goog.string");
goog.define("goog.asserts.ENABLE_ASSERTS", goog.DEBUG);
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
    messageArgs.unshift(messagePattern);
    goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
    messageArgs.shift();
    this.messagePattern = messagePattern
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
    throw e;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
    var message = "Assertion failed";
    if (givenMessage) {
        message += ": " + givenMessage;
        var args = givenArgs
    } else if (defaultMessage) {
        message += ": " + defaultMessage;
        args = defaultArgs
    }
    var e = new goog.asserts.AssertionError("" + message, args || []);
    goog.asserts.errorHandler_(e)
};
goog.asserts.setErrorHandler = function(errorHandler) {
    if (goog.asserts.ENABLE_ASSERTS) goog.asserts.errorHandler_ = errorHandler
};
goog.asserts.assert = function(condition, opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS && !condition) goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
    return condition
};
goog.asserts.fail = function(opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS) goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)))
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
    return (value)
};
goog.asserts.assertString = function(value, opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
    return (value)
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
    return (value)
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
    return (value)
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
    return (value)
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
    return (value)
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
    return (value)
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
    if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3));
    return value
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
    for (var key in Object.prototype) goog.asserts.fail(key + " should not be enumerable in Object.prototype.")
};
goog.asserts.getType_ = function(value) {
    if (value instanceof Function) return value.displayName || value.name || "unknown type name";
    else if (value instanceof Object) return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value);
    else return value === null ? "null" : typeof value
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.define("goog.NATIVE_ARRAY_PROTOTYPES", goog.TRUSTED_SITE);
goog.define("goog.array.ASSUME_NATIVE_FUNCTIONS", false);
goog.array.ArrayLike;
goog.array.peek = function(array) {
    return array[array.length - 1]
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(arr, obj, opt_fromIndex) {
    goog.asserts.assert(arr.length != null);
    return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex)
} : function(arr, obj, opt_fromIndex) {
    var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
    if (goog.isString(arr)) {
        if (!goog.isString(obj) || obj.length != 1) return -1;
        return arr.indexOf(obj, fromIndex)
    }
    for (var i =
            fromIndex; i < arr.length; i++)
        if (i in arr && arr[i] === obj) return i;
    return -1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
    goog.asserts.assert(arr.length != null);
    var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
    return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex)
} : function(arr, obj, opt_fromIndex) {
    var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
    if (fromIndex < 0) fromIndex = Math.max(0, arr.length + fromIndex);
    if (goog.isString(arr)) {
        if (!goog.isString(obj) ||
            obj.length != 1) return -1;
        return arr.lastIndexOf(obj, fromIndex)
    }
    for (var i = fromIndex; i >= 0; i--)
        if (i in arr && arr[i] === obj) return i;
    return -1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(arr, f, opt_obj) {
    goog.asserts.assert(arr.length != null);
    goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
    var l = arr.length;
    var arr2 = goog.isString(arr) ? arr.split("") : arr;
    for (var i = 0; i < l; i++)
        if (i in arr2) f.call(opt_obj, arr2[i], i, arr)
};
goog.array.forEachRight = function(arr, f, opt_obj) {
    var l = arr.length;
    var arr2 = goog.isString(arr) ? arr.split("") : arr;
    for (var i = l - 1; i >= 0; --i)
        if (i in arr2) f.call(opt_obj, arr2[i], i, arr)
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(arr, f, opt_obj) {
    goog.asserts.assert(arr.length != null);
    return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
    var l = arr.length;
    var res = [];
    var resLength = 0;
    var arr2 = goog.isString(arr) ? arr.split("") : arr;
    for (var i = 0; i < l; i++)
        if (i in arr2) {
            var val = arr2[i];
            if (f.call(opt_obj, val, i, arr)) res[resLength++] = val
        }
    return res
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(arr, f, opt_obj) {
    goog.asserts.assert(arr.length != null);
    return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
    var l = arr.length;
    var res = new Array(l);
    var arr2 = goog.isString(arr) ? arr.split("") : arr;
    for (var i = 0; i < l; i++)
        if (i in arr2) res[i] = f.call(opt_obj, arr2[i], i, arr);
    return res
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(arr, f, val, opt_obj) {
    goog.asserts.assert(arr.length != null);
    if (opt_obj) f = goog.bind(f, opt_obj);
    return goog.array.ARRAY_PROTOTYPE_.reduce.call(arr, f, val)
} : function(arr, f, val, opt_obj) {
    var rval = val;
    goog.array.forEach(arr, function(val, index) {
        rval = f.call(opt_obj, rval, val, index, arr)
    });
    return rval
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(arr, f, val, opt_obj) {
    goog.asserts.assert(arr.length != null);
    if (opt_obj) f = goog.bind(f, opt_obj);
    return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(arr, f, val)
} : function(arr, f, val, opt_obj) {
    var rval = val;
    goog.array.forEachRight(arr, function(val, index) {
        rval = f.call(opt_obj, rval, val, index, arr)
    });
    return rval
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(arr, f, opt_obj) {
    goog.asserts.assert(arr.length != null);
    return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
    var l = arr.length;
    var arr2 = goog.isString(arr) ? arr.split("") : arr;
    for (var i = 0; i < l; i++)
        if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) return true;
    return false
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(arr, f, opt_obj) {
    goog.asserts.assert(arr.length != null);
    return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
    var l = arr.length;
    var arr2 = goog.isString(arr) ? arr.split("") : arr;
    for (var i = 0; i < l; i++)
        if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) return false;
    return true
};
goog.array.count = function(arr, f, opt_obj) {
    var count = 0;
    goog.array.forEach(arr, function(element, index, arr) {
        if (f.call(opt_obj, element, index, arr)) ++count
    }, opt_obj);
    return count
};
goog.array.find = function(arr, f, opt_obj) {
    var i = goog.array.findIndex(arr, f, opt_obj);
    return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndex = function(arr, f, opt_obj) {
    var l = arr.length;
    var arr2 = goog.isString(arr) ? arr.split("") : arr;
    for (var i = 0; i < l; i++)
        if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) return i;
    return -1
};
goog.array.findRight = function(arr, f, opt_obj) {
    var i = goog.array.findIndexRight(arr, f, opt_obj);
    return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
    var l = arr.length;
    var arr2 = goog.isString(arr) ? arr.split("") : arr;
    for (var i = l - 1; i >= 0; i--)
        if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) return i;
    return -1
};
goog.array.contains = function(arr, obj) {
    return goog.array.indexOf(arr, obj) >= 0
};
goog.array.isEmpty = function(arr) {
    return arr.length == 0
};
goog.array.clear = function(arr) {
    if (!goog.isArray(arr))
        for (var i = arr.length - 1; i >= 0; i--) delete arr[i];
    arr.length = 0
};
goog.array.insert = function(arr, obj) {
    if (!goog.array.contains(arr, obj)) arr.push(obj)
};
goog.array.insertAt = function(arr, obj, opt_i) {
    goog.array.splice(arr, opt_i, 0, obj)
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
    goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd)
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
    var i;
    if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) arr.push(obj);
    else goog.array.insertAt(arr, obj, i)
};
goog.array.remove = function(arr, obj) {
    var i = goog.array.indexOf(arr, obj);
    var rv;
    if (rv = i >= 0) goog.array.removeAt(arr, i);
    return rv
};
goog.array.removeAt = function(arr, i) {
    goog.asserts.assert(arr.length != null);
    return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1
};
goog.array.removeIf = function(arr, f, opt_obj) {
    var i = goog.array.findIndex(arr, f, opt_obj);
    if (i >= 0) {
        goog.array.removeAt(arr, i);
        return true
    }
    return false
};
goog.array.removeAllIf = function(arr, f, opt_obj) {
    var removedCount = 0;
    goog.array.forEachRight(arr, function(val, index) {
        if (f.call(opt_obj, val, index, arr))
            if (goog.array.removeAt(arr, index)) removedCount++
    });
    return removedCount
};
goog.array.concat = function(var_args) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.join = function(var_args) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(object) {
    var length = object.length;
    if (length > 0) {
        var rv = new Array(length);
        for (var i = 0; i < length; i++) rv[i] = object[i];
        return rv
    }
    return []
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
    for (var i = 1; i < arguments.length; i++) {
        var arr2 = arguments[i];
        if (goog.isArrayLike(arr2)) {
            var len1 = arr1.length || 0;
            var len2 = arr2.length || 0;
            arr1.length = len1 + len2;
            for (var j = 0; j < len2; j++) arr1[len1 + j] = arr2[j]
        } else arr1.push(arr2)
    }
};
goog.array.splice = function(arr, index, howMany, var_args) {
    goog.asserts.assert(arr.length != null);
    return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1))
};
goog.array.slice = function(arr, start, opt_end) {
    goog.asserts.assert(arr.length != null);
    if (arguments.length <= 2) return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start);
    else return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end)
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
    var returnArray = opt_rv || arr;
    var defaultHashFn = function(item) {
        return goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current
    };
    var hashFn = opt_hashFn || defaultHashFn;
    var seen = {},
        cursorInsert = 0,
        cursorRead = 0;
    while (cursorRead < arr.length) {
        var current = arr[cursorRead++];
        var key = hashFn(current);
        if (!Object.prototype.hasOwnProperty.call(seen, key)) {
            seen[key] = true;
            returnArray[cursorInsert++] = current
        }
    }
    returnArray.length = cursorInsert
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
    return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target)
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
    return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj)
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
    var left = 0;
    var right = arr.length;
    var found;
    while (left < right) {
        var middle = left + right >> 1;
        var compareResult;
        if (isEvaluator) compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
        else compareResult = compareFn(opt_target, arr[middle]);
        if (compareResult > 0) left = middle + 1;
        else {
            right = middle;
            found = !compareResult
        }
    }
    return found ? left : ~left
};
goog.array.sort = function(arr, opt_compareFn) {
    arr.sort(opt_compareFn || goog.array.defaultCompare)
};
goog.array.stableSort = function(arr, opt_compareFn) {
    for (var i = 0; i < arr.length; i++) arr[i] = {
        index: i,
        value: arr[i]
    };
    var valueCompareFn = opt_compareFn || goog.array.defaultCompare;

    function stableCompareFn(obj1, obj2) {
        return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index
    }
    goog.array.sort(arr, stableCompareFn);
    for (var i = 0; i < arr.length; i++) arr[i] = arr[i].value
};
goog.array.sortByKey = function(arr, keyFn, opt_compareFn) {
    var keyCompareFn = opt_compareFn || goog.array.defaultCompare;
    goog.array.sort(arr, function(a, b) {
        return keyCompareFn(keyFn(a), keyFn(b))
    })
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
    goog.array.sortByKey(arr, function(obj) {
        return obj[key]
    }, opt_compareFn)
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
    var compare = opt_compareFn || goog.array.defaultCompare;
    for (var i = 1; i < arr.length; i++) {
        var compareResult = compare(arr[i - 1], arr[i]);
        if (compareResult > 0 || compareResult == 0 && opt_strict) return false
    }
    return true
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
    if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) return false;
    var l = arr1.length;
    var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
    for (var i = 0; i < l; i++)
        if (!equalsFn(arr1[i], arr2[i])) return false;
    return true
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
    var compare = opt_compareFn || goog.array.defaultCompare;
    var l = Math.min(arr1.length, arr2.length);
    for (var i = 0; i < l; i++) {
        var result = compare(arr1[i], arr2[i]);
        if (result != 0) return result
    }
    return goog.array.defaultCompare(arr1.length, arr2.length)
};
goog.array.defaultCompare = function(a, b) {
    return a > b ? 1 : a < b ? -1 : 0
};
goog.array.inverseDefaultCompare = function(a, b) {
    return -goog.array.defaultCompare(a, b)
};
goog.array.defaultCompareEquality = function(a, b) {
    return a === b
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
    var index = goog.array.binarySearch(array, value, opt_compareFn);
    if (index < 0) {
        goog.array.insertAt(array, value, -(index + 1));
        return true
    }
    return false
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
    var index = goog.array.binarySearch(array, value, opt_compareFn);
    return index >= 0 ? goog.array.removeAt(array, index) : false
};
goog.array.bucket = function(array, sorter, opt_obj) {
    var buckets = {};
    for (var i = 0; i < array.length; i++) {
        var value = array[i];
        var key = sorter.call(opt_obj, value, i, array);
        if (goog.isDef(key)) {
            var bucket = buckets[key] || (buckets[key] = []);
            bucket.push(value)
        }
    }
    return buckets
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
    var ret = {};
    goog.array.forEach(arr, function(element, index) {
        ret[keyFunc.call(opt_obj, element, index, arr)] = element
    });
    return ret
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
    var array = [];
    var start = 0;
    var end = startOrEnd;
    var step = opt_step || 1;
    if (opt_end !== undefined) {
        start = startOrEnd;
        end = opt_end
    }
    if (step * (end - start) < 0) return [];
    if (step > 0)
        for (var i = start; i < end; i += step) array.push(i);
    else
        for (var i = start; i > end; i += step) array.push(i);
    return array
};
goog.array.repeat = function(value, n) {
    var array = [];
    for (var i = 0; i < n; i++) array[i] = value;
    return array
};
goog.array.flatten = function(var_args) {
    var CHUNK_SIZE = 8192;
    var result = [];
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (goog.isArray(element))
            for (var c = 0; c < element.length; c += CHUNK_SIZE) {
                var chunk = goog.array.slice(element, c, c + CHUNK_SIZE);
                var recurseResult = goog.array.flatten.apply(null, chunk);
                for (var r = 0; r < recurseResult.length; r++) result.push(recurseResult[r])
            } else result.push(element)
    }
    return result
};
goog.array.rotate = function(array, n) {
    goog.asserts.assert(array.length != null);
    if (array.length) {
        n %= array.length;
        if (n > 0) goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n));
        else if (n < 0) goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n))
    }
    return array
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
    goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
    goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
    var removedItems = goog.array.ARRAY_PROTOTYPE_.splice.call(arr, fromIndex, 1);
    goog.array.ARRAY_PROTOTYPE_.splice.call(arr, toIndex, 0, removedItems[0])
};
goog.array.zip = function(var_args) {
    if (!arguments.length) return [];
    var result = [];
    for (var i = 0; true; i++) {
        var value = [];
        for (var j = 0; j < arguments.length; j++) {
            var arr = arguments[j];
            if (i >= arr.length) return result;
            value.push(arr[i])
        }
        result.push(value)
    }
};
goog.array.shuffle = function(arr, opt_randFn) {
    var randFn = opt_randFn || Math.random;
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(randFn() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp
    }
};
goog.array.copyByIndex = function(arr, index_arr) {
    var result = [];
    goog.array.forEach(index_arr, function(index) {
        result.push(arr[index])
    });
    return result
};
goog.provide("goog.labs.userAgent.browser");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.object");
goog.require("goog.string");
goog.labs.userAgent.browser.matchOpera_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR")
};
goog.labs.userAgent.browser.matchIE_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Edge") || goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Firefox")
};
goog.labs.userAgent.browser.matchSafari_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.matchIE_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"))
};
goog.labs.userAgent.browser.matchCoast_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Coast")
};
goog.labs.userAgent.browser.matchIosWebview_ = function() {
    return (goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit")
};
goog.labs.userAgent.browser.matchChrome_ = function() {
    return (goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchOpera_() && !goog.labs.userAgent.browser.matchIE_()
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk())
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_;
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
    return goog.labs.userAgent.util.matchUserAgent("Silk")
};
goog.labs.userAgent.browser.getVersion = function() {
    var userAgentString = goog.labs.userAgent.util.getUserAgent();
    if (goog.labs.userAgent.browser.isIE()) return goog.labs.userAgent.browser.getIEVersion_(userAgentString);
    var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
    var versionMap = {};
    goog.array.forEach(versionTuples, function(tuple) {
        var key = tuple[0];
        var value = tuple[1];
        versionMap[key] = value
    });
    var versionMapHasKey = goog.partial(goog.object.containsKey, versionMap);

    function lookUpValueWithKeys(keys) {
        var key =
            goog.array.find(keys, versionMapHasKey);
        return versionMap[key] || ""
    }
    if (goog.labs.userAgent.browser.isOpera()) return lookUpValueWithKeys(["Version", "Opera", "OPR"]);
    if (goog.labs.userAgent.browser.isChrome()) return lookUpValueWithKeys(["Chrome", "CriOS"]);
    var tuple = versionTuples[2];
    return tuple && tuple[1] || ""
};
goog.labs.userAgent.browser.isVersionOrHigher = function(version) {
    return goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version) >= 0
};
goog.labs.userAgent.browser.getIEVersion_ = function(userAgent) {
    var rv = /rv: *([\d\.]*)/.exec(userAgent);
    if (rv && rv[1]) return rv[1];
    var edge = /Edge\/([\d\.]+)/.exec(userAgent);
    if (edge) return edge[1];
    var version = "";
    var msie = /MSIE +([\d\.]+)/.exec(userAgent);
    if (msie && msie[1]) {
        var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
        if (msie[1] == "7.0")
            if (tridentVersion && tridentVersion[1]) switch (tridentVersion[1]) {
                case "4.0":
                    version = "8.0";
                    break;
                case "5.0":
                    version = "9.0";
                    break;
                case "6.0":
                    version = "10.0";
                    break;
                case "7.0":
                    version =
                        "11.0";
                    break
            } else version = "7.0";
            else version = msie[1]
    }
    return version
};
goog.provide("goog.labs.userAgent.engine");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.engine.isPresto = function() {
    return goog.labs.userAgent.util.matchUserAgent("Presto")
};
goog.labs.userAgent.engine.isTrident = function() {
    return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.engine.isEdge = function() {
    return goog.labs.userAgent.util.matchUserAgent("Edge")
};
goog.labs.userAgent.engine.isWebKit = function() {
    return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !goog.labs.userAgent.engine.isEdge()
};
goog.labs.userAgent.engine.isGecko = function() {
    return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident() && !goog.labs.userAgent.engine.isEdge()
};
goog.labs.userAgent.engine.getVersion = function() {
    var userAgentString = goog.labs.userAgent.util.getUserAgent();
    if (userAgentString) {
        var tuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
        var engineTuple = goog.labs.userAgent.engine.getEngineTuple_(tuples);
        if (engineTuple) {
            if (engineTuple[0] == "Gecko") return goog.labs.userAgent.engine.getVersionForKey_(tuples, "Firefox");
            return engineTuple[1]
        }
        var browserTuple = tuples[0];
        var info;
        if (browserTuple && (info = browserTuple[2])) {
            var match = /Trident\/([^\s;]+)/.exec(info);
            if (match) return match[1]
        }
    }
    return ""
};
goog.labs.userAgent.engine.getEngineTuple_ = function(tuples) {
    if (!goog.labs.userAgent.engine.isEdge()) return tuples[1];
    for (var i = 0; i < tuples.length; i++) {
        var tuple = tuples[i];
        if (tuple[0] == "Edge") return tuple
    }
};
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
    return goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version) >= 0
};
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
    var pair = goog.array.find(tuples, function(pair) {
        return key == pair[0]
    });
    return pair && pair[1] || ""
};
goog.provide("goog.userAgent");
goog.require("goog.labs.userAgent.browser");
goog.require("goog.labs.userAgent.engine");
goog.require("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.define("goog.userAgent.ASSUME_IE", false);
goog.define("goog.userAgent.ASSUME_GECKO", false);
goog.define("goog.userAgent.ASSUME_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_MOBILE_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_OPERA", false);
goog.define("goog.userAgent.ASSUME_ANY_VERSION", false);
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
    return goog.labs.userAgent.util.getUserAgent()
};
goog.userAgent.getNavigator = function() {
    return goog.global["navigator"] || null
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
    return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile")
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
    var navigator = goog.userAgent.getNavigator();
    return navigator && navigator.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.define("goog.userAgent.ASSUME_MAC", false);
goog.define("goog.userAgent.ASSUME_WINDOWS", false);
goog.define("goog.userAgent.ASSUME_LINUX", false);
goog.define("goog.userAgent.ASSUME_X11", false);
goog.define("goog.userAgent.ASSUME_ANDROID", false);
goog.define("goog.userAgent.ASSUME_IPHONE", false);
goog.define("goog.userAgent.ASSUME_IPAD", false);
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh();
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows();
goog.userAgent.isLegacyLinux_ = function() {
    return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS()
};
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_();
goog.userAgent.isX11_ = function() {
    var navigator = goog.userAgent.getNavigator();
    return !!navigator && goog.string.contains(navigator["appVersion"] || "", "X11")
};
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_();
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid();
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone();
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.determineVersion_ = function() {
    if (goog.userAgent.OPERA && goog.global["opera"]) {
        var operaVersion = goog.global["opera"].version;
        return goog.isFunction(operaVersion) ? operaVersion() : operaVersion
    }
    var version = "";
    var arr = goog.userAgent.getVersionRegexResult_();
    if (arr) version = arr ? arr[1] : "";
    if (goog.userAgent.IE && !goog.labs.userAgent.engine.isEdge()) {
        var docMode = goog.userAgent.getDocumentMode_();
        if (docMode > parseFloat(version)) return String(docMode)
    }
    return version
};
goog.userAgent.getVersionRegexResult_ = function() {
    var userAgent = goog.userAgent.getUserAgentString();
    if (goog.userAgent.GECKO) return /rv\:([^\);]+)(\)|;)/.exec(userAgent);
    if (goog.userAgent.IE && goog.labs.userAgent.engine.isEdge()) return /Edge\/([\d\.]+)/.exec(userAgent);
    if (goog.userAgent.IE) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(userAgent);
    if (goog.userAgent.WEBKIT) return /WebKit\/(\S+)/.exec(userAgent)
};
goog.userAgent.getDocumentMode_ = function() {
    var doc = goog.global["document"];
    return doc ? doc["documentMode"] : undefined
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
    return goog.string.compareVersions(v1, v2)
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
    return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[version] || (goog.userAgent.isVersionOrHigherCache_[version] = goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0)
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
    return goog.userAgent.IE && (goog.labs.userAgent.engine.isEdge() || goog.userAgent.DOCUMENT_MODE >= documentMode)
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
    var doc = goog.global["document"];
    var mode = goog.userAgent.getDocumentMode_();
    if (!doc || !goog.userAgent.IE || !mode && goog.labs.userAgent.engine.isEdge()) return undefined;
    return mode || (doc["compatMode"] == "CSS1Compat" ? parseInt(goog.userAgent.VERSION, 10) : 5)
}();
goog.provide("goog.uri.utils");
goog.provide("goog.uri.utils.ComponentIndex");
goog.provide("goog.uri.utils.QueryArray");
goog.provide("goog.uri.utils.QueryValue");
goog.provide("goog.uri.utils.StandardQueryParam");
goog.require("goog.asserts");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.uri.utils.CharCode_ = {
    AMPERSAND: 38,
    EQUAL: 61,
    HASH: 35,
    QUESTION: 63
};
goog.uri.utils.buildFromEncodedParts = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = "";
    if (opt_scheme) out += opt_scheme + ":";
    if (opt_domain) {
        out += "//";
        if (opt_userInfo) out += opt_userInfo + "@";
        out += opt_domain;
        if (opt_port) out += ":" + opt_port
    }
    if (opt_path) out += opt_path;
    if (opt_queryData) out += "?" + opt_queryData;
    if (opt_fragment) out += "#" + opt_fragment;
    return out
};
goog.uri.utils.splitRe_ = new RegExp("^" + "(?:" + "([^:/?#.]+)" + ":)?" + "(?://" + "(?:([^/?#]*)@)?" + "([^/#?]*?)" + "(?::([0-9]+))?" + "(?=[/#?]|$)" + ")?" + "([^?#]+)?" + "(?:\\?([^#]*))?" + "(?:#(.*))?" + "$");
goog.uri.utils.ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
};
goog.uri.utils.split = function(uri) {
    goog.uri.utils.phishingProtection_();
    return (uri.match(goog.uri.utils.splitRe_))
};
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;
goog.uri.utils.phishingProtection_ = function() {
    if (goog.uri.utils.needsPhishingProtection_) {
        goog.uri.utils.needsPhishingProtection_ = false;
        var location = goog.global["location"];
        if (location) {
            var href = location["href"];
            if (href) {
                var domain = goog.uri.utils.getDomain(href);
                if (domain && domain != location["hostname"]) {
                    goog.uri.utils.needsPhishingProtection_ = true;
                    throw Error();
                }
            }
        }
    }
};
goog.uri.utils.decodeIfPossible_ = function(uri, opt_preserveReserved) {
    if (!uri) return uri;
    return opt_preserveReserved ? decodeURI(uri) : decodeURIComponent(uri)
};
goog.uri.utils.getComponentByIndex_ = function(componentIndex, uri) {
    return goog.uri.utils.split(uri)[componentIndex] || null
};
goog.uri.utils.getScheme = function(uri) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, uri)
};
goog.uri.utils.getEffectiveScheme = function(uri) {
    var scheme = goog.uri.utils.getScheme(uri);
    if (!scheme && self.location) {
        var protocol = self.location.protocol;
        scheme = protocol.substr(0, protocol.length - 1)
    }
    return scheme ? scheme.toLowerCase() : ""
};
goog.uri.utils.getUserInfoEncoded = function(uri) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, uri)
};
goog.uri.utils.getUserInfo = function(uri) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(uri))
};
goog.uri.utils.getDomainEncoded = function(uri) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, uri)
};
goog.uri.utils.getDomain = function(uri) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri), true)
};
goog.uri.utils.getPort = function(uri) {
    return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, uri)) || null
};
goog.uri.utils.getPathEncoded = function(uri) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, uri)
};
goog.uri.utils.getPath = function(uri) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri), true)
};
goog.uri.utils.getQueryData = function(uri) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, uri)
};
goog.uri.utils.getFragmentEncoded = function(uri) {
    var hashIndex = uri.indexOf("#");
    return hashIndex < 0 ? null : uri.substr(hashIndex + 1)
};
goog.uri.utils.setFragmentEncoded = function(uri, fragment) {
    return goog.uri.utils.removeFragment(uri) + (fragment ? "#" + fragment : "")
};
goog.uri.utils.getFragment = function(uri) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(uri))
};
goog.uri.utils.getHost = function(uri) {
    var pieces = goog.uri.utils.split(uri);
    return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], pieces[goog.uri.utils.ComponentIndex.USER_INFO], pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(uri) {
    var pieces = goog.uri.utils.split(uri);
    return goog.uri.utils.buildFromEncodedParts(null, null, null, null, pieces[goog.uri.utils.ComponentIndex.PATH], pieces[goog.uri.utils.ComponentIndex.QUERY_DATA], pieces[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(uri) {
    var hashIndex = uri.indexOf("#");
    return hashIndex < 0 ? uri : uri.substr(0, hashIndex)
};
goog.uri.utils.haveSameDomain = function(uri1, uri2) {
    var pieces1 = goog.uri.utils.split(uri1);
    var pieces2 = goog.uri.utils.split(uri2);
    return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.SCHEME] == pieces2[goog.uri.utils.ComponentIndex.SCHEME] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(uri) {
    if (goog.DEBUG && (uri.indexOf("#") >= 0 || uri.indexOf("?") >= 0)) throw Error("goog.uri.utils: Fragment or query identifiers are not " + "supported: [" + uri + "]");
};
goog.uri.utils.QueryValue;
goog.uri.utils.QueryArray;
goog.uri.utils.parseQueryData = function(encodedQuery, callback) {
    var pairs = encodedQuery.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var indexOfEquals = pairs[i].indexOf("=");
        var name = null;
        var value = null;
        if (indexOfEquals >= 0) {
            name = pairs[i].substring(0, indexOfEquals);
            value = pairs[i].substring(indexOfEquals + 1)
        } else name = pairs[i];
        callback(name, value ? goog.string.urlDecode(value) : "")
    }
};
goog.uri.utils.appendQueryData_ = function(buffer) {
    if (buffer[1]) {
        var baseUri = (buffer[0]);
        var hashIndex = baseUri.indexOf("#");
        if (hashIndex >= 0) {
            buffer.push(baseUri.substr(hashIndex));
            buffer[0] = baseUri = baseUri.substr(0, hashIndex)
        }
        var questionIndex = baseUri.indexOf("?");
        if (questionIndex < 0) buffer[1] = "?";
        else if (questionIndex == baseUri.length - 1) buffer[1] = undefined
    }
    return buffer.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(key, value, pairs) {
    if (goog.isArray(value)) {
        goog.asserts.assertArray(value);
        for (var j = 0; j < value.length; j++) goog.uri.utils.appendKeyValuePairs_(key, String(value[j]), pairs)
    } else if (value != null) pairs.push("&", key, value === "" ? "" : "=", goog.string.urlEncode(value))
};
goog.uri.utils.buildQueryDataBuffer_ = function(buffer, keysAndValues, opt_startIndex) {
    goog.asserts.assert(Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2 == 0, "goog.uri.utils: Key/value lists must be even in length.");
    for (var i = opt_startIndex || 0; i < keysAndValues.length; i += 2) goog.uri.utils.appendKeyValuePairs_(keysAndValues[i], keysAndValues[i + 1], buffer);
    return buffer
};
goog.uri.utils.buildQueryData = function(keysAndValues, opt_startIndex) {
    var buffer = goog.uri.utils.buildQueryDataBuffer_([], keysAndValues, opt_startIndex);
    buffer[0] = "";
    return buffer.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(buffer, map) {
    for (var key in map) goog.uri.utils.appendKeyValuePairs_(key, map[key], buffer);
    return buffer
};
goog.uri.utils.buildQueryDataFromMap = function(map) {
    var buffer = goog.uri.utils.buildQueryDataBufferFromMap_([], map);
    buffer[0] = "";
    return buffer.join("")
};
goog.uri.utils.appendParams = function(uri, var_args) {
    return goog.uri.utils.appendQueryData_(arguments.length == 2 ? goog.uri.utils.buildQueryDataBuffer_([uri], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([uri], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(uri, map) {
    return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([uri], map))
};
goog.uri.utils.appendParam = function(uri, key, opt_value) {
    var paramArr = [uri, "&", key];
    if (goog.isDefAndNotNull(opt_value)) paramArr.push("=", goog.string.urlEncode(opt_value));
    return goog.uri.utils.appendQueryData_(paramArr)
};
goog.uri.utils.findParam_ = function(uri, startIndex, keyEncoded, hashOrEndIndex) {
    var index = startIndex;
    var keyLength = keyEncoded.length;
    while ((index = uri.indexOf(keyEncoded, index)) >= 0 && index < hashOrEndIndex) {
        var precedingChar = uri.charCodeAt(index - 1);
        if (precedingChar == goog.uri.utils.CharCode_.AMPERSAND || precedingChar == goog.uri.utils.CharCode_.QUESTION) {
            var followingChar = uri.charCodeAt(index + keyLength);
            if (!followingChar || followingChar == goog.uri.utils.CharCode_.EQUAL || followingChar == goog.uri.utils.CharCode_.AMPERSAND ||
                followingChar == goog.uri.utils.CharCode_.HASH) return index
        }
        index += keyLength + 1
    }
    return -1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(uri, keyEncoded) {
    return goog.uri.utils.findParam_(uri, 0, keyEncoded, uri.search(goog.uri.utils.hashOrEndRe_)) >= 0
};
goog.uri.utils.getParamValue = function(uri, keyEncoded) {
    var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
    var foundIndex = goog.uri.utils.findParam_(uri, 0, keyEncoded, hashOrEndIndex);
    if (foundIndex < 0) return null;
    else {
        var endPosition = uri.indexOf("&", foundIndex);
        if (endPosition < 0 || endPosition > hashOrEndIndex) endPosition = hashOrEndIndex;
        foundIndex += keyEncoded.length + 1;
        return goog.string.urlDecode(uri.substr(foundIndex, endPosition - foundIndex))
    }
};
goog.uri.utils.getParamValues = function(uri, keyEncoded) {
    var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
    var position = 0;
    var foundIndex;
    var result = [];
    while ((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
        position = uri.indexOf("&", foundIndex);
        if (position < 0 || position > hashOrEndIndex) position = hashOrEndIndex;
        foundIndex += keyEncoded.length + 1;
        result.push(goog.string.urlDecode(uri.substr(foundIndex, position - foundIndex)))
    }
    return result
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(uri, keyEncoded) {
    var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
    var position = 0;
    var foundIndex;
    var buffer = [];
    while ((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
        buffer.push(uri.substring(position, foundIndex));
        position = Math.min(uri.indexOf("&", foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex)
    }
    buffer.push(uri.substr(position));
    return buffer.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(uri, keyEncoded, value) {
    return goog.uri.utils.appendParam(goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value)
};
goog.uri.utils.appendPath = function(baseUri, path) {
    goog.uri.utils.assertNoFragmentsOrQueries_(baseUri);
    if (goog.string.endsWith(baseUri, "/")) baseUri = baseUri.substr(0, baseUri.length - 1);
    if (goog.string.startsWith(path, "/")) path = path.substr(1);
    return goog.string.buildString(baseUri, "/", path)
};
goog.uri.utils.setPath = function(uri, path) {
    if (!goog.string.startsWith(path, "/")) path = "/" + path;
    var parts = goog.uri.utils.split(uri);
    return goog.uri.utils.buildFromEncodedParts(parts[goog.uri.utils.ComponentIndex.SCHEME], parts[goog.uri.utils.ComponentIndex.USER_INFO], parts[goog.uri.utils.ComponentIndex.DOMAIN], parts[goog.uri.utils.ComponentIndex.PORT], path, parts[goog.uri.utils.ComponentIndex.QUERY_DATA], parts[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.StandardQueryParam = {
    RANDOM: "zx"
};
goog.uri.utils.makeUnique = function(uri) {
    return goog.uri.utils.setParam(uri, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};
goog.provide("goog.functions");
goog.functions.constant = function(retValue) {
    return function() {
        return retValue
    }
};
goog.functions.FALSE = goog.functions.constant(false);
goog.functions.TRUE = goog.functions.constant(true);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue, var_args) {
    return opt_returnValue
};
goog.functions.error = function(message) {
    return function() {
        throw Error(message);
    }
};
goog.functions.fail = function(err) {
    return function() {
        throw err;
    }
};
goog.functions.lock = function(f, opt_numArgs) {
    opt_numArgs = opt_numArgs || 0;
    return function() {
        return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs))
    }
};
goog.functions.nth = function(n) {
    return function() {
        return arguments[n]
    }
};
goog.functions.withReturnValue = function(f, retValue) {
    return goog.functions.sequence(f, goog.functions.constant(retValue))
};
goog.functions.equalTo = function(value, opt_useLooseComparison) {
    return function(other) {
        return opt_useLooseComparison ? value == other : value === other
    }
};
goog.functions.compose = function(fn, var_args) {
    var functions = arguments;
    var length = functions.length;
    return function() {
        var result;
        if (length) result = functions[length - 1].apply(this, arguments);
        for (var i = length - 2; i >= 0; i--) result = functions[i].call(this, result);
        return result
    }
};
goog.functions.sequence = function(var_args) {
    var functions = arguments;
    var length = functions.length;
    return function() {
        var result;
        for (var i = 0; i < length; i++) result = functions[i].apply(this, arguments);
        return result
    }
};
goog.functions.and = function(var_args) {
    var functions = arguments;
    var length = functions.length;
    return function() {
        for (var i = 0; i < length; i++)
            if (!functions[i].apply(this, arguments)) return false;
        return true
    }
};
goog.functions.or = function(var_args) {
    var functions = arguments;
    var length = functions.length;
    return function() {
        for (var i = 0; i < length; i++)
            if (functions[i].apply(this, arguments)) return true;
        return false
    }
};
goog.functions.not = function(f) {
    return function() {
        return !f.apply(this, arguments)
    }
};
goog.functions.create = function(constructor, var_args) {
    var temp = function() {};
    temp.prototype = constructor.prototype;
    var obj = new temp;
    constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
    return obj
};
goog.define("goog.functions.CACHE_RETURN_VALUE", true);
goog.functions.cacheReturnValue = function(fn) {
    var called = false;
    var value;
    return function() {
        if (!goog.functions.CACHE_RETURN_VALUE) return fn();
        if (!called) {
            value = fn();
            called = true
        }
        return value
    }
};
goog.provide("goog.math");
goog.require("goog.array");
goog.require("goog.asserts");
goog.math.randomInt = function(a) {
    return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
    return a + Math.random() * (b - a)
};
goog.math.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max)
};
goog.math.modulo = function(a, b) {
    var r = a % b;
    return r * b < 0 ? r + b : r
};
goog.math.lerp = function(a, b, x) {
    return a + x * (b - a)
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
    return Math.abs(a - b) <= (opt_tolerance || 1E-6)
};
goog.math.standardAngle = function(angle) {
    return goog.math.modulo(angle, 360)
};
goog.math.standardAngleInRadians = function(angle) {
    return goog.math.modulo(angle, 2 * Math.PI)
};
goog.math.toRadians = function(angleDegrees) {
    return angleDegrees * Math.PI / 180
};
goog.math.toDegrees = function(angleRadians) {
    return angleRadians * 180 / Math.PI
};
goog.math.angleDx = function(degrees, radius) {
    return radius * Math.cos(goog.math.toRadians(degrees))
};
goog.math.angleDy = function(degrees, radius) {
    return radius * Math.sin(goog.math.toRadians(degrees))
};
goog.math.angle = function(x1, y1, x2, y2) {
    return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)))
};
goog.math.angleDifference = function(startAngle, endAngle) {
    var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
    if (d > 180) d = d - 360;
    else if (d <= -180) d = 360 + d;
    return d
};
goog.math.sign = function(x) {
    return x == 0 ? 0 : x < 0 ? -1 : 1
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
    var compare = opt_compareFn || function(a, b) {
        return a == b
    };
    var collect = opt_collectorFn || function(i1, i2) {
        return array1[i1]
    };
    var length1 = array1.length;
    var length2 = array2.length;
    var arr = [];
    for (var i = 0; i < length1 + 1; i++) {
        arr[i] = [];
        arr[i][0] = 0
    }
    for (var j = 0; j < length2 + 1; j++) arr[0][j] = 0;
    for (i = 1; i <= length1; i++)
        for (j = 1; j <= length2; j++)
            if (compare(array1[i - 1], array2[j - 1])) arr[i][j] = arr[i - 1][j - 1] + 1;
            else arr[i][j] = Math.max(arr[i - 1][j],
                arr[i][j - 1]);
    var result = [];
    var i = length1,
        j = length2;
    while (i > 0 && j > 0)
        if (compare(array1[i - 1], array2[j - 1])) {
            result.unshift(collect(i - 1, j - 1));
            i--;
            j--
        } else if (arr[i - 1][j] > arr[i][j - 1]) i--;
    else j--;
    return result
};
goog.math.sum = function(var_args) {
    return (goog.array.reduce(arguments, function(sum, value) {
        return sum + value
    }, 0))
};
goog.math.average = function(var_args) {
    return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.sampleVariance = function(var_args) {
    var sampleSize = arguments.length;
    if (sampleSize < 2) return 0;
    var mean = goog.math.average.apply(null, arguments);
    var variance = goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
        return Math.pow(val - mean, 2)
    })) / (sampleSize - 1);
    return variance
};
goog.math.standardDeviation = function(var_args) {
    return Math.sqrt(goog.math.sampleVariance.apply(null, arguments))
};
goog.math.isInt = function(num) {
    return isFinite(num) && num % 1 == 0
};
goog.math.isFiniteNumber = function(num) {
    return isFinite(num) && !isNaN(num)
};
goog.math.log10Floor = function(num) {
    if (num > 0) {
        var x = Math.round(Math.log(num) * Math.LOG10E);
        return x - (parseFloat("1e" + x) > num)
    }
    return num == 0 ? -Infinity : NaN
};
goog.math.safeFloor = function(num, opt_epsilon) {
    goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
    return Math.floor(num + (opt_epsilon || 2E-15))
};
goog.math.safeCeil = function(num, opt_epsilon) {
    goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
    return Math.ceil(num - (opt_epsilon || 2E-15))
};
goog.provide("goog.iter");
goog.provide("goog.iter.Iterable");
goog.provide("goog.iter.Iterator");
goog.provide("goog.iter.StopIteration");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.functions");
goog.require("goog.math");
goog.iter.Iterable;
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global["StopIteration"] : Error("StopIteration");
goog.iter.Iterator = function() {};
goog.iter.Iterator.prototype.next = function() {
    throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
    return this
};
goog.iter.toIterator = function(iterable) {
    if (iterable instanceof goog.iter.Iterator) return iterable;
    if (typeof iterable.__iterator__ == "function") return iterable.__iterator__(false);
    if (goog.isArrayLike(iterable)) {
        var i = 0;
        var newIter = new goog.iter.Iterator;
        newIter.next = function() {
            while (true) {
                if (i >= iterable.length) throw goog.iter.StopIteration;
                if (!(i in iterable)) {
                    i++;
                    continue
                }
                return iterable[i++]
            }
        };
        return newIter
    }
    throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
    if (goog.isArrayLike(iterable)) try {
        goog.array.forEach((iterable), f, opt_obj)
    } catch (ex) {
        if (ex !== goog.iter.StopIteration) throw ex;
    } else {
        iterable = goog.iter.toIterator(iterable);
        try {
            while (true) f.call(opt_obj, iterable.next(), undefined, iterable)
        } catch (ex) {
            if (ex !== goog.iter.StopIteration) throw ex;
        }
    }
};
goog.iter.filter = function(iterable, f, opt_obj) {
    var iterator = goog.iter.toIterator(iterable);
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
        while (true) {
            var val = iterator.next();
            if (f.call(opt_obj, val, undefined, iterator)) return val
        }
    };
    return newIter
};
goog.iter.filterFalse = function(iterable, f, opt_obj) {
    return goog.iter.filter(iterable, goog.functions.not(f), opt_obj)
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
    var start = 0;
    var stop = startOrStop;
    var step = opt_step || 1;
    if (arguments.length > 1) {
        start = startOrStop;
        stop = opt_stop
    }
    if (step == 0) throw Error("Range step argument must not be zero");
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
        if (step > 0 && start >= stop || step < 0 && start <= stop) throw goog.iter.StopIteration;
        var rv = start;
        start += step;
        return rv
    };
    return newIter
};
goog.iter.join = function(iterable, deliminator) {
    return goog.iter.toArray(iterable).join(deliminator)
};
goog.iter.map = function(iterable, f, opt_obj) {
    var iterator = goog.iter.toIterator(iterable);
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
        var val = iterator.next();
        return f.call(opt_obj, val, undefined, iterator)
    };
    return newIter
};
goog.iter.reduce = function(iterable, f, val, opt_obj) {
    var rval = val;
    goog.iter.forEach(iterable, function(val) {
        rval = f.call(opt_obj, rval, val)
    });
    return rval
};
goog.iter.some = function(iterable, f, opt_obj) {
    iterable = goog.iter.toIterator(iterable);
    try {
        while (true)
            if (f.call(opt_obj, iterable.next(), undefined, iterable)) return true
    } catch (ex) {
        if (ex !== goog.iter.StopIteration) throw ex;
    }
    return false
};
goog.iter.every = function(iterable, f, opt_obj) {
    iterable = goog.iter.toIterator(iterable);
    try {
        while (true)
            if (!f.call(opt_obj, iterable.next(), undefined, iterable)) return false
    } catch (ex) {
        if (ex !== goog.iter.StopIteration) throw ex;
    }
    return true
};
goog.iter.chain = function(var_args) {
    return goog.iter.chainFromIterable(arguments)
};
goog.iter.chainFromIterable = function(iterable) {
    var iterator = goog.iter.toIterator(iterable);
    var iter = new goog.iter.Iterator;
    var current = null;
    iter.next = function() {
        while (true) {
            if (current == null) {
                var it = iterator.next();
                current = goog.iter.toIterator(it)
            }
            try {
                return current.next()
            } catch (ex) {
                if (ex !== goog.iter.StopIteration) throw ex;
                current = null
            }
        }
    };
    return iter
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
    var iterator = goog.iter.toIterator(iterable);
    var newIter = new goog.iter.Iterator;
    var dropping = true;
    newIter.next = function() {
        while (true) {
            var val = iterator.next();
            if (dropping && f.call(opt_obj, val, undefined, iterator)) continue;
            else dropping = false;
            return val
        }
    };
    return newIter
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
    var iterator = goog.iter.toIterator(iterable);
    var iter = new goog.iter.Iterator;
    iter.next = function() {
        var val = iterator.next();
        if (f.call(opt_obj, val, undefined, iterator)) return val;
        throw goog.iter.StopIteration;
    };
    return iter
};
goog.iter.toArray = function(iterable) {
    if (goog.isArrayLike(iterable)) return goog.array.toArray((iterable));
    iterable = goog.iter.toIterator(iterable);
    var array = [];
    goog.iter.forEach(iterable, function(val) {
        array.push(val)
    });
    return array
};
goog.iter.equals = function(iterable1, iterable2, opt_equalsFn) {
    var fillValue = {};
    var pairs = goog.iter.zipLongest(fillValue, iterable1, iterable2);
    var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
    return goog.iter.every(pairs, function(pair) {
        return equalsFn(pair[0], pair[1])
    })
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
    try {
        return goog.iter.toIterator(iterable).next()
    } catch (e) {
        if (e != goog.iter.StopIteration) throw e;
        return defaultValue
    }
};
goog.iter.product = function(var_args) {
    var someArrayEmpty = goog.array.some(arguments, function(arr) {
        return !arr.length
    });
    if (someArrayEmpty || !arguments.length) return new goog.iter.Iterator;
    var iter = new goog.iter.Iterator;
    var arrays = arguments;
    var indicies = goog.array.repeat(0, arrays.length);
    iter.next = function() {
        if (indicies) {
            var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
                return arrays[arrayIndex][valueIndex]
            });
            for (var i = indicies.length - 1; i >= 0; i--) {
                goog.asserts.assert(indicies);
                if (indicies[i] <
                    arrays[i].length - 1) {
                    indicies[i]++;
                    break
                }
                if (i == 0) {
                    indicies = null;
                    break
                }
                indicies[i] = 0
            }
            return retVal
        }
        throw goog.iter.StopIteration;
    };
    return iter
};
goog.iter.cycle = function(iterable) {
    var baseIterator = goog.iter.toIterator(iterable);
    var cache = [];
    var cacheIndex = 0;
    var iter = new goog.iter.Iterator;
    var useCache = false;
    iter.next = function() {
        var returnElement = null;
        if (!useCache) try {
            returnElement = baseIterator.next();
            cache.push(returnElement);
            return returnElement
        } catch (e) {
            if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) throw e;
            useCache = true
        }
        returnElement = cache[cacheIndex];
        cacheIndex = (cacheIndex + 1) % cache.length;
        return returnElement
    };
    return iter
};
goog.iter.count = function(opt_start, opt_step) {
    var counter = opt_start || 0;
    var step = goog.isDef(opt_step) ? opt_step : 1;
    var iter = new goog.iter.Iterator;
    iter.next = function() {
        var returnValue = counter;
        counter += step;
        return returnValue
    };
    return iter
};
goog.iter.repeat = function(value) {
    var iter = new goog.iter.Iterator;
    iter.next = goog.functions.constant(value);
    return iter
};
goog.iter.accumulate = function(iterable) {
    var iterator = goog.iter.toIterator(iterable);
    var total = 0;
    var iter = new goog.iter.Iterator;
    iter.next = function() {
        total += iterator.next();
        return total
    };
    return iter
};
goog.iter.zip = function(var_args) {
    var args = arguments;
    var iter = new goog.iter.Iterator;
    if (args.length > 0) {
        var iterators = goog.array.map(args, goog.iter.toIterator);
        iter.next = function() {
            var arr = goog.array.map(iterators, function(it) {
                return it.next()
            });
            return arr
        }
    }
    return iter
};
goog.iter.zipLongest = function(fillValue, var_args) {
    var args = goog.array.slice(arguments, 1);
    var iter = new goog.iter.Iterator;
    if (args.length > 0) {
        var iterators = goog.array.map(args, goog.iter.toIterator);
        iter.next = function() {
            var iteratorsHaveValues = false;
            var arr = goog.array.map(iterators, function(it) {
                var returnValue;
                try {
                    returnValue = it.next();
                    iteratorsHaveValues = true
                } catch (ex) {
                    if (ex !== goog.iter.StopIteration) throw ex;
                    returnValue = fillValue
                }
                return returnValue
            });
            if (!iteratorsHaveValues) throw goog.iter.StopIteration;
            return arr
        }
    }
    return iter
};
goog.iter.compress = function(iterable, selectors) {
    var selectorIterator = goog.iter.toIterator(selectors);
    return goog.iter.filter(iterable, function() {
        return !!selectorIterator.next()
    })
};
goog.iter.GroupByIterator_ = function(iterable, opt_keyFunc) {
    this.iterator = goog.iter.toIterator(iterable);
    this.keyFunc = opt_keyFunc || goog.functions.identity;
    this.targetKey;
    this.currentKey;
    this.currentValue
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
    while (this.currentKey == this.targetKey) {
        this.currentValue = this.iterator.next();
        this.currentKey = this.keyFunc(this.currentValue)
    }
    this.targetKey = this.currentKey;
    return [this.currentKey, this.groupItems_(this.targetKey)]
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(targetKey) {
    var arr = [];
    while (this.currentKey == targetKey) {
        arr.push(this.currentValue);
        try {
            this.currentValue = this.iterator.next()
        } catch (ex) {
            if (ex !== goog.iter.StopIteration) throw ex;
            break
        }
        this.currentKey = this.keyFunc(this.currentValue)
    }
    return arr
};
goog.iter.groupBy = function(iterable, opt_keyFunc) {
    return new goog.iter.GroupByIterator_(iterable, opt_keyFunc)
};
goog.iter.starMap = function(iterable, f, opt_obj) {
    var iterator = goog.iter.toIterator(iterable);
    var iter = new goog.iter.Iterator;
    iter.next = function() {
        var args = goog.iter.toArray(iterator.next());
        return f.apply(opt_obj, goog.array.concat(args, undefined, iterator))
    };
    return iter
};
goog.iter.tee = function(iterable, opt_num) {
    var iterator = goog.iter.toIterator(iterable);
    var num = goog.isNumber(opt_num) ? opt_num : 2;
    var buffers = goog.array.map(goog.array.range(num), function() {
        return []
    });
    var addNextIteratorValueToBuffers = function() {
        var val = iterator.next();
        goog.array.forEach(buffers, function(buffer) {
            buffer.push(val)
        })
    };
    var createIterator = function(buffer) {
        var iter = new goog.iter.Iterator;
        iter.next = function() {
            if (goog.array.isEmpty(buffer)) addNextIteratorValueToBuffers();
            goog.asserts.assert(!goog.array.isEmpty(buffer));
            return buffer.shift()
        };
        return iter
    };
    return goog.array.map(buffers, createIterator)
};
goog.iter.enumerate = function(iterable, opt_start) {
    return goog.iter.zip(goog.iter.count(opt_start), iterable)
};
goog.iter.limit = function(iterable, limitSize) {
    goog.asserts.assert(goog.math.isInt(limitSize) && limitSize >= 0);
    var iterator = goog.iter.toIterator(iterable);
    var iter = new goog.iter.Iterator;
    var remaining = limitSize;
    iter.next = function() {
        if (remaining-- > 0) return iterator.next();
        throw goog.iter.StopIteration;
    };
    return iter
};
goog.iter.consume = function(iterable, count) {
    goog.asserts.assert(goog.math.isInt(count) && count >= 0);
    var iterator = goog.iter.toIterator(iterable);
    while (count-- > 0) goog.iter.nextOrValue(iterator, null);
    return iterator
};
goog.iter.slice = function(iterable, start, opt_end) {
    goog.asserts.assert(goog.math.isInt(start) && start >= 0);
    var iterator = goog.iter.consume(iterable, start);
    if (goog.isNumber(opt_end)) {
        goog.asserts.assert(goog.math.isInt((opt_end)) && opt_end >= start);
        iterator = goog.iter.limit(iterator, opt_end - start)
    }
    return iterator
};
goog.iter.hasDuplicates_ = function(arr) {
    var deduped = [];
    goog.array.removeDuplicates(arr, deduped);
    return arr.length != deduped.length
};
goog.iter.permutations = function(iterable, opt_length) {
    var elements = goog.iter.toArray(iterable);
    var length = goog.isNumber(opt_length) ? opt_length : elements.length;
    var sets = goog.array.repeat(elements, length);
    var product = goog.iter.product.apply(undefined, sets);
    return goog.iter.filter(product, function(arr) {
        return !goog.iter.hasDuplicates_(arr)
    })
};
goog.iter.combinations = function(iterable, length) {
    var elements = goog.iter.toArray(iterable);
    var indexes = goog.iter.range(elements.length);
    var indexIterator = goog.iter.permutations(indexes, length);
    var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
        return goog.array.isSorted(arr)
    });
    var iter = new goog.iter.Iterator;

    function getIndexFromElements(index) {
        return elements[index]
    }
    iter.next = function() {
        return goog.array.map((sortedIndexIterator.next()), getIndexFromElements)
    };
    return iter
};
goog.iter.combinationsWithReplacement = function(iterable, length) {
    var elements = goog.iter.toArray(iterable);
    var indexes = goog.array.range(elements.length);
    var sets = goog.array.repeat(indexes, length);
    var indexIterator = goog.iter.product.apply(undefined, sets);
    var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
        return goog.array.isSorted(arr)
    });
    var iter = new goog.iter.Iterator;

    function getIndexFromElements(index) {
        return elements[index]
    }
    iter.next = function() {
        return goog.array.map((sortedIndexIterator.next()),
            getIndexFromElements)
    };
    return iter
};
goog.provide("goog.structs.Map");
goog.require("goog.iter.Iterator");
goog.require("goog.iter.StopIteration");
goog.require("goog.object");
goog.structs.Map = function(opt_map, var_args) {
    this.map_ = {};
    this.keys_ = [];
    this.count_ = 0;
    this.version_ = 0;
    var argLength = arguments.length;
    if (argLength > 1) {
        if (argLength % 2) throw Error("Uneven number of arguments");
        for (var i = 0; i < argLength; i += 2) this.set(arguments[i], arguments[i + 1])
    } else if (opt_map) this.addAll((opt_map))
};
goog.structs.Map.prototype.getCount = function() {
    return this.count_
};
goog.structs.Map.prototype.getValues = function() {
    this.cleanupKeysArray_();
    var rv = [];
    for (var i = 0; i < this.keys_.length; i++) {
        var key = this.keys_[i];
        rv.push(this.map_[key])
    }
    return rv
};
goog.structs.Map.prototype.getKeys = function() {
    this.cleanupKeysArray_();
    return (this.keys_.concat())
};
goog.structs.Map.prototype.containsKey = function(key) {
    return goog.structs.Map.hasKey_(this.map_, key)
};
goog.structs.Map.prototype.containsValue = function(val) {
    for (var i = 0; i < this.keys_.length; i++) {
        var key = this.keys_[i];
        if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) return true
    }
    return false
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
    if (this === otherMap) return true;
    if (this.count_ != otherMap.getCount()) return false;
    var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
    this.cleanupKeysArray_();
    for (var key, i = 0; key = this.keys_[i]; i++)
        if (!equalityFn(this.get(key), otherMap.get(key))) return false;
    return true
};
goog.structs.Map.defaultEquals = function(a, b) {
    return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
    return this.count_ == 0
};
goog.structs.Map.prototype.clear = function() {
    this.map_ = {};
    this.keys_.length = 0;
    this.count_ = 0;
    this.version_ = 0
};
goog.structs.Map.prototype.remove = function(key) {
    if (goog.structs.Map.hasKey_(this.map_, key)) {
        delete this.map_[key];
        this.count_--;
        this.version_++;
        if (this.keys_.length > 2 * this.count_) this.cleanupKeysArray_();
        return true
    }
    return false
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
    if (this.count_ != this.keys_.length) {
        var srcIndex = 0;
        var destIndex = 0;
        while (srcIndex < this.keys_.length) {
            var key = this.keys_[srcIndex];
            if (goog.structs.Map.hasKey_(this.map_, key)) this.keys_[destIndex++] = key;
            srcIndex++
        }
        this.keys_.length = destIndex
    }
    if (this.count_ != this.keys_.length) {
        var seen = {};
        var srcIndex = 0;
        var destIndex = 0;
        while (srcIndex < this.keys_.length) {
            var key = this.keys_[srcIndex];
            if (!goog.structs.Map.hasKey_(seen, key)) {
                this.keys_[destIndex++] = key;
                seen[key] = 1
            }
            srcIndex++
        }
        this.keys_.length = destIndex
    }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
    if (goog.structs.Map.hasKey_(this.map_, key)) return this.map_[key];
    return opt_val
};
goog.structs.Map.prototype.set = function(key, value) {
    if (!goog.structs.Map.hasKey_(this.map_, key)) {
        this.count_++;
        this.keys_.push(key);
        this.version_++
    }
    this.map_[key] = value
};
goog.structs.Map.prototype.addAll = function(map) {
    var keys, values;
    if (map instanceof goog.structs.Map) {
        keys = map.getKeys();
        values = map.getValues()
    } else {
        keys = goog.object.getKeys(map);
        values = goog.object.getValues(map)
    }
    for (var i = 0; i < keys.length; i++) this.set(keys[i], values[i])
};
goog.structs.Map.prototype.forEach = function(f, opt_obj) {
    var keys = this.getKeys();
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = this.get(key);
        f.call(opt_obj, value, key, this)
    }
};
goog.structs.Map.prototype.clone = function() {
    return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
    var transposed = new goog.structs.Map;
    for (var i = 0; i < this.keys_.length; i++) {
        var key = this.keys_[i];
        var value = this.map_[key];
        transposed.set(value, key)
    }
    return transposed
};
goog.structs.Map.prototype.toObject = function() {
    this.cleanupKeysArray_();
    var obj = {};
    for (var i = 0; i < this.keys_.length; i++) {
        var key = this.keys_[i];
        obj[key] = this.map_[key]
    }
    return obj
};
goog.structs.Map.prototype.getKeyIterator = function() {
    return this.__iterator__(true)
};
goog.structs.Map.prototype.getValueIterator = function() {
    return this.__iterator__(false)
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
    this.cleanupKeysArray_();
    var i = 0;
    var version = this.version_;
    var selfObj = this;
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
        if (version != selfObj.version_) throw Error("The map has changed since the iterator was created");
        if (i >= selfObj.keys_.length) throw goog.iter.StopIteration;
        var key = selfObj.keys_[i++];
        return opt_keys ? key : selfObj.map_[key]
    };
    return newIter
};
goog.structs.Map.hasKey_ = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
};
goog.provide("goog.structs");
goog.require("goog.array");
goog.require("goog.object");
goog.structs.getCount = function(col) {
    if (typeof col.getCount == "function") return col.getCount();
    if (goog.isArrayLike(col) || goog.isString(col)) return col.length;
    return goog.object.getCount(col)
};
goog.structs.getValues = function(col) {
    if (typeof col.getValues == "function") return col.getValues();
    if (goog.isString(col)) return col.split("");
    if (goog.isArrayLike(col)) {
        var rv = [];
        var l = col.length;
        for (var i = 0; i < l; i++) rv.push(col[i]);
        return rv
    }
    return goog.object.getValues(col)
};
goog.structs.getKeys = function(col) {
    if (typeof col.getKeys == "function") return col.getKeys();
    if (typeof col.getValues == "function") return undefined;
    if (goog.isArrayLike(col) || goog.isString(col)) {
        var rv = [];
        var l = col.length;
        for (var i = 0; i < l; i++) rv.push(i);
        return rv
    }
    return goog.object.getKeys(col)
};
goog.structs.contains = function(col, val) {
    if (typeof col.contains == "function") return col.contains(val);
    if (typeof col.containsValue == "function") return col.containsValue(val);
    if (goog.isArrayLike(col) || goog.isString(col)) return goog.array.contains((col), val);
    return goog.object.containsValue(col, val)
};
goog.structs.isEmpty = function(col) {
    if (typeof col.isEmpty == "function") return col.isEmpty();
    if (goog.isArrayLike(col) || goog.isString(col)) return goog.array.isEmpty((col));
    return goog.object.isEmpty(col)
};
goog.structs.clear = function(col) {
    if (typeof col.clear == "function") col.clear();
    else if (goog.isArrayLike(col)) goog.array.clear((col));
    else goog.object.clear(col)
};
goog.structs.forEach = function(col, f, opt_obj) {
    if (typeof col.forEach == "function") col.forEach(f, opt_obj);
    else if (goog.isArrayLike(col) || goog.isString(col)) goog.array.forEach((col), f, opt_obj);
    else {
        var keys = goog.structs.getKeys(col);
        var values = goog.structs.getValues(col);
        var l = values.length;
        for (var i = 0; i < l; i++) f.call(opt_obj, values[i], keys && keys[i], col)
    }
};
goog.structs.filter = function(col, f, opt_obj) {
    if (typeof col.filter == "function") return col.filter(f, opt_obj);
    if (goog.isArrayLike(col) || goog.isString(col)) return goog.array.filter((col), f, opt_obj);
    var rv;
    var keys = goog.structs.getKeys(col);
    var values = goog.structs.getValues(col);
    var l = values.length;
    if (keys) {
        rv = {};
        for (var i = 0; i < l; i++)
            if (f.call(opt_obj, values[i], keys[i], col)) rv[keys[i]] = values[i]
    } else {
        rv = [];
        for (var i = 0; i < l; i++)
            if (f.call(opt_obj, values[i], undefined, col)) rv.push(values[i])
    }
    return rv
};
goog.structs.map = function(col, f, opt_obj) {
    if (typeof col.map == "function") return col.map(f, opt_obj);
    if (goog.isArrayLike(col) || goog.isString(col)) return goog.array.map((col), f, opt_obj);
    var rv;
    var keys = goog.structs.getKeys(col);
    var values = goog.structs.getValues(col);
    var l = values.length;
    if (keys) {
        rv = {};
        for (var i = 0; i < l; i++) rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col)
    } else {
        rv = [];
        for (var i = 0; i < l; i++) rv[i] = f.call(opt_obj, values[i], undefined, col)
    }
    return rv
};
goog.structs.some = function(col, f, opt_obj) {
    if (typeof col.some == "function") return col.some(f, opt_obj);
    if (goog.isArrayLike(col) || goog.isString(col)) return goog.array.some((col), f, opt_obj);
    var keys = goog.structs.getKeys(col);
    var values = goog.structs.getValues(col);
    var l = values.length;
    for (var i = 0; i < l; i++)
        if (f.call(opt_obj, values[i], keys && keys[i], col)) return true;
    return false
};
goog.structs.every = function(col, f, opt_obj) {
    if (typeof col.every == "function") return col.every(f, opt_obj);
    if (goog.isArrayLike(col) || goog.isString(col)) return goog.array.every((col), f, opt_obj);
    var keys = goog.structs.getKeys(col);
    var values = goog.structs.getValues(col);
    var l = values.length;
    for (var i = 0; i < l; i++)
        if (!f.call(opt_obj, values[i], keys && keys[i], col)) return false;
    return true
};
goog.provide("goog.Uri");
goog.provide("goog.Uri.QueryData");
goog.require("goog.array");
goog.require("goog.string");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.require("goog.uri.utils");
goog.require("goog.uri.utils.ComponentIndex");
goog.require("goog.uri.utils.StandardQueryParam");
goog.Uri = function(opt_uri, opt_ignoreCase) {
    this.scheme_ = "";
    this.userInfo_ = "";
    this.domain_ = "";
    this.port_ = null;
    this.path_ = "";
    this.fragment_ = "";
    this.isReadOnly_ = false;
    this.ignoreCase_ = false;
    this.queryData_;
    var m;
    if (opt_uri instanceof goog.Uri) {
        this.ignoreCase_ = goog.isDef(opt_ignoreCase) ? opt_ignoreCase : opt_uri.getIgnoreCase();
        this.setScheme(opt_uri.getScheme());
        this.setUserInfo(opt_uri.getUserInfo());
        this.setDomain(opt_uri.getDomain());
        this.setPort(opt_uri.getPort());
        this.setPath(opt_uri.getPath());
        this.setQueryData(opt_uri.getQueryData().clone());
        this.setFragment(opt_uri.getFragment())
    } else if (opt_uri && (m = goog.uri.utils.split(String(opt_uri)))) {
        this.ignoreCase_ = !!opt_ignoreCase;
        this.setScheme(m[goog.uri.utils.ComponentIndex.SCHEME] || "", true);
        this.setUserInfo(m[goog.uri.utils.ComponentIndex.USER_INFO] || "", true);
        this.setDomain(m[goog.uri.utils.ComponentIndex.DOMAIN] || "", true);
        this.setPort(m[goog.uri.utils.ComponentIndex.PORT]);
        this.setPath(m[goog.uri.utils.ComponentIndex.PATH] || "", true);
        this.setQueryData(m[goog.uri.utils.ComponentIndex.QUERY_DATA] ||
            "", true);
        this.setFragment(m[goog.uri.utils.ComponentIndex.FRAGMENT] || "", true)
    } else {
        this.ignoreCase_ = !!opt_ignoreCase;
        this.queryData_ = new goog.Uri.QueryData(null, null, this.ignoreCase_)
    }
};
goog.Uri.preserveParameterTypesCompatibilityFlag = false;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.toString = function() {
    var out = [];
    var scheme = this.getScheme();
    if (scheme) out.push(goog.Uri.encodeSpecialChars_(scheme, goog.Uri.reDisallowedInSchemeOrUserInfo_, true), ":");
    var domain = this.getDomain();
    if (domain) {
        out.push("//");
        var userInfo = this.getUserInfo();
        if (userInfo) out.push(goog.Uri.encodeSpecialChars_(userInfo, goog.Uri.reDisallowedInSchemeOrUserInfo_, true), "@");
        out.push(goog.Uri.removeDoubleEncoding_(goog.string.urlEncode(domain)));
        var port = this.getPort();
        if (port != null) out.push(":",
            String(port))
    }
    var path = this.getPath();
    if (path) {
        if (this.hasDomain() && path.charAt(0) != "/") out.push("/");
        out.push(goog.Uri.encodeSpecialChars_(path, path.charAt(0) == "/" ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_, true))
    }
    var query = this.getEncodedQuery();
    if (query) out.push("?", query);
    var fragment = this.getFragment();
    if (fragment) out.push("#", goog.Uri.encodeSpecialChars_(fragment, goog.Uri.reDisallowedInFragment_));
    return out.join("")
};
goog.Uri.prototype.resolve = function(relativeUri) {
    var absoluteUri = this.clone();
    var overridden = relativeUri.hasScheme();
    if (overridden) absoluteUri.setScheme(relativeUri.getScheme());
    else overridden = relativeUri.hasUserInfo();
    if (overridden) absoluteUri.setUserInfo(relativeUri.getUserInfo());
    else overridden = relativeUri.hasDomain();
    if (overridden) absoluteUri.setDomain(relativeUri.getDomain());
    else overridden = relativeUri.hasPort();
    var path = relativeUri.getPath();
    if (overridden) absoluteUri.setPort(relativeUri.getPort());
    else {
        overridden = relativeUri.hasPath();
        if (overridden) {
            if (path.charAt(0) != "/")
                if (this.hasDomain() && !this.hasPath()) path = "/" + path;
                else {
                    var lastSlashIndex = absoluteUri.getPath().lastIndexOf("/");
                    if (lastSlashIndex != -1) path = absoluteUri.getPath().substr(0, lastSlashIndex + 1) + path
                }
            path = goog.Uri.removeDotSegments(path)
        }
    }
    if (overridden) absoluteUri.setPath(path);
    else overridden = relativeUri.hasQuery();
    if (overridden) absoluteUri.setQueryData(relativeUri.getDecodedQuery());
    else overridden = relativeUri.hasFragment();
    if (overridden) absoluteUri.setFragment(relativeUri.getFragment());
    return absoluteUri
};
goog.Uri.prototype.clone = function() {
    return new goog.Uri(this)
};
goog.Uri.prototype.getScheme = function() {
    return this.scheme_
};
goog.Uri.prototype.setScheme = function(newScheme, opt_decode) {
    this.enforceReadOnly();
    this.scheme_ = opt_decode ? goog.Uri.decodeOrEmpty_(newScheme, true) : newScheme;
    if (this.scheme_) this.scheme_ = this.scheme_.replace(/:$/, "");
    return this
};
goog.Uri.prototype.hasScheme = function() {
    return !!this.scheme_
};
goog.Uri.prototype.getUserInfo = function() {
    return this.userInfo_
};
goog.Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
    this.enforceReadOnly();
    this.userInfo_ = opt_decode ? goog.Uri.decodeOrEmpty_(newUserInfo) : newUserInfo;
    return this
};
goog.Uri.prototype.hasUserInfo = function() {
    return !!this.userInfo_
};
goog.Uri.prototype.getDomain = function() {
    return this.domain_
};
goog.Uri.prototype.setDomain = function(newDomain, opt_decode) {
    this.enforceReadOnly();
    this.domain_ = opt_decode ? goog.Uri.decodeOrEmpty_(newDomain, true) : newDomain;
    return this
};
goog.Uri.prototype.hasDomain = function() {
    return !!this.domain_
};
goog.Uri.prototype.getPort = function() {
    return this.port_
};
goog.Uri.prototype.setPort = function(newPort) {
    this.enforceReadOnly();
    if (newPort) {
        newPort = Number(newPort);
        if (isNaN(newPort) || newPort < 0) throw Error("Bad port number " + newPort);
        this.port_ = newPort
    } else this.port_ = null;
    return this
};
goog.Uri.prototype.hasPort = function() {
    return this.port_ != null
};
goog.Uri.prototype.getPath = function() {
    return this.path_
};
goog.Uri.prototype.setPath = function(newPath, opt_decode) {
    this.enforceReadOnly();
    this.path_ = opt_decode ? goog.Uri.decodeOrEmpty_(newPath, true) : newPath;
    return this
};
goog.Uri.prototype.hasPath = function() {
    return !!this.path_
};
goog.Uri.prototype.hasQuery = function() {
    return this.queryData_.toString() !== ""
};
goog.Uri.prototype.setQueryData = function(queryData, opt_decode) {
    this.enforceReadOnly();
    if (queryData instanceof goog.Uri.QueryData) {
        this.queryData_ = queryData;
        this.queryData_.setIgnoreCase(this.ignoreCase_)
    } else {
        if (!opt_decode) queryData = goog.Uri.encodeSpecialChars_(queryData, goog.Uri.reDisallowedInQuery_);
        this.queryData_ = new goog.Uri.QueryData(queryData, null, this.ignoreCase_)
    }
    return this
};
goog.Uri.prototype.setQuery = function(newQuery, opt_decode) {
    return this.setQueryData(newQuery, opt_decode)
};
goog.Uri.prototype.getEncodedQuery = function() {
    return this.queryData_.toString()
};
goog.Uri.prototype.getDecodedQuery = function() {
    return this.queryData_.toDecodedString()
};
goog.Uri.prototype.getQueryData = function() {
    return this.queryData_
};
goog.Uri.prototype.getQuery = function() {
    return this.getEncodedQuery()
};
goog.Uri.prototype.setParameterValue = function(key, value) {
    this.enforceReadOnly();
    this.queryData_.set(key, value);
    return this
};
goog.Uri.prototype.setParameterValues = function(key, values) {
    this.enforceReadOnly();
    if (!goog.isArray(values)) values = [String(values)];
    this.queryData_.setValues(key, values);
    return this
};
goog.Uri.prototype.getParameterValues = function(name) {
    return this.queryData_.getValues(name)
};
goog.Uri.prototype.getParameterValue = function(paramName) {
    return (this.queryData_.get(paramName))
};
goog.Uri.prototype.getFragment = function() {
    return this.fragment_
};
goog.Uri.prototype.setFragment = function(newFragment, opt_decode) {
    this.enforceReadOnly();
    this.fragment_ = opt_decode ? goog.Uri.decodeOrEmpty_(newFragment) : newFragment;
    return this
};
goog.Uri.prototype.hasFragment = function() {
    return !!this.fragment_
};
goog.Uri.prototype.hasSameDomainAs = function(uri2) {
    return (!this.hasDomain() && !uri2.hasDomain() || this.getDomain() == uri2.getDomain()) && (!this.hasPort() && !uri2.hasPort() || this.getPort() == uri2.getPort())
};
goog.Uri.prototype.makeUnique = function() {
    this.enforceReadOnly();
    this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
    return this
};
goog.Uri.prototype.removeParameter = function(key) {
    this.enforceReadOnly();
    this.queryData_.remove(key);
    return this
};
goog.Uri.prototype.setReadOnly = function(isReadOnly) {
    this.isReadOnly_ = isReadOnly;
    return this
};
goog.Uri.prototype.isReadOnly = function() {
    return this.isReadOnly_
};
goog.Uri.prototype.enforceReadOnly = function() {
    if (this.isReadOnly_) throw Error("Tried to modify a read-only Uri");
};
goog.Uri.prototype.setIgnoreCase = function(ignoreCase) {
    this.ignoreCase_ = ignoreCase;
    if (this.queryData_) this.queryData_.setIgnoreCase(ignoreCase);
    return this
};
goog.Uri.prototype.getIgnoreCase = function() {
    return this.ignoreCase_
};
goog.Uri.parse = function(uri, opt_ignoreCase) {
    return uri instanceof goog.Uri ? uri.clone() : new goog.Uri(uri, opt_ignoreCase)
};
goog.Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_query, opt_fragment, opt_ignoreCase) {
    var uri = new goog.Uri(null, opt_ignoreCase);
    opt_scheme && uri.setScheme(opt_scheme);
    opt_userInfo && uri.setUserInfo(opt_userInfo);
    opt_domain && uri.setDomain(opt_domain);
    opt_port && uri.setPort(opt_port);
    opt_path && uri.setPath(opt_path);
    opt_query && uri.setQueryData(opt_query);
    opt_fragment && uri.setFragment(opt_fragment);
    return uri
};
goog.Uri.resolve = function(base, rel) {
    if (!(base instanceof goog.Uri)) base = goog.Uri.parse(base);
    if (!(rel instanceof goog.Uri)) rel = goog.Uri.parse(rel);
    return base.resolve(rel)
};
goog.Uri.removeDotSegments = function(path) {
    if (path == ".." || path == ".") return "";
    else if (!goog.string.contains(path, "./") && !goog.string.contains(path, "/.")) return path;
    else {
        var leadingSlash = goog.string.startsWith(path, "/");
        var segments = path.split("/");
        var out = [];
        for (var pos = 0; pos < segments.length;) {
            var segment = segments[pos++];
            if (segment == ".") {
                if (leadingSlash && pos == segments.length) out.push("")
            } else if (segment == "..") {
                if (out.length > 1 || out.length == 1 && out[0] != "") out.pop();
                if (leadingSlash && pos == segments.length) out.push("")
            } else {
                out.push(segment);
                leadingSlash = true
            }
        }
        return out.join("/")
    }
};
goog.Uri.decodeOrEmpty_ = function(val, opt_preserveReserved) {
    if (!val) return "";
    return opt_preserveReserved ? decodeURI(val) : decodeURIComponent(val)
};
goog.Uri.encodeSpecialChars_ = function(unescapedPart, extra, opt_removeDoubleEncoding) {
    if (goog.isString(unescapedPart)) {
        var encoded = encodeURI(unescapedPart).replace(extra, goog.Uri.encodeChar_);
        if (opt_removeDoubleEncoding) encoded = goog.Uri.removeDoubleEncoding_(encoded);
        return encoded
    }
    return null
};
goog.Uri.encodeChar_ = function(ch) {
    var n = ch.charCodeAt(0);
    return "%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16)
};
goog.Uri.removeDoubleEncoding_ = function(doubleEncodedString) {
    return doubleEncodedString.replace(/%25([0-9a-fA-F]{2})/g, "%$1")
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(uri1String, uri2String) {
    var pieces1 = goog.uri.utils.split(uri1String);
    var pieces2 = goog.uri.utils.split(uri2String);
    return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT]
};
goog.Uri.QueryData = function(opt_query, opt_uri, opt_ignoreCase) {
    this.keyMap_ = null;
    this.count_ = null;
    this.encodedQuery_ = opt_query || null;
    this.ignoreCase_ = !!opt_ignoreCase
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
    if (!this.keyMap_) {
        this.keyMap_ = new goog.structs.Map;
        this.count_ = 0;
        if (this.encodedQuery_) {
            var self = this;
            goog.uri.utils.parseQueryData(this.encodedQuery_, function(name, value) {
                self.add(goog.string.urlDecode(name), value)
            })
        }
    }
};
goog.Uri.QueryData.createFromMap = function(map, opt_uri, opt_ignoreCase) {
    var keys = goog.structs.getKeys(map);
    if (typeof keys == "undefined") throw Error("Keys are undefined");
    var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase);
    var values = goog.structs.getValues(map);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = values[i];
        if (!goog.isArray(value)) queryData.add(key, value);
        else queryData.setValues(key, value)
    }
    return queryData
};
goog.Uri.QueryData.createFromKeysValues = function(keys, values, opt_uri, opt_ignoreCase) {
    if (keys.length != values.length) throw Error("Mismatched lengths for keys/values");
    var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase);
    for (var i = 0; i < keys.length; i++) queryData.add(keys[i], values[i]);
    return queryData
};
goog.Uri.QueryData.prototype.getCount = function() {
    this.ensureKeyMapInitialized_();
    return this.count_
};
goog.Uri.QueryData.prototype.add = function(key, value) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    key = this.getKeyName_(key);
    var values = this.keyMap_.get(key);
    if (!values) this.keyMap_.set(key, values = []);
    values.push(value);
    this.count_++;
    return this
};
goog.Uri.QueryData.prototype.remove = function(key) {
    this.ensureKeyMapInitialized_();
    key = this.getKeyName_(key);
    if (this.keyMap_.containsKey(key)) {
        this.invalidateCache_();
        this.count_ -= this.keyMap_.get(key).length;
        return this.keyMap_.remove(key)
    }
    return false
};
goog.Uri.QueryData.prototype.clear = function() {
    this.invalidateCache_();
    this.keyMap_ = null;
    this.count_ = 0
};
goog.Uri.QueryData.prototype.isEmpty = function() {
    this.ensureKeyMapInitialized_();
    return this.count_ == 0
};
goog.Uri.QueryData.prototype.containsKey = function(key) {
    this.ensureKeyMapInitialized_();
    key = this.getKeyName_(key);
    return this.keyMap_.containsKey(key)
};
goog.Uri.QueryData.prototype.containsValue = function(value) {
    var vals = this.getValues();
    return goog.array.contains(vals, value)
};
goog.Uri.QueryData.prototype.getKeys = function() {
    this.ensureKeyMapInitialized_();
    var vals = (this.keyMap_.getValues());
    var keys = this.keyMap_.getKeys();
    var rv = [];
    for (var i = 0; i < keys.length; i++) {
        var val = vals[i];
        for (var j = 0; j < val.length; j++) rv.push(keys[i])
    }
    return rv
};
goog.Uri.QueryData.prototype.getValues = function(opt_key) {
    this.ensureKeyMapInitialized_();
    var rv = [];
    if (goog.isString(opt_key)) {
        if (this.containsKey(opt_key)) rv = goog.array.concat(rv, this.keyMap_.get(this.getKeyName_(opt_key)))
    } else {
        var values = this.keyMap_.getValues();
        for (var i = 0; i < values.length; i++) rv = goog.array.concat(rv, values[i])
    }
    return rv
};
goog.Uri.QueryData.prototype.set = function(key, value) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    key = this.getKeyName_(key);
    if (this.containsKey(key)) this.count_ -= this.keyMap_.get(key).length;
    this.keyMap_.set(key, [value]);
    this.count_++;
    return this
};
goog.Uri.QueryData.prototype.get = function(key, opt_default) {
    var values = key ? this.getValues(key) : [];
    if (goog.Uri.preserveParameterTypesCompatibilityFlag) return values.length > 0 ? values[0] : opt_default;
    else return values.length > 0 ? String(values[0]) : opt_default
};
goog.Uri.QueryData.prototype.setValues = function(key, values) {
    this.remove(key);
    if (values.length > 0) {
        this.invalidateCache_();
        this.keyMap_.set(this.getKeyName_(key), goog.array.clone(values));
        this.count_ += values.length
    }
};
goog.Uri.QueryData.prototype.toString = function() {
    if (this.encodedQuery_) return this.encodedQuery_;
    if (!this.keyMap_) return "";
    var sb = [];
    var keys = this.keyMap_.getKeys();
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var encodedKey = goog.string.urlEncode(key);
        var val = this.getValues(key);
        for (var j = 0; j < val.length; j++) {
            var param = encodedKey;
            if (val[j] !== "") param += "=" + goog.string.urlEncode(val[j]);
            sb.push(param)
        }
    }
    return this.encodedQuery_ = sb.join("&")
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
    return goog.Uri.decodeOrEmpty_(this.toString())
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
    this.encodedQuery_ = null
};
goog.Uri.QueryData.prototype.filterKeys = function(keys) {
    this.ensureKeyMapInitialized_();
    this.keyMap_.forEach(function(value, key) {
        if (!goog.array.contains(keys, key)) this.remove(key)
    }, this);
    return this
};
goog.Uri.QueryData.prototype.clone = function() {
    var rv = new goog.Uri.QueryData;
    rv.encodedQuery_ = this.encodedQuery_;
    if (this.keyMap_) {
        rv.keyMap_ = this.keyMap_.clone();
        rv.count_ = this.count_
    }
    return rv
};
goog.Uri.QueryData.prototype.getKeyName_ = function(arg) {
    var keyName = String(arg);
    if (this.ignoreCase_) keyName = keyName.toLowerCase();
    return keyName
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(ignoreCase) {
    var resetKeys = ignoreCase && !this.ignoreCase_;
    if (resetKeys) {
        this.ensureKeyMapInitialized_();
        this.invalidateCache_();
        this.keyMap_.forEach(function(value, key) {
            var lowerCase = key.toLowerCase();
            if (key != lowerCase) {
                this.remove(key);
                this.setValues(lowerCase, value)
            }
        }, this)
    }
    this.ignoreCase_ = ignoreCase
};
goog.Uri.QueryData.prototype.extend = function(var_args) {
    for (var i = 0; i < arguments.length; i++) {
        var data = arguments[i];
        goog.structs.forEach(data, function(value, key) {
            this.add(key, value)
        }, this)
    }
};
goog.provide("shaka.log");
shaka.log.Level = {
    NONE: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4,
    V1: 5,
    V2: 6
};
goog.define("shaka.log.MAX_LOG_LEVEL", 3);
shaka.log.error = function() {};
shaka.log.warning = function() {};
shaka.log.info = function() {};
shaka.log.debug = function() {};
shaka.log.v1 = function() {};
shaka.log.v2 = function() {};
if (!COMPILED) shaka.log.setLevel = function(level) {
    var nop = function() {};
    var log = shaka.log;
    var Level = shaka.log.Level;
    log.error = level >= Level.ERROR ? console.error.bind(console) : nop;
    log.warning = level >= Level.WARNING ? console.warn.bind(console) : nop;
    log.info = level >= Level.INFO ? console.info.bind(console) : nop;
    log.debug = level >= Level.DEBUG ? console.log.bind(console) : nop;
    log.v1 = level >= Level.V1 ? console.debug.bind(console) : nop;
    log.v2 = level >= Level.V2 ? console.debug.bind(console) : nop
};
if (shaka.log.MAX_LOG_LEVEL >= shaka.log.Level.ERROR) shaka.log.error = console.error.bind(console);
if (shaka.log.MAX_LOG_LEVEL >= shaka.log.Level.WARNING) shaka.log.warning = console.warn.bind(console);
if (shaka.log.MAX_LOG_LEVEL >= shaka.log.Level.INFO) shaka.log.info = console.info.bind(console);
if (shaka.log.MAX_LOG_LEVEL >= shaka.log.Level.DEBUG) shaka.log.debug = console.log.bind(console);
if (shaka.log.MAX_LOG_LEVEL >= shaka.log.Level.V1) shaka.log.v1 = console.debug.bind(console);
if (shaka.log.MAX_LOG_LEVEL >= shaka.log.Level.V2) shaka.log.v2 = console.debug.bind(console);
goog.provide("shaka.asserts");
goog.define("shaka.asserts.ENABLE_ASSERTS", goog.DEBUG);
shaka.asserts.assert = function() {};
shaka.asserts.notImplemented = function() {};
shaka.asserts.unreachable = function() {};
if (shaka.asserts.ENABLE_ASSERTS) {
    shaka.asserts.assert = console.assert.bind(console);
    shaka.asserts.notImplemented = console.assert.bind(console, 0 == 1, "Not implemented.");
    shaka.asserts.unreachable = console.assert.bind(console, 0 == 1, "Unreachable reached.")
};
goog.provide("shaka.util.DataViewReader");
goog.require("shaka.asserts");
shaka.util.DataViewReader = function(dataView, endianness) {
    this.dataView_ = dataView;
    this.littleEndian_ = endianness == shaka.util.DataViewReader.Endianness.LITTLE_ENDIAN;
    this.position_ = 0
};
shaka.util.DataViewReader.Endianness = {
    BIG_ENDIAN: 0,
    LITTLE_ENDIAN: 1
};
shaka.util.DataViewReader.prototype.hasMoreData = function() {
    return this.position_ < this.dataView_.byteLength
};
shaka.util.DataViewReader.prototype.getPosition = function() {
    return this.position_
};
shaka.util.DataViewReader.prototype.getLength = function() {
    return this.dataView_.byteLength
};
shaka.util.DataViewReader.prototype.readUint8 = function() {
    var value = this.dataView_.getUint8(this.position_);
    this.position_ += 1;
    return value
};
shaka.util.DataViewReader.prototype.readUint16 = function() {
    var value = this.dataView_.getUint16(this.position_, this.littleEndian_);
    this.position_ += 2;
    return value
};
shaka.util.DataViewReader.prototype.readUint32 = function() {
    var value = this.dataView_.getUint32(this.position_, this.littleEndian_);
    this.position_ += 4;
    return value
};
shaka.util.DataViewReader.prototype.readUint64 = function() {
    var low, high;
    if (this.littleEndian_) {
        low = this.dataView_.getUint32(this.position_, true);
        high = this.dataView_.getUint32(this.position_ + 4, true)
    } else {
        high = this.dataView_.getUint32(this.position_, false);
        low = this.dataView_.getUint32(this.position_ + 4, false)
    }
    if (high > 2097151) throw new RangeError("DataViewReader: Overflow reading 64-bit value.");
    this.position_ += 8;
    return high * Math.pow(2, 32) + low
};
shaka.util.DataViewReader.prototype.readBytes = function(bytes) {
    shaka.asserts.assert(bytes > 0);
    if (this.position_ + bytes > this.dataView_.byteLength) throw new RangeError("DataViewReader: Read past end of DataView.");
    var value = new Uint8Array(this.dataView_.buffer, this.position_, bytes);
    this.position_ += bytes;
    return value
};
shaka.util.DataViewReader.prototype.skip = function(bytes) {
    shaka.asserts.assert(bytes >= 0);
    if (this.position_ + bytes > this.dataView_.byteLength) throw new RangeError("DataViewReader: Skip past end of DataView.");
    this.position_ += bytes
};
goog.provide("shaka.util.StringUtils");
shaka.util.StringUtils.toBase64 = function(str, opt_padding) {
    var padding = opt_padding == undefined ? true : opt_padding;
    var base64 = window.btoa(str).replace(/\+/g, "-").replace(/\//g, "_");
    return padding ? base64 : base64.replace(/=*$/, "")
};
shaka.util.StringUtils.fromBase64 = function(str) {
    return window.atob(str.replace(/-/g, "+").replace(/_/g, "/"))
};
goog.provide("shaka.util.Uint8ArrayUtils");
goog.require("shaka.util.StringUtils");
shaka.util.Uint8ArrayUtils.toString = function(arr) {
    return String.fromCharCode.apply(null, arr)
};
shaka.util.Uint8ArrayUtils.fromString = function(str) {
    var result = new Uint8Array(str.length);
    for (var i = 0; i < str.length; ++i) result[i] = str.charCodeAt(i);
    return result
};
shaka.util.Uint8ArrayUtils.toBase64 = function(arr, opt_padding) {
    return shaka.util.StringUtils.toBase64(shaka.util.Uint8ArrayUtils.toString(arr), opt_padding)
};
shaka.util.Uint8ArrayUtils.fromBase64 = function(str) {
    return shaka.util.Uint8ArrayUtils.fromString(shaka.util.StringUtils.fromBase64(str))
};
shaka.util.Uint8ArrayUtils.fromHex = function(str) {
    var arr = new Uint8Array(str.length / 2);
    for (var i = 0; i < str.length; i += 2) arr[i / 2] = window.parseInt(str.substr(i, 2), 16);
    return arr
};
shaka.util.Uint8ArrayUtils.toHex = function(arr) {
    var hex = "";
    for (var i = 0; i < arr.length; ++i) {
        var value = arr[i].toString(16);
        if (value.length == 1) value = "0" + value;
        hex += value
    }
    return hex
};
shaka.util.Uint8ArrayUtils.equal = function(arr1, arr2) {
    if (!arr1 && !arr2) return true;
    if (!arr1 || !arr2) return false;
    if (arr1.length != arr2.length) return false;
    for (var i = 0; i < arr1.length; ++i)
        if (arr1[i] != arr2[i]) return false;
    return true
};
shaka.util.Uint8ArrayUtils.key = function(arr) {
    return Array.prototype.join.apply(arr)
};
goog.provide("shaka.util.Pssh");
goog.require("shaka.log");
goog.require("shaka.util.DataViewReader");
goog.require("shaka.util.Uint8ArrayUtils");
shaka.util.Pssh = function(psshBox) {
    this.systemIds = [];
    this.cencKeyIds = [];
    var reader = new shaka.util.DataViewReader(new DataView(psshBox.buffer), shaka.util.DataViewReader.Endianness.BIG_ENDIAN);
    try {
        while (reader.hasMoreData()) {
            var startPosition = reader.getPosition();
            var size = reader.readUint32();
            var type = reader.readUint32();
            if (size == 1) size = reader.readUint64();
            else if (size == 0) size = reader.getLength() - startPosition;
            if (type != shaka.util.Pssh.BOX_TYPE) {
                shaka.log.warning("Non-PSSH box found!");
                reader.skip(size -
                    (reader.getPosition() - startPosition));
                continue
            }
            var version = reader.readUint8();
            if (version > 1) {
                shaka.log.warning("Unrecognized PSSH version found!");
                reader.skip(size - (reader.getPosition() - startPosition));
                continue
            }
            reader.skip(3);
            var systemId = shaka.util.Uint8ArrayUtils.toHex(reader.readBytes(16));
            var keyIds = [];
            if (version > 0) {
                var numKeyIds = reader.readUint32();
                for (var i = 0; i < numKeyIds; ++i) {
                    var keyId = shaka.util.Uint8ArrayUtils.toHex(reader.readBytes(16));
                    keyIds.push(keyId)
                }
            }
            var dataSize = reader.readUint32();
            reader.skip(dataSize);
            this.cencKeyIds.push.apply(this.cencKeyIds, keyIds);
            this.systemIds.push(systemId);
            if (reader.getPosition() != startPosition + size) {
                shaka.log.warning("Mismatch between box size and data size!");
                reader.skip(size - (reader.getPosition() - startPosition))
            }
        }
    } catch (exception) {
        shaka.log.warning("PSSH parse failure!  Some data may be missing or " + "incorrect.")
    }
};
shaka.util.Pssh.BOX_TYPE = 1886614376;
goog.provide("shaka.util.LanguageUtils");
goog.require("shaka.asserts");
shaka.util.LanguageUtils.match = function(fuzz, preference, candidate) {
    var LanguageUtils = shaka.util.LanguageUtils;
    shaka.asserts.assert(preference == LanguageUtils.normalize(preference));
    shaka.asserts.assert(candidate == LanguageUtils.normalize(candidate));
    if (candidate == preference) return true;
    if (fuzz >= shaka.util.LanguageUtils.MatchType.BASE_LANGUAGE_OKAY && candidate == preference.split("-")[0]) return true;
    if (fuzz >= shaka.util.LanguageUtils.MatchType.OTHER_SUB_LANGUAGE_OKAY && candidate.split("-")[0] == preference.split("-")[0]) return true;
    return false
};
shaka.util.LanguageUtils.MatchType = {
    EXACT: 0,
    BASE_LANGUAGE_OKAY: 1,
    OTHER_SUB_LANGUAGE_OKAY: 2,
    MIN: 0,
    MAX: 2
};
shaka.util.LanguageUtils.normalize = function(lang) {
    var fields = lang.toLowerCase().split("-");
    var base = fields[0];
    var replacement = shaka.util.LanguageUtils.isoMap_[base];
    if (replacement) fields[0] = replacement;
    return fields.join("-")
};
shaka.util.LanguageUtils.isoMap_ = {
    "aar": "aa",
    "abk": "ab",
    "afr": "af",
    "aka": "ak",
    "alb": "sq",
    "amh": "am",
    "ara": "ar",
    "arg": "an",
    "arm": "hy",
    "asm": "as",
    "ava": "av",
    "ave": "ae",
    "aym": "ay",
    "aze": "az",
    "bak": "ba",
    "bam": "bm",
    "baq": "eu",
    "bel": "be",
    "ben": "bn",
    "bih": "bh",
    "bis": "bi",
    "bod": "bo",
    "bos": "bs",
    "bre": "br",
    "bul": "bg",
    "bur": "my",
    "cat": "ca",
    "ces": "cs",
    "cha": "ch",
    "che": "ce",
    "chi": "zh",
    "chu": "cu",
    "chv": "cv",
    "cor": "kw",
    "cos": "co",
    "cre": "cr",
    "cym": "cy",
    "cze": "cs",
    "dan": "da",
    "deu": "de",
    "div": "dv",
    "dut": "nl",
    "dzo": "dz",
    "ell": "el",
    "eng": "en",
    "epo": "eo",
    "est": "et",
    "eus": "eu",
    "ewe": "ee",
    "fao": "fo",
    "fas": "fa",
    "fij": "fj",
    "fin": "fi",
    "fra": "fr",
    "fre": "fr",
    "fry": "fy",
    "ful": "ff",
    "geo": "ka",
    "ger": "de",
    "gla": "gd",
    "gle": "ga",
    "glg": "gl",
    "glv": "gv",
    "gre": "el",
    "grn": "gn",
    "guj": "gu",
    "hat": "ht",
    "hau": "ha",
    "heb": "he",
    "her": "hz",
    "hin": "hi",
    "hmo": "ho",
    "hrv": "hr",
    "hun": "hu",
    "hye": "hy",
    "ibo": "ig",
    "ice": "is",
    "ido": "io",
    "iii": "ii",
    "iku": "iu",
    "ile": "ie",
    "ina": "ia",
    "ind": "id",
    "ipk": "ik",
    "isl": "is",
    "ita": "it",
    "jav": "jv",
    "jpn": "ja",
    "kal": "kl",
    "kan": "kn",
    "kas": "ks",
    "kat": "ka",
    "kau": "kr",
    "kaz": "kk",
    "khm": "km",
    "kik": "ki",
    "kin": "rw",
    "kir": "ky",
    "kom": "kv",
    "kon": "kg",
    "kor": "ko",
    "kua": "kj",
    "kur": "ku",
    "lao": "lo",
    "lat": "la",
    "lav": "lv",
    "lim": "li",
    "lin": "ln",
    "lit": "lt",
    "ltz": "lb",
    "lub": "lu",
    "lug": "lg",
    "mac": "mk",
    "mah": "mh",
    "mal": "ml",
    "mao": "mi",
    "mar": "mr",
    "may": "ms",
    "mkd": "mk",
    "mlg": "mg",
    "mlt": "mt",
    "mon": "mn",
    "mri": "mi",
    "msa": "ms",
    "mya": "my",
    "nau": "na",
    "nav": "nv",
    "nbl": "nr",
    "nde": "nd",
    "ndo": "ng",
    "nep": "ne",
    "nld": "nl",
    "nno": "nn",
    "nob": "nb",
    "nor": "no",
    "nya": "ny",
    "oci": "oc",
    "oji": "oj",
    "ori": "or",
    "orm": "om",
    "oss": "os",
    "pan": "pa",
    "per": "fa",
    "pli": "pi",
    "pol": "pl",
    "por": "pt",
    "pus": "ps",
    "que": "qu",
    "roh": "rm",
    "ron": "ro",
    "rum": "ro",
    "run": "rn",
    "rus": "ru",
    "sag": "sg",
    "san": "sa",
    "sin": "si",
    "slk": "sk",
    "slo": "sk",
    "slv": "sl",
    "sme": "se",
    "smo": "sm",
    "sna": "sn",
    "snd": "sd",
    "som": "so",
    "sot": "st",
    "spa": "es",
    "sqi": "sq",
    "srd": "sc",
    "srp": "sr",
    "ssw": "ss",
    "sun": "su",
    "swa": "sw",
    "swe": "sv",
    "tah": "ty",
    "tam": "ta",
    "tat": "tt",
    "tel": "te",
    "tgk": "tg",
    "tgl": "tl",
    "tha": "th",
    "tib": "bo",
    "tir": "ti",
    "ton": "to",
    "tsn": "tn",
    "tso": "ts",
    "tuk": "tk",
    "tur": "tr",
    "twi": "tw",
    "uig": "ug",
    "ukr": "uk",
    "urd": "ur",
    "uzb": "uz",
    "ven": "ve",
    "vie": "vi",
    "vol": "vo",
    "wel": "cy",
    "wln": "wa",
    "wol": "wo",
    "xho": "xh",
    "yid": "yi",
    "yor": "yo",
    "zha": "za",
    "zho": "zh",
    "zul": "zu"
};
goog.provide("shaka.dash.mpd");
goog.require("goog.Uri");
goog.require("shaka.log");
goog.require("shaka.util.DataViewReader");
goog.require("shaka.util.LanguageUtils");
goog.require("shaka.util.Pssh");
goog.require("shaka.util.Uint8ArrayUtils");
shaka.dash.mpd.parseMpd = function(source, url) {
    var parser = new DOMParser;
    var xml = parser.parseFromString(source, "text/xml");
    if (!xml) {
        shaka.log.error("Failed to parse MPD XML.");
        return null
    }
    var parent = {
        baseUrl: new goog.Uri(url)
    };
    return shaka.dash.mpd.parseChild_(parent, xml, shaka.dash.mpd.Mpd)
};
shaka.dash.mpd.DEFAULT_MIN_BUFFER_TIME_ = 5;
shaka.dash.mpd.DEFAULT_SUGGESTED_PRESENTATION_DELAY_ = 1;
shaka.dash.mpd.Mpd = function() {
    this.id = null;
    this.type = null;
    this.baseUrl = null;
    this.mediaPresentationDuration = null;
    this.minBufferTime = shaka.dash.mpd.DEFAULT_MIN_BUFFER_TIME_;
    this.minUpdatePeriod = null;
    this.availabilityStartTime = null;
    this.timeShiftBufferDepth = null;
    this.suggestedPresentationDelay = shaka.dash.mpd.DEFAULT_SUGGESTED_PRESENTATION_DELAY_;
    this.periods = []
};
shaka.dash.mpd.Period = function() {
    this.id = null;
    this.start = null;
    this.duration = null;
    this.baseUrl = null;
    this.segmentBase = null;
    this.segmentList = null;
    this.segmentTemplate = null;
    this.adaptationSets = []
};
shaka.dash.mpd.AdaptationSet = function() {
    this.id = null;
    this.lang = null;
    this.contentType = null;
    this.width = null;
    this.height = null;
    this.mimeType = null;
    this.codecs = null;
    this.baseUrl = null;
    this.segmentBase = null;
    this.segmentList = null;
    this.segmentTemplate = null;
    this.contentProtections = [];
    this.representations = []
};
shaka.dash.mpd.Role = function() {
    this.value = null
};
shaka.dash.mpd.ContentComponent = function() {
    this.id = null;
    this.lang = null;
    this.contentType = null
};
shaka.dash.mpd.Representation = function() {
    this.id = null;
    this.lang = null;
    this.bandwidth = null;
    this.width = null;
    this.height = null;
    this.mimeType = null;
    this.codecs = null;
    this.baseUrl = null;
    this.segmentBase = null;
    this.segmentList = null;
    this.segmentTemplate = null;
    this.contentProtections = [];
    this.main = false
};
shaka.dash.mpd.ContentProtection = function() {
    this.schemeIdUri = null;
    this.value = null;
    this.children = [];
    this.pssh = null
};
shaka.dash.mpd.CencPssh = function() {
    this.psshBox = null;
    this.parsedPssh = null
};
shaka.dash.mpd.BaseUrl = function() {
    this.url = null
};
shaka.dash.mpd.SegmentBase = function() {
    this.baseUrl = null;
    this.timescale = 1;
    this.presentationTimeOffset = null;
    this.indexRange = null;
    this.representationIndex = null;
    this.initialization = null
};
shaka.dash.mpd.SegmentBase.prototype.clone = function() {
    var mpd = shaka.dash.mpd;
    var clone = new shaka.dash.mpd.SegmentBase;
    clone.baseUrl = this.baseUrl ? new goog.Uri(this.baseUrl) : null;
    clone.timescale = this.timescale;
    clone.presentationTimeOffset = this.presentationTimeOffset;
    clone.indexRange = mpd.clone_(this.indexRange);
    clone.representationIndex = mpd.clone_(this.representationIndex);
    clone.initialization = mpd.clone_(this.initialization);
    return clone
};
shaka.dash.mpd.RepresentationIndex = function() {
    this.url = null;
    this.range = null
};
shaka.dash.mpd.RepresentationIndex.prototype.clone = function() {
    var mpd = shaka.dash.mpd;
    var clone = new shaka.dash.mpd.RepresentationIndex;
    clone.url = this.url ? new goog.Uri(this.url) : null;
    clone.range = mpd.clone_(this.range);
    return clone
};
shaka.dash.mpd.Initialization = function() {
    this.url = null;
    this.range = null
};
shaka.dash.mpd.Initialization.prototype.clone = function() {
    var mpd = shaka.dash.mpd;
    var clone = new shaka.dash.mpd.Initialization;
    clone.url = this.url ? new goog.Uri(this.url) : null;
    clone.range = mpd.clone_(this.range);
    return clone
};
shaka.dash.mpd.SegmentList = function() {
    this.baseUrl = null;
    this.timescale = 1;
    this.presentationTimeOffset = null;
    this.segmentDuration = null;
    this.startNumber = 1;
    this.initialization = null;
    this.segmentUrls = []
};
shaka.dash.mpd.SegmentList.prototype.clone = function() {
    var mpd = shaka.dash.mpd;
    var clone = new shaka.dash.mpd.SegmentList;
    clone.baseUrl = this.baseUrl ? new goog.Uri(this.baseUrl) : null;
    clone.timescale = this.timescale;
    clone.presentationTimeOffset = this.presentationTimeOffset;
    clone.segmentDuration = this.segmentDuration;
    clone.startNumber = this.startNumber;
    clone.initialization = mpd.clone_(this.initialization);
    clone.segmentUrls = this.segmentUrls.map(function(segmentUrl) {
        return segmentUrl.clone()
    });
    return clone
};
shaka.dash.mpd.SegmentUrl = function() {
    this.mediaUrl = null;
    this.mediaRange = null
};
shaka.dash.mpd.SegmentUrl.prototype.clone = function() {
    var mpd = shaka.dash.mpd;
    var clone = new shaka.dash.mpd.SegmentUrl;
    clone.mediaUrl = this.mediaUrl ? new goog.Uri(this.mediaUrl) : null;
    clone.mediaRange = mpd.clone_(this.mediaRange);
    return clone
};
shaka.dash.mpd.SegmentTemplate = function() {
    this.timescale = 1;
    this.presentationTimeOffset = null;
    this.segmentDuration = null;
    this.startNumber = 1;
    this.mediaUrlTemplate = null;
    this.indexUrlTemplate = null;
    this.initializationUrlTemplate = null;
    this.timeline = null
};
shaka.dash.mpd.SegmentTemplate.prototype.clone = function() {
    var mpd = shaka.dash.mpd;
    var clone = new shaka.dash.mpd.SegmentTemplate;
    clone.timescale = this.timescale;
    clone.presentationTimeOffset = this.presentationTimeOffset;
    clone.segmentDuration = this.segmentDuration;
    clone.startNumber = this.startNumber;
    clone.mediaUrlTemplate = this.mediaUrlTemplate;
    clone.indexUrlTemplate = this.indexUrlTemplate;
    clone.initializationUrlTemplate = this.initializationUrlTemplate;
    clone.timeline = mpd.clone_(this.timeline);
    return clone
};
shaka.dash.mpd.SegmentTimeline = function() {
    this.timePoints = []
};
shaka.dash.mpd.SegmentTimeline.prototype.clone = function() {
    var clone = new shaka.dash.mpd.SegmentTimeline;
    clone.timePoints = this.timePoints.map(function(timePoint) {
        return timePoint.clone()
    });
    return clone
};
shaka.dash.mpd.SegmentTimePoint = function() {
    this.startTime = null;
    this.duration = null;
    this.repeat = null
};
shaka.dash.mpd.SegmentTimePoint.prototype.clone = function() {
    var clone = new shaka.dash.mpd.SegmentTimePoint;
    clone.startTime = this.startTime;
    clone.duration = this.duration;
    clone.repeat = this.repeat;
    return clone
};
shaka.dash.mpd.Range = function(begin, end) {
    this.begin = begin;
    this.end = end
};
shaka.dash.mpd.Range.prototype.clone = function() {
    return new shaka.dash.mpd.Range(this.begin, this.end)
};
shaka.dash.mpd.Mpd.TAG_NAME = "MPD";
shaka.dash.mpd.Period.TAG_NAME = "Period";
shaka.dash.mpd.AdaptationSet.TAG_NAME = "AdaptationSet";
shaka.dash.mpd.Role.TAG_NAME = "Role";
shaka.dash.mpd.ContentComponent.TAG_NAME = "ContentComponent";
shaka.dash.mpd.Representation.TAG_NAME = "Representation";
shaka.dash.mpd.ContentProtection.TAG_NAME = "ContentProtection";
shaka.dash.mpd.CencPssh.TAG_NAME = "cenc:pssh";
shaka.dash.mpd.BaseUrl.TAG_NAME = "BaseURL";
shaka.dash.mpd.SegmentBase.TAG_NAME = "SegmentBase";
shaka.dash.mpd.RepresentationIndex.TAG_NAME = "RepresentationIndex";
shaka.dash.mpd.Initialization.TAG_NAME = "Initialization";
shaka.dash.mpd.SegmentList.TAG_NAME = "SegmentList";
shaka.dash.mpd.SegmentUrl.TAG_NAME = "SegmentURL";
shaka.dash.mpd.SegmentTemplate.TAG_NAME = "SegmentTemplate";
shaka.dash.mpd.SegmentTimeline.TAG_NAME = "SegmentTimeline";
shaka.dash.mpd.SegmentTimePoint.TAG_NAME = "S";
shaka.dash.mpd.Mpd.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.id = mpd.parseAttr_(elem, "id", mpd.parseString_);
    this.type = mpd.parseAttr_(elem, "type", mpd.parseString_);
    this.mediaPresentationDuration = mpd.parseAttr_(elem, "mediaPresentationDuration", mpd.parseDuration_);
    this.minBufferTime = mpd.parseAttr_(elem, "minBufferTime", mpd.parseDuration_, this.minBufferTime);
    this.minUpdatePeriod = mpd.parseAttr_(elem, "minimumUpdatePeriod", mpd.parseDuration_, this.minUpdatePeriod);
    if (this.minUpdatePeriod ==
        0) this.minUpdatePeriod = 10;
    this.availabilityStartTime = mpd.parseAttr_(elem, "availabilityStartTime", mpd.parseDate_, this.availabilityStartTime);
    this.timeShiftBufferDepth = mpd.parseAttr_(elem, "timeShiftBufferDepth", mpd.parseDuration_, this.timeShiftBufferDepth);
    this.suggestedPresentationDelay = mpd.parseAttr_(elem, "suggestedPresentationDelay", mpd.parseDuration_, this.suggestedPresentationDelay);
    var baseUrl = mpd.parseChild_(this, elem, mpd.BaseUrl);
    this.baseUrl = mpd.resolveUrl_(parent.baseUrl, baseUrl ? baseUrl.url :
        null);
    this.periods = mpd.parseChildren_(this, elem, mpd.Period)
};
shaka.dash.mpd.Period.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.id = mpd.parseAttr_(elem, "id", mpd.parseString_);
    this.start = mpd.parseAttr_(elem, "start", mpd.parseDuration_);
    this.duration = mpd.parseAttr_(elem, "duration", mpd.parseDuration_);
    var baseUrl = mpd.parseChild_(this, elem, mpd.BaseUrl);
    this.baseUrl = mpd.resolveUrl_(parent.baseUrl, baseUrl ? baseUrl.url : null);
    this.segmentBase = mpd.parseChild_(this, elem, mpd.SegmentBase);
    this.segmentList = mpd.parseChild_(this, elem, mpd.SegmentList);
    this.segmentTemplate =
        mpd.parseChild_(this, elem, mpd.SegmentTemplate);
    this.adaptationSets = mpd.parseChildren_(this, elem, mpd.AdaptationSet)
};
shaka.dash.mpd.AdaptationSet.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    var contentComponent = mpd.parseChild_(this, elem, mpd.ContentComponent) || {};
    var role = mpd.parseChild_(this, elem, mpd.Role);
    this.id = mpd.parseAttr_(elem, "id", mpd.parseString_);
    this.lang = mpd.parseAttr_(elem, "lang", mpd.parseString_, contentComponent.lang);
    this.contentType = mpd.parseAttr_(elem, "contentType", mpd.parseString_, contentComponent.contentType);
    this.width = mpd.parseAttr_(elem, "width", mpd.parsePositiveInt_);
    this.height =
        mpd.parseAttr_(elem, "height", mpd.parsePositiveInt_);
    this.mimeType = mpd.parseAttr_(elem, "mimeType", mpd.parseString_);
    this.codecs = mpd.parseAttr_(elem, "codecs", mpd.parseString_);
    this.main = role && role.value == "main";
    if (this.lang) this.lang = shaka.util.LanguageUtils.normalize(this.lang);
    var baseUrl = mpd.parseChild_(this, elem, mpd.BaseUrl);
    this.baseUrl = mpd.resolveUrl_(parent.baseUrl, baseUrl ? baseUrl.url : null);
    this.contentProtections = mpd.parseChildren_(this, elem, mpd.ContentProtection);
    if (!this.contentType && this.mimeType) this.contentType =
        this.mimeType.split("/")[0];
    this.segmentBase = parent.segmentBase ? mpd.mergeChild_(this, elem, parent.segmentBase) : mpd.parseChild_(this, elem, mpd.SegmentBase);
    this.segmentList = parent.segmentList ? mpd.mergeChild_(this, elem, parent.segmentList) : mpd.parseChild_(this, elem, mpd.SegmentList);
    this.segmentTemplate = parent.segmentTemplate ? mpd.mergeChild_(this, elem, parent.segmentTemplate) : mpd.parseChild_(this, elem, mpd.SegmentTemplate);
    this.representations = mpd.parseChildren_(this, elem, mpd.Representation);
    if (!this.mimeType &&
        this.representations.length) {
        this.mimeType = this.representations[0].mimeType;
        if (!this.contentType && this.mimeType) this.contentType = this.mimeType.split("/")[0]
    }
};
shaka.dash.mpd.Role.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.value = mpd.parseAttr_(elem, "value", mpd.parseString_)
};
shaka.dash.mpd.ContentComponent.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.id = mpd.parseAttr_(elem, "id", mpd.parseString_);
    this.lang = mpd.parseAttr_(elem, "lang", mpd.parseString_);
    this.contentType = mpd.parseAttr_(elem, "contentType", mpd.parseString_);
    if (this.lang) this.lang = shaka.util.LanguageUtils.normalize(this.lang)
};
shaka.dash.mpd.Representation.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.id = mpd.parseAttr_(elem, "id", mpd.parseString_);
    this.bandwidth = mpd.parseAttr_(elem, "bandwidth", mpd.parsePositiveInt_);
    this.width = mpd.parseAttr_(elem, "width", mpd.parsePositiveInt_, parent.width);
    this.height = mpd.parseAttr_(elem, "height", mpd.parsePositiveInt_, parent.height);
    this.mimeType = mpd.parseAttr_(elem, "mimeType", mpd.parseString_, parent.mimeType);
    this.codecs = mpd.parseAttr_(elem, "codecs", mpd.parseString_,
        parent.codecs);
    this.lang = parent.lang;
    var baseUrl = mpd.parseChild_(this, elem, mpd.BaseUrl);
    this.baseUrl = mpd.resolveUrl_(parent.baseUrl, baseUrl ? baseUrl.url : null);
    this.contentProtections = mpd.parseChildren_(this, elem, mpd.ContentProtection);
    this.segmentBase = parent.segmentBase ? mpd.mergeChild_(this, elem, parent.segmentBase) : mpd.parseChild_(this, elem, mpd.SegmentBase);
    this.segmentList = parent.segmentList ? mpd.mergeChild_(this, elem, parent.segmentList) : mpd.parseChild_(this, elem, mpd.SegmentList);
    this.segmentTemplate =
        parent.segmentTemplate ? mpd.mergeChild_(this, elem, parent.segmentTemplate) : mpd.parseChild_(this, elem, mpd.SegmentTemplate);
    if (this.contentProtections.length == 0) this.contentProtections = parent.contentProtections
};
shaka.dash.mpd.ContentProtection.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.schemeIdUri = mpd.parseAttr_(elem, "schemeIdUri", mpd.parseString_);
    this.value = mpd.parseAttr_(elem, "value", mpd.parseString_);
    this.pssh = mpd.parseChild_(this, elem, mpd.CencPssh);
    this.children = Array.prototype.slice.call(elem.childNodes)
};
shaka.dash.mpd.CencPssh.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
    var contents = mpd.getContents_(elem);
    if (!contents) return;
    this.psshBox = Uint8ArrayUtils.fromBase64(contents);
    try {
        this.parsedPssh = new shaka.util.Pssh(this.psshBox)
    } catch (exception) {
        if (!(exception instanceof RangeError)) throw exception;
    }
};
shaka.dash.mpd.BaseUrl.prototype.parse = function(parent, elem) {
    this.url = shaka.dash.mpd.getContents_(elem)
};
shaka.dash.mpd.SegmentBase.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.baseUrl = parent.baseUrl || this.baseUrl;
    this.timescale = mpd.parseAttr_(elem, "timescale", mpd.parsePositiveInt_, this.timescale);
    this.presentationTimeOffset = mpd.parseAttr_(elem, "presentationTimeOffset", mpd.parseNonNegativeInt_, this.presentationTimeOffset);
    this.indexRange = mpd.parseAttr_(elem, "indexRange", mpd.parseRange_, this.indexRange);
    this.representationIndex = mpd.parseChild_(this, elem, mpd.RepresentationIndex) ||
        this.representationIndex;
    this.initialization = mpd.parseChild_(this, elem, mpd.Initialization) || this.initialization
};
shaka.dash.mpd.RepresentationIndex.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    var url = mpd.parseAttr_(elem, "sourceURL", mpd.parseString_);
    this.url = mpd.resolveUrl_(parent.baseUrl, url);
    this.range = mpd.parseAttr_(elem, "range", mpd.parseRange_, mpd.clone_(parent.indexRange))
};
shaka.dash.mpd.Initialization.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    var url = mpd.parseAttr_(elem, "sourceURL", mpd.parseString_);
    this.url = mpd.resolveUrl_(parent.baseUrl, url);
    this.range = mpd.parseAttr_(elem, "range", mpd.parseRange_)
};
shaka.dash.mpd.SegmentList.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.baseUrl = parent.baseUrl || this.baseUrl;
    this.timescale = mpd.parseAttr_(elem, "timescale", mpd.parsePositiveInt_, this.timescale);
    this.presentationTimeOffset = mpd.parseAttr_(elem, "presentationTimeOffset", mpd.parseNonNegativeInt_, this.presentationTimeOffset);
    this.segmentDuration = mpd.parseAttr_(elem, "duration", mpd.parsePositiveInt_, this.segmentDuration);
    this.startNumber = mpd.parseAttr_(elem, "startNumber", mpd.parsePositiveInt_,
        this.startNumber) || 1;
    this.initialization = mpd.parseChild_(this, elem, mpd.Initialization) || this.initialization;
    this.segmentUrls = mpd.parseChildren_(this, elem, mpd.SegmentUrl) || this.segmentUrls
};
shaka.dash.mpd.SegmentUrl.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    var url = mpd.parseAttr_(elem, "media", mpd.parseString_);
    this.mediaUrl = mpd.resolveUrl_(parent.baseUrl, url);
    this.mediaRange = mpd.parseAttr_(elem, "mediaRange", mpd.parseRange_)
};
shaka.dash.mpd.SegmentTemplate.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.timescale = mpd.parseAttr_(elem, "timescale", mpd.parsePositiveInt_, this.timescale);
    this.presentationTimeOffset = mpd.parseAttr_(elem, "presentationTimeOffset", mpd.parseNonNegativeInt_, this.presentationTimeOffset);
    this.segmentDuration = mpd.parseAttr_(elem, "duration", mpd.parsePositiveInt_, this.segmentDuration);
    this.startNumber = mpd.parseAttr_(elem, "startNumber", mpd.parsePositiveInt_, this.startNumber) || 1;
    this.mediaUrlTemplate =
        mpd.parseAttr_(elem, "media", mpd.parseString_, this.mediaUrlTemplate);
    this.indexUrlTemplate = mpd.parseAttr_(elem, "index", mpd.parseString_, this.indexUrlTemplate);
    this.initializationUrlTemplate = mpd.parseAttr_(elem, "initialization", mpd.parseString_, this.initializationUrlTemplate);
    this.timeline = mpd.parseChild_(this, elem, mpd.SegmentTimeline) || this.timeline
};
shaka.dash.mpd.SegmentTimeline.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.timePoints = mpd.parseChildren_(this, elem, mpd.SegmentTimePoint)
};
shaka.dash.mpd.SegmentTimePoint.prototype.parse = function(parent, elem) {
    var mpd = shaka.dash.mpd;
    this.startTime = mpd.parseAttr_(elem, "t", mpd.parseNonNegativeInt_);
    this.duration = mpd.parseAttr_(elem, "d", mpd.parseNonNegativeInt_);
    this.repeat = mpd.parseAttr_(elem, "r", mpd.parseNonNegativeInt_)
};
shaka.dash.mpd.resolveUrl_ = function(baseUrl, urlString) {
    var url = urlString ? new goog.Uri(urlString) : null;
    if (baseUrl) return url ? baseUrl.resolve(url) : baseUrl;
    else return url
};
shaka.dash.mpd.mergeChild_ = function(parent, elem, original) {
    var mpd = shaka.dash.mpd;
    var merged = mpd.clone_(original);
    shaka.asserts.assert(merged);
    var childElement = mpd.findChild_(elem, original.constructor.TAG_NAME);
    if (childElement) merged.parse(parent, childElement);
    return merged
};
shaka.dash.mpd.parseChild_ = function(parent, elem, constructor) {
    var mpd = shaka.dash.mpd;
    var parsedChild = null;
    var childElement = mpd.findChild_(elem, constructor.TAG_NAME);
    if (childElement) {
        parsedChild = new constructor;
        parsedChild.parse(parent, childElement)
    }
    return parsedChild
};
shaka.dash.mpd.findChild_ = function(elem, name) {
    var childElement = null;
    for (var i = 0; i < elem.childNodes.length; i++) {
        if (elem.childNodes[i].tagName != name) continue;
        if (childElement) return null;
        childElement = elem.childNodes[i]
    }
    return childElement
};
shaka.dash.mpd.parseChildren_ = function(parent, elem, constructor) {
    var parsedChildren = [];
    for (var i = 0; i < elem.childNodes.length; i++) {
        if (elem.childNodes[i].tagName != constructor.TAG_NAME) continue;
        var parsedChild = new constructor;
        parsedChild.parse.call(parsedChild, parent, elem.childNodes[i]);
        parsedChildren.push(parsedChild)
    }
    return parsedChildren
};
shaka.dash.mpd.getContents_ = function(elem) {
    var contents = elem.firstChild;
    if (contents.nodeType != Node.TEXT_NODE) return null;
    return contents.nodeValue
};
shaka.dash.mpd.clone_ = function(obj) {
    return obj ? obj.clone() : null
};
shaka.dash.mpd.parseAttr_ = function(elem, name, parseFunction, opt_defaultValue) {
    var parsedValue = parseFunction(elem.getAttribute(name));
    if (parsedValue != null) return parsedValue;
    else return opt_defaultValue !== undefined ? opt_defaultValue : null
};
shaka.dash.mpd.parseDate_ = function(dateString) {
    if (!dateString) return null;
    var result = Date.parse(dateString);
    return !isNaN(result) ? Math.floor(result / 1E3) : null
};
shaka.dash.mpd.parseDuration_ = function(durationString) {
    if (!durationString) return null;
    var regexpString = "^P(?:([0-9]*)Y)?(?:([0-9]*)M)?(?:([0-9]*)D)?" + "(?:T(?:([0-9]*)H)?(?:([0-9]*)M)?(?:([0-9.]*)S)?)?$";
    var matches = (new RegExp(regexpString)).exec(durationString);
    if (!matches) {
        shaka.log.warning("Invalid duration string:", durationString);
        return null
    }
    var duration = 0;
    var years = shaka.dash.mpd.parseNonNegativeInt_(matches[1]);
    if (years) duration += 60 * 60 * 24 * 365 * years;
    var months = shaka.dash.mpd.parseNonNegativeInt_(matches[2]);
    if (months) duration += 60 * 60 * 24 * 30 * months;
    var days = shaka.dash.mpd.parseNonNegativeInt_(matches[3]);
    if (days) duration += 60 * 60 * 24 * days;
    var hours = shaka.dash.mpd.parseNonNegativeInt_(matches[4]);
    if (hours) duration += 60 * 60 * hours;
    var minutes = shaka.dash.mpd.parseNonNegativeInt_(matches[5]);
    if (minutes) duration += 60 * minutes;
    var seconds = shaka.dash.mpd.parseFloat_(matches[6]);
    if (seconds) duration += seconds;
    return duration
};
shaka.dash.mpd.parseRange_ = function(rangeString) {
    var matches = /([0-9]+)-([0-9]+)/.exec(rangeString);
    if (!matches) return null;
    var begin = shaka.dash.mpd.parseNonNegativeInt_(matches[1]);
    if (begin == null) return null;
    var end = shaka.dash.mpd.parseNonNegativeInt_(matches[2]);
    if (end == null) return null;
    return new shaka.dash.mpd.Range(begin, end)
};
shaka.dash.mpd.parsePositiveInt_ = function(intString) {
    var result = window.parseInt(intString, 10);
    return result > 0 ? result : null
};
shaka.dash.mpd.parseNonNegativeInt_ = function(intString) {
    var result = window.parseInt(intString, 10);
    return result >= 0 ? result : null
};
shaka.dash.mpd.parseFloat_ = function(floatString) {
    var result = window.parseFloat(floatString);
    return !isNaN(result) ? result : null
};
shaka.dash.mpd.parseString_ = function(inputString) {
    return inputString
};
goog.provide("shaka.media.SegmentReference");
goog.require("goog.Uri");
shaka.media.SegmentReference = function(id, startTime, endTime, startByte, endByte, url) {
    shaka.asserts.assert(endTime == null || startTime <= endTime, "startTime should be <= endTime");
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.startByte = startByte;
    this.endByte = endByte;
    this.url = url
};
shaka.media.SegmentReference.prototype.adjust = function(startTime, endTime) {
    return new shaka.media.SegmentReference(this.id, startTime, endTime, this.startByte, this.endByte, this.url)
};
goog.provide("shaka.media.SegmentRange");
goog.require("shaka.asserts");
goog.require("shaka.media.SegmentReference");
shaka.media.SegmentRange = function(references) {
    shaka.asserts.assert(references.length > 0);
    this.references = references
};
goog.provide("shaka.util.ArrayUtils");
shaka.util.ArrayUtils.removeDuplicates = function(array, opt_keyFn) {
    var set = {};
    for (var i = 0; i < array.length; ++i) {
        var key = opt_keyFn ? opt_keyFn(array[i]) : array[i].toString();
        set[key] = array[i]
    }
    var result = [];
    for (var k in set) result.push(set[k]);
    return result
};
goog.provide("shaka.media.SegmentIndex");
goog.require("shaka.asserts");
goog.require("shaka.media.SegmentRange");
goog.require("shaka.media.SegmentReference");
goog.require("shaka.util.ArrayUtils");
shaka.media.SegmentIndex = function(references) {
    this.references_ = references;
    this.timestampCorrection_ = 0;
    this.assertCorrectReferences_()
};
shaka.media.SegmentIndex.prototype.length = function() {
    return this.references_.length
};
shaka.media.SegmentIndex.prototype.first = function() {
    if (this.references_.length == 0) throw new RangeError("SegmentIndex: There is no first SegmentReference.");
    return this.references_[0]
};
shaka.media.SegmentIndex.prototype.last = function() {
    if (this.references_.length == 0) throw new RangeError("SegmentIndex: There is no last SegmentReference.");
    return this.references_[this.references_.length - 1]
};
shaka.media.SegmentIndex.prototype.get = function(index) {
    if (index < 0 || index >= this.references_.length) throw new RangeError("SegmentIndex: The specified index is out of range.");
    return this.references_[index]
};
shaka.media.SegmentIndex.prototype.getRangeForInterval = function(startTime, duration) {
    var beginIndex = this.find(startTime);
    if (beginIndex < 0) return null;
    var references = [];
    for (var i = beginIndex; i < this.references_.length; i++) {
        references.push(this.references_[i]);
        var endTime = this.references_[i].endTime;
        if (!endTime || endTime > startTime + duration) break
    }
    return new shaka.media.SegmentRange(references)
};
shaka.media.SegmentIndex.prototype.find = function(time) {
    for (var i = 0; i < this.references_.length; i++)
        if (this.references_[i].startTime > time) return i ? i - 1 : 0;
    return this.references_.length - 1
};
shaka.media.SegmentIndex.prototype.merge = function(segmentIndex) {
    if (this.timestampCorrection_ != segmentIndex.timestampCorrection_) {
        var delta = this.timestampCorrection_ - segmentIndex.timestampCorrection_;
        shaka.log.v1("Shifting new SegmentReferences by", delta, "seconds before merging.");
        segmentIndex = new shaka.media.SegmentIndex(shaka.media.SegmentIndex.shift_(segmentIndex.references_, delta))
    }
    if (this.length() == 0) {
        this.references_ = segmentIndex.references_.slice(0);
        this.assertCorrectReferences_();
        return
    }
    if (segmentIndex.length() ==
        0) {
        shaka.log.debug("Nothing to merge: new SegmentIndex is empty.");
        return
    }
    if (this.last().endTime == null) {
        shaka.log.debug("Nothing to merge:", "existing SegmentIndex ends at the end of the stream.");
        return
    }
    if (segmentIndex.last().endTime != null && segmentIndex.last().endTime < this.last().endTime) {
        shaka.log.debug("Nothing to merge:", "new SegmentIndex ends before the existing one ends.");
        return
    }
    if (this.last().endTime <= segmentIndex.first().startTime) {
        var adjustedReference = this.last().adjust(this.last().startTime,
            segmentIndex.first().startTime);
        var head = this.references_.slice(0, -1).concat([adjustedReference]);
        this.references_ = head.concat(segmentIndex.references_);
        this.assertCorrectReferences_();
        return
    }
    var i;
    for (i = 0; i < this.references_.length; ++i)
        if (this.references_[i].endTime >= segmentIndex.first().startTime) break;
    shaka.asserts.assert(i < this.references_.length);
    var head;
    if (this.references_[i].startTime < segmentIndex.first().startTime) {
        var adjustedReference = this.references_[i].adjust(this.references_[i].startTime,
            segmentIndex.first().startTime);
        head = this.references_.slice(0, i).concat([adjustedReference])
    } else {
        shaka.asserts.assert(this.first().startTime > segmentIndex.first().startTime || this.references_[i].startTime == segmentIndex.first().startTime);
        head = this.references_.slice(0, i)
    }
    this.references_ = head.concat(segmentIndex.references_);
    this.assertCorrectReferences_()
};
shaka.media.SegmentIndex.prototype.evict = function(minEndTime) {
    if (this.references_.length == 0) return;
    if (this.last().endTime <= minEndTime) {
        this.references_ = [];
        return
    }
    var i = this.find(minEndTime);
    shaka.asserts.assert(i >= 0);
    this.references_ = this.references_.slice(i)
};
shaka.media.SegmentIndex.prototype.correct = function(timestampCorrection) {
    this.timestampCorrection_ += timestampCorrection;
    this.references_ = shaka.media.SegmentIndex.shift_(this.references_, timestampCorrection);
    this.assertCorrectReferences_()
};
shaka.media.SegmentIndex.shift_ = function(references, delta) {
    return references.map(function(r) {
        return r.adjust(r.startTime + delta, r.endTime != null ? r.endTime + delta : null)
    })
};
shaka.media.SegmentIndex.prototype.assertCorrectReferences_ = function() {
    var previousItem;
    var references = this.references_;
    shaka.asserts.assert(references.every(function(item, index) {
        var result = true;
        if (index != 0) result = item.startTime >= previousItem.startTime && item.startTime <= previousItem.endTime && (item.endTime && item.endTime >= previousItem.endTime || index == references.length - 1);
        previousItem = item;
        return result
    }), "SegmentReferences should be sorted without gaps.");
    shaka.asserts.assert(shaka.util.ArrayUtils.removeDuplicates(references,
        function(ref) {
            return ref.id
        }).length == references.length, "SegmentReferences should have unique IDs.")
};
goog.provide("shaka.media.ISegmentIndexParser");
goog.require("shaka.media.SegmentReference");
shaka.media.ISegmentIndexParser = function() {};
shaka.media.ISegmentIndexParser.prototype.parse = function(initSegmentData, indexData, indexOffset) {};
goog.provide("shaka.media.IsobmffSegmentIndexParser");
goog.require("shaka.log");
goog.require("shaka.media.ISegmentIndexParser");
goog.require("shaka.media.SegmentReference");
goog.require("shaka.util.DataViewReader");
shaka.media.IsobmffSegmentIndexParser = function(mediaUrl) {
    this.mediaUrl_ = mediaUrl
};
shaka.media.IsobmffSegmentIndexParser.prototype.parse = function(initSegmentData, indexData, indexOffset) {
    var references = null;
    try {
        references = this.parseInternal_(indexData, indexOffset)
    } catch (exception) {
        if (!(exception instanceof RangeError)) throw exception;
    }
    return references
};
shaka.media.IsobmffSegmentIndexParser.SIDX_INDICATOR = 1936286840;
shaka.media.IsobmffSegmentIndexParser.prototype.parseInternal_ = function(dataView, sidxOffset) {
    var reader = new shaka.util.DataViewReader(dataView, shaka.util.DataViewReader.Endianness.BIG_ENDIAN);
    var references = [];
    var boxSize = reader.readUint32();
    var boxType = reader.readUint32();
    if (boxType != shaka.media.IsobmffSegmentIndexParser.SIDX_INDICATOR) {
        shaka.log.error('Invalid box type, expected "sidx".');
        return null
    }
    if (boxSize == 1) boxSize = reader.readUint64();
    var version = reader.readUint8();
    reader.skip(3);
    reader.skip(4);
    var timescale = reader.readUint32();
    shaka.asserts.assert(timescale != 0);
    if (timescale == 0) {
        shaka.log.error("Invalid timescale.");
        return null
    }
    var earliestPresentationTime;
    var firstOffset;
    if (version == 0) {
        earliestPresentationTime = reader.readUint32();
        firstOffset = reader.readUint32()
    } else {
        earliestPresentationTime = reader.readUint64();
        firstOffset = reader.readUint64()
    }
    reader.skip(2);
    var referenceCount = reader.readUint16();
    var unscaledStartTime = earliestPresentationTime;
    var startByte = sidxOffset + boxSize + firstOffset;
    for (var i = 0; i < referenceCount; i++) {
        var chunk = reader.readUint32();
        var referenceType = (chunk & 2147483648) >>> 31;
        var referenceSize = chunk & 2147483647;
        var subsegmentDuration = reader.readUint32();
        chunk = reader.readUint32();
        var startsWithSap = (chunk & 2147483648) >>> 31;
        var sapType = (chunk & 1879048192) >>> 28;
        var sapDelta = chunk & 268435455;
        if (referenceType == 1) {
            shaka.log.error("Heirarchical SIDXs are not supported.");
            return null
        }
        references.push(new shaka.media.SegmentReference(i, unscaledStartTime / timescale, (unscaledStartTime +
            subsegmentDuration) / timescale, startByte, startByte + referenceSize - 1, this.mediaUrl_));
        unscaledStartTime += subsegmentDuration;
        startByte += referenceSize
    }
    return references
};
goog.provide("shaka.util.Clock");
shaka.util.Clock.sync = function(timestamp) {
    shaka.util.Clock.offset_ = timestamp - Date.now()
};
shaka.util.Clock.now = function() {
    return Date.now() + shaka.util.Clock.offset_
};
shaka.util.Clock.offset_ = 0;
goog.provide("shaka.util.IBandwidthEstimator");
shaka.util.IBandwidthEstimator = function() {};
shaka.util.IBandwidthEstimator.prototype.sample = function(delayMs, bytes) {};
shaka.util.IBandwidthEstimator.prototype.getBandwidth = function() {};
shaka.util.IBandwidthEstimator.prototype.getDataAge = function() {};
goog.provide("shaka.util.TypedBind");
shaka.util.TypedBind = function(context, fn) {
    return fn.bind(context)
};
goog.provide("shaka.util.AjaxRequest");
goog.require("goog.Uri");
goog.require("shaka.asserts");
goog.require("shaka.util.Clock");
goog.require("shaka.util.IBandwidthEstimator");
goog.require("shaka.util.PublicPromise");
goog.require("shaka.util.StringUtils");
goog.require("shaka.util.TypedBind");
goog.require("shaka.util.Uint8ArrayUtils");
shaka.util.AjaxRequest = function(url) {
    this.url = url;
    this.parameters = new shaka.util.AjaxRequest.Parameters;
    this.attempts_ = 0;
    this.startTime_ = 0;
    this.retryDelayMs_ = 0;
    this.lastDelayMs_ = 0;
    this.xhr_ = null;
    this.promise_ = new shaka.util.PublicPromise;
    this.estimator = null
};
shaka.util.AjaxRequest.Parameters = function() {
    this.body = null;
    this.maxAttempts = 1;
    this.baseRetryDelayMs = 1E3;
    this.retryBackoffFactor = 2;
    this.retryFuzzFactor = .5;
    this.requestTimeoutMs = 0;
    this.method = "GET";
    this.responseType = "arraybuffer";
    this.requestHeaders = {};
    this.withCredentials = false;
    this.synchronizeClock = false
};
shaka.util.AjaxRequest.prototype.destroy_ = function() {
    this.cleanupRequest_();
    this.parameters.body = null;
    this.promise_ = null;
    this.estimator = null
};
shaka.util.AjaxRequest.prototype.cleanupRequest_ = function() {
    if (this.xhr_) {
        this.xhr_.onload = null;
        this.xhr_.onreadystatechange = null;
        this.xhr_.onerror = null
    }
    this.xhr_ = null
};
shaka.util.AjaxRequest.prototype.sendInternal = function() {
    shaka.asserts.assert(this.xhr_ == null);
    if (this.xhr_) return this.promise_;
    if (this.url.lastIndexOf("data:", 0) == 0) return this.handleDataUri_();
    else if (this.url.lastIndexOf("idb:", 0) == 0) return this.handleOfflineUri_();
    this.attempts_++;
    this.startTime_ = Date.now();
    if (!this.retryDelayMs_) this.retryDelayMs_ = this.parameters.baseRetryDelayMs;
    this.xhr_ = new XMLHttpRequest;
    var url = this.url;
    if (this.estimator) {
        var modifiedUri = new goog.Uri(url);
        modifiedUri.getQueryData().add("_",
            Date.now());
        url = modifiedUri.toString()
    }
    this.xhr_.open(this.parameters.method, url, true);
    this.xhr_.responseType = this.parameters.responseType;
    this.xhr_.timeout = this.parameters.requestTimeoutMs;
    this.xhr_.withCredentials = this.parameters.withCredentials;
    this.xhr_.onload = this.onLoad_.bind(this);
    if (this.parameters.synchronizeClock) this.xhr_.onreadystatechange = this.onReadyStateChange_.bind(this);
    this.xhr_.onerror = this.onError_.bind(this);
    for (var k in this.parameters.requestHeaders) this.xhr_.setRequestHeader(k,
        this.parameters.requestHeaders[k]);
    this.xhr_.send(this.parameters.body);
    return this.promise_
};
shaka.util.AjaxRequest.prototype.handleDataUri_ = function() {
    var StringUtils = shaka.util.StringUtils;
    var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
    var path = this.url.split(":")[1];
    var optionalTypeAndRest = path.split(";");
    var rest = optionalTypeAndRest.pop();
    var optionalEncodingAndData = rest.split(",");
    var data = optionalEncodingAndData.pop();
    var optionalEncoding = optionalEncodingAndData.pop();
    if (optionalEncoding == "base64") data = StringUtils.fromBase64(data);
    else data = window.decodeURIComponent(data);
    if (this.parameters.responseType ==
        "arraybuffer") data = Uint8ArrayUtils.fromString(data).buffer;
    var xhr = (JSON.parse(JSON.stringify(new XMLHttpRequest)));
    xhr.response = data;
    xhr.responseText = data.toString();
    var promise = this.promise_;
    promise.resolve(xhr);
    this.destroy_();
    return promise
};
shaka.util.AjaxRequest.prototype.handleOfflineUri_ = function() {
    var ids = this.url.split("/");
    shaka.asserts.assert(ids.length == 4);
    var streamId = parseInt(ids[2], 10);
    var segmentId = parseInt(ids[3], 10);
    shaka.asserts.assert(!isNaN(streamId));
    shaka.asserts.assert(!isNaN(segmentId));
    var db = new shaka.util.ContentDatabase(null, null);
    return db.setUpDatabase().then(function() {
        return db.retrieveSegment(streamId, segmentId)
    }).then(shaka.util.TypedBind(this, function(data) {
        var xhr = (JSON.parse(JSON.stringify(new XMLHttpRequest)));
        xhr.response = data;
        var promise = this.promise_;
        promise.resolve(xhr);
        db.closeDatabaseConnection();
        this.destroy_();
        return promise
    }))["catch"](shaka.util.TypedBind(this, function(e) {
        db.closeDatabaseConnection();
        this.destroy_();
        return Promise.reject(e)
    }))
};
shaka.util.AjaxRequest.prototype.createError_ = function(message, type) {
    var error = new Error(message);
    error.type = type;
    error.status = this.xhr_.status;
    error.url = this.url;
    error.method = this.parameters.method;
    error.body = this.parameters.body;
    error.xhr = this.xhr_;
    return error
};
shaka.util.AjaxRequest.prototype.abort = function() {
    if (!this.xhr_ || this.xhr_.readyState == XMLHttpRequest.DONE) return;
    shaka.asserts.assert(this.xhr_.readyState != 0);
    this.xhr_.abort();
    var error = this.createError_("Request aborted.", "aborted");
    this.promise_.reject(error);
    this.destroy_()
};
shaka.util.AjaxRequest.prototype.onLoad_ = function(event) {
    shaka.asserts.assert(event.target == this.xhr_);
    if (this.estimator) this.estimator.sample(Date.now() - this.startTime_, event.loaded);
    if (this.xhr_.status >= 200 && this.xhr_.status <= 299) {
        this.promise_.resolve(this.xhr_);
        this.destroy_()
    } else if (this.attempts_ < this.parameters.maxAttempts) {
        this.cleanupRequest_();
        var sendAgain = this.sendInternal.bind(this);
        var negToPosOne = Math.random() * 2 - 1;
        var negToPosFuzzFactor = negToPosOne * this.parameters.retryFuzzFactor;
        var fuzzedDelay = this.retryDelayMs_ * (1 + negToPosFuzzFactor);
        window.setTimeout(sendAgain, fuzzedDelay);
        this.lastDelayMs_ = fuzzedDelay;
        this.retryDelayMs_ *= this.parameters.retryBackoffFactor
    } else {
        var error = this.createError_("HTTP error.", "net");
        this.promise_.reject(error);
        this.destroy_()
    }
};
shaka.util.AjaxRequest.prototype.onReadyStateChange_ = function() {
    if (this.xhr_.readyState != XMLHttpRequest.HEADERS_RECEIVED) return;
    shaka.asserts.assert(this.parameters.synchronizeClock);
    var date = Date.parse(this.xhr_.getResponseHeader("Date"));
    if (date) shaka.util.Clock.sync(date)
};
shaka.util.AjaxRequest.prototype.onError_ = function(event) {
    shaka.asserts.assert(event.target == this.xhr_);
    var error = this.createError_("Network failure.", "net");
    this.promise_.reject(error);
    this.destroy_()
};
goog.provide("shaka.util.RangeRequest");
goog.require("shaka.asserts");
goog.require("shaka.util.AjaxRequest");
shaka.util.RangeRequest = function(url, begin, end, opt_maxAttempts, opt_baseRetryDelayMs) {
    shaka.util.AjaxRequest.call(this, url);
    shaka.asserts.assert(begin !== undefined && begin !== null);
    if (begin || end) {
        var rangeString = begin + "-" + (end != null ? end : "");
        this.parameters.requestHeaders["Range"] = "bytes=" + rangeString
    }
    if (opt_maxAttempts) this.parameters.maxAttempts = opt_maxAttempts;
    if (opt_baseRetryDelayMs) this.parameters.baseRetryDelayMs = opt_baseRetryDelayMs
};
goog.inherits(shaka.util.RangeRequest, shaka.util.AjaxRequest);
shaka.util.RangeRequest.prototype.send = function() {
    return this.sendInternal().then(shaka.util.TypedBind(this, function(xhr) {
        var data = (xhr.response);
        return Promise.resolve(data)
    }))
};
goog.provide("shaka.util.EbmlElement");
goog.provide("shaka.util.EbmlParser");
shaka.util.EbmlParser = function(dataView) {
    this.dataView_ = dataView;
    this.reader_ = new shaka.util.DataViewReader(dataView, shaka.util.DataViewReader.Endianness.BIG_ENDIAN)
};
shaka.util.EbmlParser.DYNAMIC_SIZES = [new Uint8Array([255]), new Uint8Array([127, 255]), new Uint8Array([63, 255, 255]), new Uint8Array([31, 255, 255, 255]), new Uint8Array([15, 255, 255, 255, 255]), new Uint8Array([7, 255, 255, 255, 255, 255]), new Uint8Array([3, 255, 255, 255, 255, 255, 255]), new Uint8Array([1, 255, 255, 255, 255, 255, 255, 255])];
shaka.util.EbmlParser.prototype.hasMoreData = function() {
    return this.reader_.hasMoreData()
};
shaka.util.EbmlParser.prototype.parseElement = function() {
    var id = this.parseId_();
    var vint = this.parseVint_();
    if (shaka.util.EbmlParser.isDynamicSizeValue_(vint)) throw new RangeError("EbmlParser: Element cannot contain dynamically sized data.");
    var size = shaka.util.EbmlParser.getVintValue_(vint);
    var elementSize = this.reader_.getPosition() + size <= this.dataView_.byteLength ? size : this.dataView_.byteLength - this.reader_.getPosition();
    var dataView = new DataView(this.dataView_.buffer, this.dataView_.byteOffset + this.reader_.getPosition(),
        elementSize);
    this.reader_.skip(elementSize);
    return new shaka.util.EbmlElement(id, dataView)
};
shaka.util.EbmlParser.prototype.parseId_ = function() {
    var vint = this.parseVint_();
    if (vint.length > 7) throw new RangeError("EbmlParser: EBML ID must be at most 7 bytes.");
    var id = 0;
    for (var i = 0; i < vint.length; i++) id = 256 * id + vint[i];
    return id
};
shaka.util.EbmlParser.prototype.parseVint_ = function() {
    var firstByte = this.reader_.readUint8();
    var numBytes;
    for (numBytes = 1; numBytes <= 8; numBytes++) {
        var mask = 1 << 8 - numBytes;
        if (firstByte & mask) break
    }
    if (numBytes > 8) throw new RangeError("EbmlParser: Variable sized integer must fit within 8 bytes.");
    var vint = new Uint8Array(numBytes);
    vint[0] = firstByte;
    for (var i = 1; i < numBytes; i++) vint[i] = this.reader_.readUint8();
    return vint
};
shaka.util.EbmlParser.getVintValue_ = function(vint) {
    if (vint.length == 8 && vint[1] & 224) throw new RangeError("EbmlParser: Variable sized integer value must be at most 53 bits.");
    var mask = 1 << 8 - vint.length;
    var value = vint[0] & mask - 1;
    for (var i = 1; i < vint.length; i++) value = 256 * value + vint[i];
    return value
};
shaka.util.EbmlParser.isDynamicSizeValue_ = function(vint) {
    var EbmlParser = shaka.util.EbmlParser;
    var uint8ArrayEqual = shaka.util.Uint8ArrayUtils.equal;
    for (var i = 0; i < EbmlParser.DYNAMIC_SIZES.length; i++)
        if (uint8ArrayEqual(vint, EbmlParser.DYNAMIC_SIZES[i])) return true;
    return false
};
shaka.util.EbmlElement = function(id, dataView) {
    this.id = id;
    this.dataView_ = dataView
};
shaka.util.EbmlElement.prototype.getOffset = function() {
    return this.dataView_.byteOffset
};
shaka.util.EbmlElement.prototype.createParser = function() {
    return new shaka.util.EbmlParser(this.dataView_)
};
shaka.util.EbmlElement.prototype.getUint = function() {
    if (this.dataView_.byteLength > 8) throw new RangeError("EbmlElement: Unsigned integer has too many bytes.");
    if (this.dataView_.byteLength == 8 && this.dataView_.getUint8(0) & 224) throw new RangeError("EbmlParser: Unsigned integer must be at most 53 bits.");
    var value = 0;
    for (var i = 0; i < this.dataView_.byteLength; i++) {
        var chunk = this.dataView_.getUint8(i);
        value = 256 * value + chunk
    }
    return value
};
shaka.util.EbmlElement.prototype.getFloat = function() {
    if (this.dataView_.byteLength == 4) return this.dataView_.getFloat32(0);
    else if (this.dataView_.byteLength == 8) return this.dataView_.getFloat64(0);
    else throw new RangeError("EbmlElement: floating point numbers must be 4 or 8 bytes.");
};
goog.provide("shaka.media.WebmSegmentIndexParser");
goog.require("shaka.asserts");
goog.require("shaka.log");
goog.require("shaka.media.ISegmentIndexParser");
goog.require("shaka.media.SegmentReference");
goog.require("shaka.util.EbmlElement");
goog.require("shaka.util.EbmlParser");
shaka.media.WebmSegmentIndexParser = function(mediaUrl) {
    this.mediaUrl_ = mediaUrl
};
shaka.media.WebmSegmentIndexParser.prototype.parse = function(initSegmentData, indexData, indexOffset) {
    var references = null;
    shaka.asserts.assert(initSegmentData);
    try {
        references = this.parseInternal_((initSegmentData), indexData)
    } catch (exception) {
        if (!(exception instanceof RangeError)) throw exception;
    }
    return references
};
shaka.media.WebmSegmentIndexParser.EBML_ID = 440786851;
shaka.media.WebmSegmentIndexParser.SEGMENT_ID = 408125543;
shaka.media.WebmSegmentIndexParser.INFO_ID = 357149030;
shaka.media.WebmSegmentIndexParser.TIMECODE_SCALE_ID = 2807729;
shaka.media.WebmSegmentIndexParser.CUES_ID = 475249515;
shaka.media.WebmSegmentIndexParser.CUE_POINT_ID = 187;
shaka.media.WebmSegmentIndexParser.CUE_TIME_ID = 179;
shaka.media.WebmSegmentIndexParser.CUE_TRACK_POSITIONS_ID = 183;
shaka.media.WebmSegmentIndexParser.CUE_CLUSTER_POSITION = 241;
shaka.media.WebmSegmentIndexParser.prototype.parseInternal_ = function(webmData, cuesData) {
    var tuple = this.parseWebmContainer_(webmData);
    if (!tuple) return null;
    var parser = new shaka.util.EbmlParser(cuesData);
    var cuesElement = parser.parseElement();
    if (cuesElement.id != shaka.media.WebmSegmentIndexParser.CUES_ID) {
        shaka.log.error("CuesElement does not exist.");
        return null
    }
    return this.parseCues_(cuesElement, tuple.segmentOffset, tuple.timecodeScale)
};
shaka.media.WebmSegmentIndexParser.prototype.parseWebmContainer_ = function(webmData) {
    var parser = new shaka.util.EbmlParser(webmData);
    var ebmlElement = parser.parseElement();
    if (ebmlElement.id != shaka.media.WebmSegmentIndexParser.EBML_ID) {
        shaka.log.error("EBML element does not exist.");
        return null
    }
    var segmentElement = parser.parseElement();
    if (segmentElement.id != shaka.media.WebmSegmentIndexParser.SEGMENT_ID) {
        shaka.log.error("Segment element does not exist.");
        return null
    }
    var segmentOffset = segmentElement.getOffset();
    var timecodeScale = this.parseSegment_(segmentElement);
    if (!timecodeScale) return null;
    return {
        segmentOffset: segmentOffset,
        timecodeScale: timecodeScale
    }
};
shaka.media.WebmSegmentIndexParser.prototype.parseSegment_ = function(segmentElement) {
    var parser = segmentElement.createParser();
    var infoElement = null;
    while (parser.hasMoreData()) {
        var elem = parser.parseElement();
        if (elem.id != shaka.media.WebmSegmentIndexParser.INFO_ID) continue;
        infoElement = elem;
        break
    }
    if (!infoElement) {
        shaka.log.error("Info element does not exist.");
        return null
    }
    return this.parseInfo_(infoElement)
};
shaka.media.WebmSegmentIndexParser.prototype.parseInfo_ = function(infoElement) {
    var parser = infoElement.createParser();
    var timecodeScaleNanoseconds = 1E6;
    while (parser.hasMoreData()) {
        var elem = parser.parseElement();
        if (elem.id != shaka.media.WebmSegmentIndexParser.TIMECODE_SCALE_ID) continue;
        timecodeScaleNanoseconds = elem.getUint();
        break
    }
    var timecodeScale = timecodeScaleNanoseconds / 1E9;
    return timecodeScale
};
shaka.media.WebmSegmentIndexParser.prototype.parseCues_ = function(cuesElement, segmentOffset, timecodeScale) {
    var parser = cuesElement.createParser();
    var references = [];
    var lastTime = -1;
    var lastOffset = -1;
    var index = 0;
    while (parser.hasMoreData()) {
        var elem = parser.parseElement();
        if (elem.id != shaka.media.WebmSegmentIndexParser.CUE_POINT_ID) continue;
        var tuple = this.parseCuePoint_(elem);
        if (!tuple) continue;
        var currentTime = timecodeScale * tuple.unscaledTime;
        var currentOffset = segmentOffset + tuple.relativeOffset;
        if (lastTime >=
            0) {
            shaka.asserts.assert(lastOffset >= 0);
            references.push(new shaka.media.SegmentReference(index, lastTime, currentTime, lastOffset, currentOffset - 1, this.mediaUrl_));
            ++index
        }
        lastTime = currentTime;
        lastOffset = currentOffset
    }
    if (lastTime >= 0) {
        shaka.asserts.assert(lastOffset >= 0);
        references.push(new shaka.media.SegmentReference(index, lastTime, null, lastOffset, null, this.mediaUrl_))
    }
    return references
};
shaka.media.WebmSegmentIndexParser.prototype.parseCuePoint_ = function(cuePointElement) {
    var parser = cuePointElement.createParser();
    var cueTimeElement = parser.parseElement();
    if (cueTimeElement.id != shaka.media.WebmSegmentIndexParser.CUE_TIME_ID) {
        shaka.log.warning("CueTime element does not exist.");
        return null
    }
    var unscaledTime = cueTimeElement.getUint();
    var cueTrackPositionsElement = parser.parseElement();
    if (cueTrackPositionsElement.id != shaka.media.WebmSegmentIndexParser.CUE_TRACK_POSITIONS_ID) {
        shaka.log.warning("CueTrackPositions element does not exist.");
        return null
    }
    var cueTrackParser = cueTrackPositionsElement.createParser();
    var relativeOffset = 0;
    while (cueTrackParser.hasMoreData()) {
        var elem = cueTrackParser.parseElement();
        if (elem.id != shaka.media.WebmSegmentIndexParser.CUE_CLUSTER_POSITION) continue;
        relativeOffset = elem.getUint();
        break
    }
    return {
        unscaledTime: unscaledTime,
        relativeOffset: relativeOffset
    }
};
goog.provide("shaka.media.ManifestInfo");
goog.provide("shaka.media.PeriodInfo");
goog.provide("shaka.media.SegmentMetadataInfo");
goog.provide("shaka.media.StreamConfig");
goog.provide("shaka.media.StreamInfo");
goog.provide("shaka.media.StreamSetInfo");
goog.require("shaka.media.ISegmentIndexParser");
goog.require("shaka.media.IsobmffSegmentIndexParser");
goog.require("shaka.media.SegmentIndex");
goog.require("shaka.media.WebmSegmentIndexParser");
goog.require("shaka.util.RangeRequest");
shaka.media.StreamInfo = function() {
    this.uniqueId = shaka.media.StreamInfo.nextUniqueId_++;
    this.id = null;
    this.timestampOffset = 0;
    this.currentSegmentStartTime = null;
    this.bandwidth = null;
    this.width = null;
    this.height = null;
    this.mimeType = "";
    this.codecs = "";
    this.mediaUrl = null;
    this.enabled = true;
    this.segmentIndexInfo = null;
    this.segmentInitializationInfo = null;
    this.segmentIndex = null;
    this.segmentInitializationData = null;
    this.segmentIndexData_ = null
};
shaka.media.StreamInfo.nextUniqueId_ = 0;
shaka.media.StreamInfo.prototype.isAvailable = function() {
    return this.mimeType.split("/")[0] == "text" || this.segmentIndexInfo != null || this.segmentIndex != null && this.segmentIndex.length() > 0
};
shaka.media.StreamInfo.prototype.getSegmentInitializationData = function() {
    return this.segmentInitializationInfo ? this.fetchSegmentInitialization_() : Promise.resolve()
};
shaka.media.StreamInfo.prototype.getSegmentIndex = function() {
    if (!this.segmentIndexInfo || this.segmentIndex) return Promise.resolve();
    if (!this.mediaUrl) {
        var error = new Error("Cannot create segment index without a media URL.");
        error.type = "stream";
        return Promise.reject(error)
    }
    var mp4 = this.mimeType.indexOf("mp4") >= 0;
    var webm = this.mimeType.indexOf("webm") >= 0;
    shaka.asserts.assert(!(mp4 && webm));
    if (!mp4 && !webm) {
        var error = new Error("Cannot create segment index with an unsupported MIME type.");
        error.type = "stream";
        return Promise.reject(error)
    }
    if (webm && !this.segmentInitializationData && !this.segmentInitializationInfo) {
        var error = new Error("Cannot create segment index for WebM content without an " + "initialization segment.");
        error.type = "stream";
        return Promise.reject(error)
    }
    var p = this.fetchSegmentIndex_();
    if (webm) p = p.then(this.fetchSegmentInitialization_.bind(this));
    p = p.then(shaka.util.TypedBind(this, function() {
        shaka.asserts.assert(this.segmentIndexData_);
        shaka.asserts.assert(!webm || this.segmentInitializationData);
        var indexParser = null;
        if (mp4) indexParser = new shaka.media.IsobmffSegmentIndexParser((this.mediaUrl));
        else indexParser = new shaka.media.WebmSegmentIndexParser((this.mediaUrl));
        shaka.asserts.assert(indexParser);
        var segmentInitializationDataView = this.segmentInitializationData ? new DataView(this.segmentInitializationData) : null;
        var segmentIndexDataView = new DataView(this.segmentIndexData_);
        var indexOffset = this.segmentIndexInfo.startByte;
        var references = indexParser.parse(segmentInitializationDataView, segmentIndexDataView,
            indexOffset);
        if (!references) {
            var error = new Error("Cannot parse segment references.");
            error.type = "stream";
            return Promise.reject(error)
        }
        this.segmentIndex = new shaka.media.SegmentIndex(references);
        return Promise.resolve()
    }));
    return p
};
shaka.media.StreamInfo.prototype.fetchSegmentIndex_ = function() {
    if (this.segmentIndexData_) return Promise.resolve();
    shaka.asserts.assert(this.segmentIndexInfo);
    return this.segmentIndexInfo.fetch().then(shaka.util.TypedBind(this, function(data) {
        this.segmentIndexData_ = data;
        return Promise.resolve()
    }))
};
shaka.media.StreamInfo.prototype.fetchSegmentInitialization_ = function() {
    if (this.segmentInitializationData) return Promise.resolve();
    shaka.asserts.assert(this.segmentInitializationInfo);
    return this.segmentInitializationInfo.fetch().then(shaka.util.TypedBind(this, function(data) {
        this.segmentInitializationData = data;
        return Promise.resolve()
    }))
};
shaka.media.StreamInfo.prototype.getContentType = function() {
    return this.mimeType.split("/")[0]
};
shaka.media.StreamInfo.prototype.getFullMimeType = function() {
    var fullMimeType = this.mimeType || "";
    if (this.codecs) fullMimeType += '; codecs="' + this.codecs + '"';
    return fullMimeType
};
shaka.media.SegmentMetadataInfo = function() {
    this.url = null;
    this.startByte = 0;
    this.endByte = null
};
shaka.media.SegmentMetadataInfo.prototype.fetch = function() {
    shaka.asserts.assert(this.url);
    var request = new shaka.util.RangeRequest(this.url.toString(), this.startByte, this.endByte);
    return request.send()
};
shaka.media.StreamSetInfo = function() {
    this.uniqueId = shaka.media.StreamSetInfo.nextUniqueId_++;
    this.id = null;
    this.contentType = "";
    this.streamInfos = [];
    this.drmSchemes = [];
    this.lang = "";
    this.main = false
};
shaka.media.StreamSetInfo.nextUniqueId_ = 0;
shaka.media.StreamSetInfo.prototype.getConfigs = function() {
    var configList = [];
    for (var i = 0; i < this.drmSchemes.length; ++i) {
        var cfg = new shaka.media.StreamConfig;
        cfg.id = this.uniqueId;
        cfg.drmScheme = this.drmSchemes[i];
        cfg.contentType = this.contentType;
        cfg.fullMimeType = this.streamInfos.length ? this.streamInfos[0].getFullMimeType() : "";
        configList.push(cfg)
    }
    return configList
};
shaka.media.PeriodInfo = function() {
    this.id = null;
    this.start = 0;
    this.duration = null;
    this.streamSetInfos = []
};
shaka.media.PeriodInfo.prototype.getConfigs = function() {
    var configList = [];
    for (var i = 0; i < this.streamSetInfos.length; ++i) configList.push.apply(configList, this.streamSetInfos[i].getConfigs());
    return configList
};
shaka.media.ManifestInfo = function() {
    this.live = false;
    this.minBufferTime = 0;
    this.periodInfos = []
};
shaka.media.StreamConfig = function() {
    this.id = 0;
    this.drmScheme = null;
    this.contentType = "";
    this.fullMimeType = ""
};
shaka.media.StreamConfig.prototype.getBasicMimeType = function() {
    return this.fullMimeType.split(";")[0]
};
goog.provide("shaka.dash.MpdProcessor");
goog.require("goog.Uri");
goog.require("shaka.asserts");
goog.require("shaka.dash.mpd");
goog.require("shaka.log");
goog.require("shaka.media.PeriodInfo");
goog.require("shaka.media.SegmentIndex");
goog.require("shaka.media.SegmentMetadataInfo");
goog.require("shaka.media.SegmentReference");
goog.require("shaka.media.StreamInfo");
goog.require("shaka.media.StreamSetInfo");
goog.require("shaka.util.Clock");
shaka.dash.MpdProcessor = function(interpretContentProtection) {
    this.interpretContentProtection_ = interpretContentProtection;
    this.manifestInfo = new shaka.media.ManifestInfo
};
shaka.dash.MpdProcessor.GAP_OVERLAP_WARNING_THRESHOLD = 1 / 32;
shaka.dash.MpdProcessor.MAX_SEGMENT_INDEX_SPAN = 2 * 60;
shaka.dash.MpdProcessor.DEFAULT_MIN_BUFFER_TIME = 5;
shaka.dash.MpdProcessor.prototype.process = function(mpd) {
    this.manifestInfo = new shaka.media.ManifestInfo;
    this.validateSegmentInfo_(mpd);
    this.calculateDurations_(mpd);
    this.filterPeriods_(mpd);
    this.createManifestInfo_(mpd)
};
shaka.dash.MpdProcessor.prototype.validateSegmentInfo_ = function(mpd) {
    for (var i = 0; i < mpd.periods.length; ++i) {
        var period = mpd.periods[i];
        for (var j = 0; j < period.adaptationSets.length; ++j) {
            var adaptationSet = period.adaptationSets[j];
            if (adaptationSet.contentType == "text") continue;
            for (var k = 0; k < adaptationSet.representations.length; ++k) {
                var representation = adaptationSet.representations[k];
                var n = 0;
                n += representation.segmentBase ? 1 : 0;
                n += representation.segmentList ? 1 : 0;
                n += representation.segmentTemplate ? 1 : 0;
                if (n == 0) {
                    shaka.log.warning("Representation does not contain any segment information. " +
                        "A Representation must contain one of SegmentBase, " + "SegmentList, or SegmentTemplate.", representation);
                    adaptationSet.representations.splice(k, 1);
                    --k
                } else if (n != 1) {
                    shaka.log.warning("Representation contains multiple segment information sources. " + "A Representation should only contain one of SegmentBase, " + "SegmenstList, or SegmentTemplate.", representation);
                    if (representation.segmentBase) {
                        shaka.log.info("Using SegmentBase by default.");
                        representation.segmentList = null;
                        representation.segmentTemplate =
                            null
                    } else if (representation.segmentList) {
                        shaka.log.info("Using SegmentList by default.");
                        representation.segmentTemplate = null
                    } else shaka.asserts.unreachable()
                }
            }
        }
    }
};
shaka.dash.MpdProcessor.prototype.calculateDurations_ = function(mpd) {
    if (!mpd.periods.length) return;
    if (mpd.periods[0].start == null) mpd.periods[0].start = 0;
    var isSet = function(x) {
        return x == 0 || !!x
    };
    if (isSet(mpd.minUpdatePeriod)) mpd.mediaPresentationDuration = null;
    if (isSet(mpd.mediaPresentationDuration) && mpd.periods.length == 1 && !isSet(mpd.periods[0].duration)) mpd.periods[0].duration = mpd.mediaPresentationDuration;
    var totalDuration = 0;
    var totalDurationIncludesAllPeriods = true;
    for (var i = 0; i < mpd.periods.length; ++i) {
        var previousPeriod =
            mpd.periods[i - 1];
        var period = mpd.periods[i];
        var nextPeriod = mpd.periods[i + 1] || {
            start: mpd.mediaPresentationDuration
        };
        if (!isSet(period.start) && previousPeriod && isSet(previousPeriod.start) && isSet(previousPeriod.duration)) period.start = previousPeriod.start + previousPeriod.duration;
        if (!isSet(period.duration) && isSet(nextPeriod.start)) period.duration = nextPeriod.start - period.start;
        if (period.start != null && period.duration != null) totalDuration += period.duration;
        else totalDurationIncludesAllPeriods = false
    }
    if (isSet(mpd.mediaPresentationDuration)) {
        if (mpd.mediaPresentationDuration !=
            totalDuration) shaka.log.warning("@mediaPresentationDuration does not match the total " + "duration of all periods.")
    } else {
        var finalPeriod = mpd.periods[mpd.periods.length - 1];
        if (totalDurationIncludesAllPeriods) {
            shaka.asserts.assert(isSet(finalPeriod.start) && isSet(finalPeriod.duration));
            shaka.asserts.assert(totalDuration == finalPeriod.start + finalPeriod.duration);
            mpd.mediaPresentationDuration = totalDuration
        } else if (isSet(finalPeriod.start) && isSet(finalPeriod.duration)) {
            shaka.log.warning("Some Periods may not have valid start times " +
                "or durations.");
            mpd.mediaPresentationDuration = finalPeriod.start + finalPeriod.duration
        } else if (mpd.type == "static") {
            shaka.log.warning("Some Periods may not have valid start times " + "or durations; @mediaPresentationDuration may " + "not include the duration of all periods.");
            mpd.mediaPresentationDuration = totalDuration
        }
    }
};
shaka.dash.MpdProcessor.prototype.filterPeriods_ = function(mpd) {
    for (var i = 0; i < mpd.periods.length; ++i) {
        var period = mpd.periods[i];
        for (var j = 0; j < period.adaptationSets.length; ++j) {
            var adaptationSet = period.adaptationSets[j];
            this.filterAdaptationSet_(adaptationSet);
            if (adaptationSet.representations.length == 0) {
                period.adaptationSets.splice(j, 1);
                --j
            }
        }
    }
};
shaka.dash.MpdProcessor.prototype.filterAdaptationSet_ = function(adaptationSet) {
    var desiredMimeType = null;
    for (var i = 0; i < adaptationSet.representations.length; ++i) {
        var representation = adaptationSet.representations[i];
        var mimeType = representation.mimeType || "";
        if (!desiredMimeType) desiredMimeType = mimeType;
        else if (mimeType != desiredMimeType) {
            shaka.log.warning("Representation has an inconsistent mime type.", adaptationSet.representations[i]);
            adaptationSet.representations.splice(i, 1);
            --i
        }
    }
};
shaka.dash.MpdProcessor.prototype.createManifestInfo_ = function(mpd) {
    this.manifestInfo.live = mpd.minUpdatePeriod != null;
    this.manifestInfo.minBufferTime = mpd.minBufferTime || shaka.dash.MpdProcessor.DEFAULT_MIN_BUFFER_TIME;
    for (var i = 0; i < mpd.periods.length; ++i) {
        var period = mpd.periods[i];
        var periodInfo = new shaka.media.PeriodInfo;
        periodInfo.id = period.id;
        shaka.asserts.assert(period.start != null);
        periodInfo.start = period.start || 0;
        periodInfo.duration = period.duration;
        for (var j = 0; j < period.adaptationSets.length; ++j) {
            var adaptationSet =
                period.adaptationSets[j];
            var streamSetInfo = new shaka.media.StreamSetInfo;
            streamSetInfo.id = adaptationSet.id;
            streamSetInfo.main = adaptationSet.main;
            streamSetInfo.contentType = adaptationSet.contentType || "";
            streamSetInfo.lang = adaptationSet.lang || "";
            var maxLastEndTime = 0;
            for (var k = 0; k < adaptationSet.representations.length; ++k) {
                var representation = adaptationSet.representations[k];
                var commonDrmSchemes = streamSetInfo.drmSchemes.slice(0);
                this.updateCommonDrmSchemes_(representation, commonDrmSchemes);
                if (commonDrmSchemes.length ==
                    0 && streamSetInfo.drmSchemes.length > 0) {
                    shaka.log.warning("Representation does not contain any DRM schemes that are in " + "common with other Representations within its AdaptationSet.", representation);
                    continue
                }
                var streamInfo = this.createStreamInfo_(mpd, period, representation);
                if (!streamInfo) continue;
                streamSetInfo.streamInfos.push(streamInfo);
                streamSetInfo.drmSchemes = commonDrmSchemes;
                if (streamInfo.segmentIndex && streamInfo.segmentIndex.length() > 0) maxLastEndTime = Math.max(maxLastEndTime, streamInfo.segmentIndex.last().endTime)
            }
            periodInfo.streamSetInfos.push(streamSetInfo);
            if (!periodInfo.duration) {
                periodInfo.duration = maxLastEndTime;
                if (mpd.minUpdatePeriod) periodInfo.duration += 60 * 60 * 24 * 30
            }
        }
        this.manifestInfo.periodInfos.push(periodInfo)
    }
};
shaka.dash.MpdProcessor.prototype.updateCommonDrmSchemes_ = function(representation, commonDrmSchemes) {
    var drmSchemes = this.getDrmSchemeInfos_(representation);
    if (commonDrmSchemes.length == 0) {
        Array.prototype.push.apply(commonDrmSchemes, drmSchemes);
        return
    }
    for (var i = 0; i < commonDrmSchemes.length; ++i) {
        var found = false;
        for (var j = 0; j < drmSchemes.length; ++j)
            if (commonDrmSchemes[i].key() == drmSchemes[j].key()) {
                found = true;
                break
            }
        if (!found) {
            commonDrmSchemes.splice(i, 1);
            --i
        }
    }
};
shaka.dash.MpdProcessor.prototype.getDrmSchemeInfos_ = function(representation) {
    var drmSchemes = [];
    if (representation.contentProtections.length == 0) drmSchemes.push(shaka.player.DrmSchemeInfo.createUnencrypted());
    else if (this.interpretContentProtection_)
        for (var i = 0; i < representation.contentProtections.length; ++i) {
            var contentProtection = representation.contentProtections[i];
            var drmSchemeInfo = this.interpretContentProtection_(contentProtection);
            if (drmSchemeInfo) drmSchemes.push(drmSchemeInfo)
        }
    return drmSchemes
};
shaka.dash.MpdProcessor.prototype.createStreamInfo_ = function(mpd, period, representation) {
    var streamInfo = new shaka.media.StreamInfo;
    streamInfo.id = representation.id;
    streamInfo.bandwidth = representation.bandwidth;
    streamInfo.width = representation.width;
    streamInfo.height = representation.height;
    streamInfo.mimeType = representation.mimeType || "";
    streamInfo.codecs = representation.codecs || "";
    var ok;
    if (representation.segmentBase) ok = this.buildStreamInfoFromSegmentBase_(representation.segmentBase, streamInfo);
    else if (representation.segmentList) ok =
        this.buildStreamInfoFromSegmentList_(representation.segmentList, streamInfo);
    else if (representation.segmentTemplate) ok = this.buildStreamInfoFromSegmentTemplate_(mpd, period, representation, streamInfo);
    else if (representation.mimeType.split("/")[0] == "text") {
        streamInfo.mediaUrl = new goog.Uri(representation.baseUrl);
        ok = true
    } else shaka.asserts.unreachable();
    return ok ? streamInfo : null
};
shaka.dash.MpdProcessor.prototype.buildStreamInfoFromSegmentBase_ = function(segmentBase, streamInfo) {
    shaka.asserts.assert(segmentBase.timescale > 0);
    var hasSegmentIndexMetadata = segmentBase.indexRange || segmentBase.representationIndex && segmentBase.representationIndex.range;
    if (!hasSegmentIndexMetadata || !segmentBase.baseUrl) {
        shaka.log.warning("A SegmentBase must have a segment index URL and a base URL.", segmentBase);
        return false
    }
    if (segmentBase.presentationTimeOffset) streamInfo.timestampOffset = -1 * segmentBase.presentationTimeOffset /
        segmentBase.timescale;
    var representationIndex = segmentBase.representationIndex;
    if (!representationIndex) {
        representationIndex = new shaka.dash.mpd.RepresentationIndex;
        representationIndex.url = new goog.Uri(segmentBase.baseUrl);
        representationIndex.range = segmentBase.indexRange ? segmentBase.indexRange.clone() : null
    }
    streamInfo.mediaUrl = new goog.Uri(segmentBase.baseUrl);
    streamInfo.segmentIndexInfo = this.createSegmentMetadataInfo_(representationIndex);
    streamInfo.segmentInitializationInfo = this.createSegmentMetadataInfo_(segmentBase.initialization);
    return true
};
shaka.dash.MpdProcessor.prototype.buildStreamInfoFromSegmentList_ = function(segmentList, streamInfo) {
    shaka.asserts.assert(segmentList.timescale > 0);
    if (!segmentList.segmentDuration && segmentList.segmentUrls.length > 1) {
        shaka.log.warning("A SegmentList without a segment duration can only have one segment.", segmentList);
        return false
    }
    streamInfo.segmentInitializationInfo = this.createSegmentMetadataInfo_(segmentList.initialization);
    var lastEndTime = 0;
    var references = [];
    for (var i = 0; i < segmentList.segmentUrls.length; ++i) {
        var segmentUrl = segmentList.segmentUrls[i];
        var startTime;
        if (i == 0) startTime = 0;
        else startTime = lastEndTime;
        shaka.asserts.assert(startTime >= 0);
        var endTime = null;
        var scaledEndTime = null;
        var scaledStartTime = startTime / segmentList.timescale;
        if (segmentList.segmentDuration) {
            endTime = startTime + segmentList.segmentDuration;
            scaledEndTime = endTime / segmentList.timescale
        }
        lastEndTime = endTime;
        var startByte = 0;
        var endByte = null;
        if (segmentUrl.mediaRange) {
            startByte = segmentUrl.mediaRange.begin;
            endByte = segmentUrl.mediaRange.end
        }
        references.push(new shaka.media.SegmentReference((startTime),
            scaledStartTime, scaledEndTime, startByte, endByte, new goog.Uri(segmentUrl.mediaUrl)))
    }
    streamInfo.segmentIndex = new shaka.media.SegmentIndex(references);
    shaka.log.debug("Generated SegmentIndex from SegmentList", streamInfo.segmentIndex);
    return true
};
shaka.dash.MpdProcessor.prototype.buildStreamInfoFromSegmentTemplate_ = function(mpd, period, representation, streamInfo) {
    shaka.asserts.assert(representation.segmentTemplate);
    var segmentTemplate = representation.segmentTemplate;
    var ok;
    if (segmentTemplate.indexUrlTemplate) {
        if (segmentTemplate.timeline) shaka.log.warning("Ignoring SegmentTimeline because an explicit segment index " + "URL was provided for the SegmentTemplate.", representation);
        if (segmentTemplate.segmentDuration) shaka.log.warning("Ignoring segment duration because an explicit segment index " +
            "URL was provided for the SegmentTemplate.", representation);
        ok = this.buildStreamInfoFromIndexUrlTemplate_(representation, streamInfo)
    } else if (segmentTemplate.timeline) {
        if (segmentTemplate.segmentDuration) shaka.log.warning("Ignoring segment duration because a SegmentTimeline was " + "provided for the SegmentTemplate.", representation);
        ok = this.buildStreamInfoFromSegmentTimeline_(mpd, period, representation, streamInfo)
    } else if (segmentTemplate.segmentDuration) ok = this.buildStreamInfoFromSegmentDuration_(mpd, period,
        representation, streamInfo);
    else {
        shaka.log.error("SegmentTemplate does not provide an explicit segment index URL, " + "a SegmentTimeline, or a segment duration.", representation);
        ok = false
    }
    return ok
};
shaka.dash.MpdProcessor.prototype.buildStreamInfoFromIndexUrlTemplate_ = function(representation, streamInfo) {
    shaka.asserts.assert(representation.segmentTemplate);
    shaka.asserts.assert(representation.segmentTemplate.indexUrlTemplate);
    shaka.asserts.assert(representation.segmentTemplate.timescale > 0);
    var segmentTemplate = representation.segmentTemplate;
    var mediaUrl;
    if (segmentTemplate.mediaUrlTemplate) {
        var filledUrlTemplate = this.fillUrlTemplate_(segmentTemplate.mediaUrlTemplate, representation.id, 1, representation.bandwidth,
            0);
        if (!filledUrlTemplate) return false;
        mediaUrl = representation.baseUrl ? representation.baseUrl.resolve(filledUrlTemplate) : filledUrlTemplate
    } else mediaUrl = new goog.Uri(representation.baseUrl);
    var representationIndex = this.generateRepresentationIndex_(representation);
    if (!representationIndex) return false;
    var initialization = null;
    if (segmentTemplate.initializationUrlTemplate) {
        initialization = this.generateInitialization_(representation);
        if (!initialization) return false
    }
    streamInfo.mediaUrl = new goog.Uri(mediaUrl);
    if (segmentTemplate.presentationTimeOffset) streamInfo.timestampOffset = -1 * segmentTemplate.presentationTimeOffset / segmentTemplate.timescale;
    streamInfo.segmentIndexInfo = this.createSegmentMetadataInfo_(representationIndex);
    streamInfo.segmentInitializationInfo = this.createSegmentMetadataInfo_(initialization);
    return true
};
shaka.dash.MpdProcessor.prototype.generateRepresentationIndex_ = function(representation) {
    shaka.asserts.assert(representation.segmentTemplate);
    var segmentTemplate = representation.segmentTemplate;
    shaka.asserts.assert(segmentTemplate.indexUrlTemplate);
    if (!segmentTemplate.indexUrlTemplate) return null;
    var representationIndex = new shaka.dash.mpd.RepresentationIndex;
    var filledUrlTemplate = this.fillUrlTemplate_(segmentTemplate.indexUrlTemplate, representation.id, null, representation.bandwidth, null);
    if (!filledUrlTemplate) return null;
    if (representation.baseUrl && filledUrlTemplate) representationIndex.url = representation.baseUrl.resolve(filledUrlTemplate);
    else representationIndex.url = filledUrlTemplate;
    return representationIndex
};
shaka.dash.MpdProcessor.prototype.buildStreamInfoFromSegmentTimeline_ = function(mpd, period, representation, streamInfo) {
    shaka.asserts.assert(representation.segmentTemplate);
    shaka.asserts.assert(representation.segmentTemplate.timeline);
    shaka.asserts.assert(representation.segmentTemplate.timescale > 0);
    if (period.start == null) {
        shaka.log.error("Cannot instantiate SegmentTemplate: the period's start time is " + "unknown.", representation);
        return false
    }
    var segmentTemplate = representation.segmentTemplate;
    if (!segmentTemplate.mediaUrlTemplate) {
        shaka.log.error("Cannot instantiate SegmentTemplate: SegmentTemplate does not have a " +
            "media URL template.", representation);
        return false
    }
    var timeline = this.createTimeline_(segmentTemplate);
    if (!timeline) return false;
    var earliestAvailableTimestamp = 0;
    if (mpd.minUpdatePeriod && timeline.length > 0) {
        var index = Math.max(0, timeline.length - 2);
        var timeShiftBufferDepth = mpd.timeShiftBufferDepth || 0;
        earliestAvailableTimestamp = timeline[index].start / segmentTemplate.timescale - timeShiftBufferDepth
    }
    var references = [];
    for (var i = 0; i < timeline.length; ++i) {
        var startTime = timeline[i].start;
        var endTime = timeline[i].end;
        var scaledStartTime = startTime / segmentTemplate.timescale;
        var scaledEndTime = endTime / segmentTemplate.timescale;
        if (scaledStartTime < earliestAvailableTimestamp) continue;
        var absoluteSegmentNumber = i + segmentTemplate.startNumber;
        var segmentReplacement = absoluteSegmentNumber;
        var timeReplacement = startTime;
        shaka.asserts.assert(segmentTemplate.mediaUrlTemplate);
        var filledUrlTemplate = this.fillUrlTemplate_(segmentTemplate.mediaUrlTemplate, representation.id, segmentReplacement, representation.bandwidth, timeReplacement);
        if (!filledUrlTemplate) return false;
        var mediaUrl = representation.baseUrl ? representation.baseUrl.resolve(filledUrlTemplate) : filledUrlTemplate;
        references.push(new shaka.media.SegmentReference(startTime, scaledStartTime, scaledEndTime, 0, null, new goog.Uri(mediaUrl)))
    }
    var initialization = null;
    if (segmentTemplate.initializationUrlTemplate && references.length > 0) {
        initialization = this.generateInitialization_(representation);
        if (!initialization) return false
    }
    if (segmentTemplate.presentationTimeOffset) streamInfo.timestampOffset = -1 * segmentTemplate.presentationTimeOffset / segmentTemplate.timescale;
    if (mpd.minUpdatePeriod && references.length > 0) {
        var minBufferTime = this.manifestInfo.minBufferTime;
        var bestAvailableTimestamp = references[references.length - 1].startTime - minBufferTime;
        if (bestAvailableTimestamp >= earliestAvailableTimestamp) shaka.log.v1("The best available segment is still available!");
        else {
            bestAvailableTimestamp = earliestAvailableTimestamp;
            shaka.log.v1("The best available segment is no longer available.")
        }
        for (var i = 0; i < references.length; ++i)
            if (references[i].endTime >=
                bestAvailableTimestamp) {
                streamInfo.currentSegmentStartTime = references[i].startTime;
                break
            }
        shaka.asserts.assert(streamInfo.currentSegmentStartTime != null)
    }
    streamInfo.segmentInitializationInfo = this.createSegmentMetadataInfo_(initialization);
    streamInfo.segmentIndex = new shaka.media.SegmentIndex(references);
    shaka.log.debug("Generated SegmentIndex from SegmentTimeline", streamInfo.segmentIndex);
    return true
};
shaka.dash.MpdProcessor.prototype.createTimeline_ = function(segmentTemplate) {
    shaka.asserts.assert(segmentTemplate.timeline);
    var timePoints = segmentTemplate.timeline.timePoints;
    var lastEndTime = 0;
    var timeline = [];
    for (var i = 0; i < timePoints.length; ++i) {
        var repeat = timePoints[i].repeat || 0;
        for (var j = 0; j <= repeat; ++j) {
            if (!timePoints[i].duration) {
                shaka.log.warning('SegmentTimeline "S" element does not have a duration.', timePoints[i]);
                return null
            }
            var startTime;
            if (timePoints[i].startTime && j == 0) startTime = timePoints[i].startTime;
            else if (i == 0 && j == 0) startTime = 0;
            else startTime = lastEndTime;
            shaka.asserts.assert(startTime >= 0);
            var endTime = startTime + timePoints[i].duration;
            if (timeline.length > 0 && startTime != lastEndTime) {
                var delta = startTime - lastEndTime;
                if (Math.abs(delta / segmentTemplate.timescale) >= shaka.dash.MpdProcessor.GAP_OVERLAP_WARNING_THRESHOLD) shaka.log.warning("SegmentTimeline contains a large gap/overlap, the content may " + "have errors in it.", timePoints[i]);
                timeline[timeline.length - 1].end = startTime
            }
            lastEndTime = endTime;
            timeline.push({
                start: startTime,
                end: endTime
            })
        }
    }
    return timeline
};
shaka.dash.MpdProcessor.prototype.buildStreamInfoFromSegmentDuration_ = function(mpd, period, representation, streamInfo) {
    shaka.asserts.assert(representation.segmentTemplate);
    shaka.asserts.assert(representation.segmentTemplate.segmentDuration);
    shaka.asserts.assert(representation.segmentTemplate.timescale > 0);
    if (period.start == null) {
        shaka.log.error("Cannot instantiate SegmentTemplate: the period's start time is " + "unknown.", representation);
        return false
    }
    var segmentTemplate = representation.segmentTemplate;
    if (!segmentTemplate.mediaUrlTemplate) {
        shaka.log.error("Cannot instantiate SegmentTemplate: SegmentTemplate does not have a " +
            "media URL template.", representation);
        return false
    }
    var numSegmentsBeforeCurrentSegment = 0;
    var earliestSegmentNumber;
    var currentSegmentNumber;
    if (mpd.minUpdatePeriod) {
        var pair = this.computeAvailableSegmentRange_(mpd, period, segmentTemplate);
        if (pair) {
            earliestSegmentNumber = pair.earliest;
            currentSegmentNumber = pair.current;
            numSegmentsBeforeCurrentSegment = currentSegmentNumber - earliestSegmentNumber;
            shaka.asserts.assert(numSegmentsBeforeCurrentSegment >= 0)
        }
    } else earliestSegmentNumber = 1;
    shaka.asserts.assert(earliestSegmentNumber ===
        undefined || earliestSegmentNumber >= 0);
    var numSegmentsFromCurrentSegment = 0;
    if (earliestSegmentNumber >= 0) {
        numSegmentsFromCurrentSegment = this.computeOptimalSegmentIndexSize_(mpd, period, segmentTemplate);
        if (!numSegmentsFromCurrentSegment) return false
    }
    var totalNumSegments = numSegmentsBeforeCurrentSegment + numSegmentsFromCurrentSegment;
    var references = [];
    for (var i = 0; i < totalNumSegments; ++i) {
        var segmentNumber = i + earliestSegmentNumber;
        var startTime = (segmentNumber - 1) * segmentTemplate.segmentDuration;
        var endTime = startTime +
            segmentTemplate.segmentDuration;
        var scaledStartTime = startTime / segmentTemplate.timescale;
        var scaledEndTime = endTime / segmentTemplate.timescale;
        var absoluteSegmentNumber = segmentNumber - 1 + segmentTemplate.startNumber;
        var segmentReplacement = absoluteSegmentNumber;
        var timeReplacement = (segmentNumber - 1 + (segmentTemplate.startNumber - 1)) * segmentTemplate.segmentDuration;
        shaka.asserts.assert(segmentTemplate.mediaUrlTemplate);
        var filledUrlTemplate = this.fillUrlTemplate_(segmentTemplate.mediaUrlTemplate, representation.id,
            segmentReplacement, representation.bandwidth, timeReplacement);
        if (!filledUrlTemplate) return false;
        var mediaUrl = representation.baseUrl ? representation.baseUrl.resolve(filledUrlTemplate) : filledUrlTemplate;
        references.push(new shaka.media.SegmentReference(startTime, scaledStartTime, scaledEndTime, 0, null, new goog.Uri(mediaUrl)))
    }
    var initialization = null;
    if (segmentTemplate.initializationUrlTemplate && references.length > 0) {
        initialization = this.generateInitialization_(representation);
        if (!initialization) return false
    }
    if (segmentTemplate.presentationTimeOffset) streamInfo.timestampOffset = -1 * segmentTemplate.presentationTimeOffset / segmentTemplate.timescale;
    if (mpd.minUpdatePeriod && references.length > 0) {
        shaka.asserts.assert(currentSegmentNumber);
        var scaledSegmentDuration = segmentTemplate.segmentDuration / segmentTemplate.timescale;
        streamInfo.currentSegmentStartTime = (currentSegmentNumber - 1) * scaledSegmentDuration
    }
    streamInfo.segmentInitializationInfo = this.createSegmentMetadataInfo_(initialization);
    streamInfo.segmentIndex = new shaka.media.SegmentIndex(references);
    shaka.log.debug("Generated SegmentIndex from segment duration",
        streamInfo.segmentIndex);
    return true
};
shaka.dash.MpdProcessor.prototype.computeOptimalSegmentIndexSize_ = function(mpd, period, segmentTemplate) {
    shaka.asserts.assert(segmentTemplate.segmentDuration);
    shaka.asserts.assert(segmentTemplate.timescale > 0);
    var duration;
    if (mpd.type == "static")
        if (period.duration != null) duration = period.duration;
        else {
            shaka.log.error("Cannot instantiate SegmentTemplate: the Period's duration " + "is unknown.", period);
            return null
        } else duration = Math.min(period.duration || Number.POSITIVE_INFINITY, mpd.minUpdatePeriod || Number.POSITIVE_INFINITY,
        shaka.dash.MpdProcessor.MAX_SEGMENT_INDEX_SPAN);
    shaka.asserts.assert(duration && duration != Number.POSITIVE_INFINITY, "duration should not be zero or infinity!");
    var scaledSegmentDuration = segmentTemplate.segmentDuration / segmentTemplate.timescale;
    var n = Math.ceil(duration / scaledSegmentDuration);
    shaka.log.v1("SegmentIndex span", duration);
    shaka.log.v1("Optimal SegmentIndex size", n);
    shaka.asserts.assert(n >= 1);
    return n
};
shaka.dash.MpdProcessor.prototype.computeAvailableSegmentRange_ = function(mpd, period, segmentTemplate) {
    var currentTime = shaka.util.Clock.now() / 1E3;
    var availabilityStartTime = mpd.availabilityStartTime != null ? mpd.availabilityStartTime : currentTime;
    if (availabilityStartTime > currentTime) {
        shaka.log.warning("The stream is not available yet!", period);
        return null
    }
    var minBufferTime = mpd.minBufferTime || 0;
    var suggestedPresentationDelay = mpd.suggestedPresentationDelay || 0;
    shaka.asserts.assert(segmentTemplate.segmentDuration);
    shaka.asserts.assert(segmentTemplate.timescale > 0);
    var scaledSegmentDuration = segmentTemplate.segmentDuration / segmentTemplate.timescale;
    var currentPresentationTime = currentTime - (availabilityStartTime + period.start);
    if (currentPresentationTime < 0) {
        shaka.log.warning("The Period is not available yet!", period);
        return null
    }
    var earliestAvailableTimestamp = currentPresentationTime - 2 * scaledSegmentDuration - mpd.timeShiftBufferDepth;
    if (earliestAvailableTimestamp < 0) earliestAvailableTimestamp = 0;
    var earliestAvailableSegmentStartTime =
        Math.ceil(earliestAvailableTimestamp / scaledSegmentDuration) * scaledSegmentDuration;
    var latestAvailableTimestamp = currentPresentationTime - scaledSegmentDuration;
    if (latestAvailableTimestamp < 0) {
        shaka.log.warning("The first segment is not available yet!", period);
        return null
    }
    var latestAvailableSegmentStartTime = Math.floor(latestAvailableTimestamp / scaledSegmentDuration) * scaledSegmentDuration;
    var bestAvailableTimestamp = latestAvailableSegmentStartTime - suggestedPresentationDelay - minBufferTime;
    if (bestAvailableTimestamp <
        0) {
        shaka.log.warning("The first segment may not be available yet.");
        bestAvailableTimestamp = 0
    }
    var bestAvailableSegmentStartTime = Math.floor(bestAvailableTimestamp / scaledSegmentDuration) * scaledSegmentDuration;
    var currentSegmentStartTime;
    if (bestAvailableSegmentStartTime >= earliestAvailableSegmentStartTime) {
        currentSegmentStartTime = bestAvailableSegmentStartTime;
        shaka.log.v1("The best available segment is still available!")
    } else {
        currentSegmentStartTime = earliestAvailableSegmentStartTime;
        shaka.log.v1("The best available segment is no longer available.")
    }
    var earliestSegmentNumber =
        earliestAvailableSegmentStartTime / scaledSegmentDuration + 1;
    shaka.asserts.assert(earliestSegmentNumber == Math.round(earliestSegmentNumber), "earliestSegmentNumber should be an integer.");
    var currentSegmentNumber = currentSegmentStartTime / scaledSegmentDuration + 1;
    shaka.asserts.assert(currentSegmentNumber == Math.round(currentSegmentNumber), "currentSegmentNumber should be an integer.");
    shaka.log.v1("earliestSegmentNumber", earliestSegmentNumber);
    shaka.log.v1("currentSegmentNumber", currentSegmentNumber);
    return {
        earliest: earliestSegmentNumber,
        current: currentSegmentNumber
    }
};
shaka.dash.MpdProcessor.prototype.generateInitialization_ = function(representation) {
    shaka.asserts.assert(representation.segmentTemplate);
    var segmentTemplate = representation.segmentTemplate;
    shaka.asserts.assert(segmentTemplate.initializationUrlTemplate);
    if (!segmentTemplate.initializationUrlTemplate) return null;
    var initialization = new shaka.dash.mpd.Initialization;
    var filledUrlTemplate = this.fillUrlTemplate_(segmentTemplate.initializationUrlTemplate, representation.id, null, representation.bandwidth, null);
    if (!filledUrlTemplate) return null;
    if (representation.baseUrl && filledUrlTemplate) initialization.url = representation.baseUrl.resolve(filledUrlTemplate);
    else initialization.url = filledUrlTemplate;
    return initialization
};
shaka.dash.MpdProcessor.prototype.fillUrlTemplate_ = function(urlTemplate, representationId, number, bandwidth, time) {
    var valueTable = {
        "RepresentationID": representationId,
        "Number": number,
        "Bandwidth": bandwidth,
        "Time": time
    };
    var re = /\$(RepresentationID|Number|Bandwidth|Time)?(?:%0([0-9]+)d)?\$/g;
    var url = urlTemplate.replace(re, function(match, name, widthString) {
        if (match == "$$") return "$";
        var value = valueTable[name];
        shaka.asserts.assert(value !== undefined);
        if (value == null) {
            shaka.log.warning("URL template does not have an available substitution for " +
                "identifier " + '"' + name + '".');
            return match
        }
        if (name == "RepresentationID" && widthString) {
            shaka.log.warning("URL template should not contain a width specifier for identifier " + '"RepresentationID".');
            widthString = undefined
        }
        var valueString = value.toString();
        var width = window.parseInt(widthString, 10) || 1;
        var paddingSize = Math.max(0, width - valueString.length);
        var padding = (new Array(paddingSize + 1)).join("0");
        return padding + valueString
    });
    try {
        return new goog.Uri(url)
    } catch (exception) {
        if (exception instanceof URIError) {
            shaka.log.warning("URL template contains an illegal character.");
            return null
        }
        throw exception;
    }
};
shaka.dash.MpdProcessor.prototype.createSegmentMetadataInfo_ = function(urlTypeObject) {
    if (!urlTypeObject) return null;
    var segmentMetadataInfo = new shaka.media.SegmentMetadataInfo;
    segmentMetadataInfo.url = urlTypeObject.url;
    if (urlTypeObject.range) {
        segmentMetadataInfo.startByte = urlTypeObject.range.begin;
        segmentMetadataInfo.endByte = urlTypeObject.range.end
    }
    return segmentMetadataInfo
};
goog.provide("shaka.dash.MpdRequest");
goog.require("shaka.dash.mpd");
goog.require("shaka.util.AjaxRequest");
shaka.dash.MpdRequest = function(url) {
    shaka.util.AjaxRequest.call(this, url);
    this.parameters.responseType = "text";
    this.parameters.maxAttempts = 3;
    this.parameters.synchronizeClock = true
};
goog.inherits(shaka.dash.MpdRequest, shaka.util.AjaxRequest);
shaka.dash.MpdRequest.prototype.send = function() {
    var url = this.url;
    return this.sendInternal().then(function(xhr) {
        var mpd = shaka.dash.mpd.parseMpd(xhr.responseText, url);
        if (mpd) return Promise.resolve(mpd);
        var error = new Error("MPD parse failure.");
        error.type = "mpd";
        return Promise.reject(error)
    })
};
goog.provide("sr.mpdParser");
goog.require("shaka.dash.MpdRequest");
goog.require("shaka.dash.mpd");
goog.require("shaka.dash.MpdProcessor");
goog.require("shaka.util.PublicPromise");
sr.mpdParser = function(mpdUrl) {
    var mpdRequest = new shaka.dash.MpdRequest(mpdUrl);
    var promise = new shaka.util.PublicPromise;
    mpdRequest.send().then(function(mpd) {
        var mpdProcessor = new shaka.dash.MpdProcessor(null);
        mpdProcessor.process(mpd);
        promise.resolve(mpdProcessor)
    });
    return promise
};
goog.exportSymbol("sr.mpdParser", sr.mpdParser);