const path = require ("path");
const {isPathRelative} = require ("../helpers");
const micromatch = require ("micromatch");

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "restrict imports from layers",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          ignoreImportPatterns: {
            type: 'array'
          }
        }
      }
    ],
  },

  create(context) {
    const layers = {
      'app': ['pages', 'widgets', 'features', 'shared', 'entities'],
      'pages': ['widgets', 'features', 'shared', 'entities'],
      'widgets': ['features', 'shared', 'entities'],
      'features': ['shared', 'entities'],
      'entities': ['shared', 'entities'],
      'shared': ['shared']
    }

    const allowedLayers = {
      app: 'app',
      entities: 'entities',
      features: 'features',
      pages: 'pages',
      widgets: 'entities',
      shared: 'shared'
    }

    const { alias = '', ignoreImportPatterns = [] } = context.options[0] ?? {}

    const getCurrentFileLayer = () => {
      const currentFilePath = context.getFilename()

      const normalizedPath = path.toNamespacedPath(currentFilePath)
      const projectPath = normalizedPath?.split('src')[1]
      const segments = projectPath?.split('\\')

      return segments?.[1]
    }

    const getImportLayer = (value) => {
      const importTo = alias ? value.replace(`${alias}/`, '') : value
      const segments = importTo.split('/')

      return segments?.[0]
    }
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const currentFileLayer = getCurrentFileLayer()
        const importLayer = getImportLayer(importPath)

        if (isPathRelative(importPath)) {
          return;
        }

        if (!allowedLayers[importLayer] || !allowedLayers[currentFileLayer]) {
          return
        }

        const isIgnored = ignoreImportPatterns.some(pattern => micromatch.isMatch(importPath, pattern))

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report(node, 'A layer can import only the underlying layers')
        }
      }
    };
  },
};
