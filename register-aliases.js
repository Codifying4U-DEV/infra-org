const moduleLoader = require("module");
const path = require("path");

const rootDir = __dirname;
const originalResolveFilename = moduleLoader._resolveFilename;

moduleLoader._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request === "@") {
    return originalResolveFilename.call(this, rootDir, parent, isMain, options);
  }

  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(rootDir, request.slice(2)),
      parent,
      isMain,
      options,
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
