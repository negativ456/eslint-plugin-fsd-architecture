/**
 * @fileoverview fsd relative path checker
 * @author NegativWest
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: 'C:\\Users\\m2005111\\src\\entities\\Article',
      code: "import { ArticleType } from '../../model/consts/articleConsts'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\m2005111\\src\\entities\\Article',
      code: "import { ArticleType } from 'entities/Article/model/consts/articleConsts'",
      errors: [{ message: "Within a single module, all imports must be relative" }],
    },
    {
      filename: 'C:\\Users\\m2005111\\src\\entities\\Article',
      code: "import { ArticleType } from '@/entities/Article/model/consts/articleConsts'",
      errors: [{ message: "Within a single module, all imports must be relative" }],
      options: [{
        alias: '@'
      }]
    },
  ],
});
