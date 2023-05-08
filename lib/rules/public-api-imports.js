/**
 * @fileoverview allows import only from public api
 * @author NegativWest
 */
"use strict";

const {isPathRelative} = require ("../helpers");
const micromatch = require("micromatch")
const path = require ("path");

const PUBLIC_ERROR = 'PUBLIC_ERROR'
const PUBLIC_TEST_ERROR = 'PUBLIC_TEST_ERROR'

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "allows import only from public api",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    messages: {
      [PUBLIC_ERROR]: 'Absolute import allowed only from public api',
      [PUBLIC_TEST_ERROR]: 'Test data should be imported only from public api'
    },
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          testFilePatterns: {
            type: 'array'
          }
        }
      }
    ],
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {}
    const allowedLayers = {
      entities: 'entities',
      features: 'features',
      pages: 'pages',
      widgets: 'entities',
    }
    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if(isPathRelative(importTo)) {
          return;
        }

        // [entities, article, model, types]
        const segments = importTo.split('/')
        const layer = segments[0];
        const slice = segments[1];

        if(!allowedLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

        if(isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node,
            messageId: PUBLIC_ERROR,
            fix: (fixer) => {
              return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
            }
          });
        }

        if(isTestingPublicApi) {
          const currentFilePath = context.getFilename();
          const normalizedPath = path.toNamespacedPath(currentFilePath);

          const isCurrentFileTesting = testFilesPatterns.some(
            pattern => micromatch.isMatch(normalizedPath, pattern)
          )

          if(!isCurrentFileTesting) {
            context.report({node, messageId: PUBLIC_TEST_ERROR});
          }
        }
      }
    };
  },
};
