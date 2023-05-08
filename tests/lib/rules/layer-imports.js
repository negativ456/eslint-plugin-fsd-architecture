/**
 * @fileoverview restrict imports from layers
 * @author NegativWest
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});
const aliasOptions = [
  {
    alias: '@'
  }
]
ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename: 'C:\\Users\\m2005111\\src\\entities\\Article',
      code: "import { ArticleType } from '@/shared/Button'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\m2005111\\src\\features\\Article',
      code: "import { ArticleType } from '@/entities/Comment'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\m2005111\\src\\features\\Article',
      code: "import react from 'react'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\m2005111\\src\\index.tsx',
      code: "import { StoreProvider } from '@/app/providers/store'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\m2005111\\src\\entities\\Article',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider']
        }
      ]
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\m2005111\\src\\entities\\Article',
      code: "import { ArticleType } from '@/features/Button/file.ts'",
      errors: [
        {
          message: 'A layer can import only the underlying layers'
        }
      ],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\m2005111\\src\\entities\\Article',
      code: "import { ArticleType } from '@/app/Button'",
      errors: [
        {
          message: 'A layer can import only the underlying layers'
        }
      ],
      options: aliasOptions
    },
  ],
});
