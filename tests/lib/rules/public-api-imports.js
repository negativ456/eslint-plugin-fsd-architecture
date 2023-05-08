/**
 * @fileoverview allows import only from public api
 * @author NegativWest
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const aliasOptions = [
  {
    alias: '@'
  }
]
const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});
ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { useGetArticleRating, useRateArticle } from '../../api/articleRatingApi'",
      errors: []
    },
    {
      code: "import { useGetArticleRating, useRateArticle } from '@/entities/Article'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/storeDecorator.tsx']
      }],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\storeDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/storeDecorator.tsx']
      }],
    }
  ],

  invalid: [
    {
      code: "import { useGetArticleRating, useRateArticle } from '@/entities/Article/model/file.ts'",
      errors: [{ message: "Absolute import allowed only from public api" }],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\m2005111\\src\\entities\\storeDecorator.tsx',
      code: "import { ArticleType } from '@/entities/Article/testing/file.tsx'",
      errors: [{message: 'Absolute import allowed only from public api'}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.tsx', '**/storeDecorator.tsx']
      }]
    },
    {
      filename: 'C:\\Users\\m2005111\\src\\entities\\forbidden.ts',
      code: "import { ArticleType } from '@/entities/Article/testing'",
      errors: [{message: 'Test data should be imported only from public api'}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.tsx', '**/storeDecorator.tsx']
      }]
    },
  ],
});
