import { TSESLint } from '@typescript-eslint/utils';
import rule from '../prefer-comparison-matcher';
import { espreeParser } from './test-utils';

const ruleTester = new TSESLint.RuleTester({
  parser: espreeParser,
  parserOptions: {
    ecmaVersion: 2015,
  },
});

const generateInvalidCases = (
  operator: string,
  equalityMatcher: string,
  preferredMatcher: string,
  preferredMatcherWhenNegated: string,
): Array<TSESLint.InvalidTestCase<'useToBeComparison', never>> => {
  return [
    {
      code: `expect(value ${operator} 1).${equalityMatcher}(true);`,
      output: `expect(value).${preferredMatcher}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher },
          column: 18 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1)['${equalityMatcher}'](true);`,
      output: `expect(value).${preferredMatcher}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher },
          column: 18 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1).resolves.${equalityMatcher}(true);`,
      output: `expect(value).resolves.${preferredMatcher}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher },
          column: 27 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1).${equalityMatcher}(false);`,
      output: `expect(value).${preferredMatcherWhenNegated}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher: preferredMatcherWhenNegated },
          column: 18 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1)['${equalityMatcher}'](false);`,
      output: `expect(value).${preferredMatcherWhenNegated}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher: preferredMatcherWhenNegated },
          column: 18 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1).resolves.${equalityMatcher}(false);`,
      output: `expect(value).resolves.${preferredMatcherWhenNegated}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher: preferredMatcherWhenNegated },
          column: 27 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1).not.${equalityMatcher}(true);`,
      output: `expect(value).${preferredMatcherWhenNegated}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher: preferredMatcherWhenNegated },
          column: 22 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1)['not'].${equalityMatcher}(true);`,
      output: `expect(value).${preferredMatcherWhenNegated}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher: preferredMatcherWhenNegated },
          column: 25 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1).resolves.not.${equalityMatcher}(true);`,
      output: `expect(value).resolves.${preferredMatcherWhenNegated}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher: preferredMatcherWhenNegated },
          column: 31 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1).not.${equalityMatcher}(false);`,
      output: `expect(value).${preferredMatcher}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher },
          column: 22 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1).resolves.not.${equalityMatcher}(false);`,
      output: `expect(value).resolves.${preferredMatcher}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher },
          column: 31 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1)["resolves"].not.${equalityMatcher}(false);`,
      output: `expect(value).resolves.${preferredMatcher}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher },
          column: 34 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1)["resolves"]["not"].${equalityMatcher}(false);`,
      output: `expect(value).resolves.${preferredMatcher}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher },
          column: 37 + operator.length,
          line: 1,
        },
      ],
    },
    {
      code: `expect(value ${operator} 1)["resolves"]["not"]['${equalityMatcher}'](false);`,
      output: `expect(value).resolves.${preferredMatcher}(1);`,
      errors: [
        {
          messageId: 'useToBeComparison',
          data: { preferredMatcher },
          column: 37 + operator.length,
          line: 1,
        },
      ],
    },
  ];
};

const generateValidStringLiteralCases = (operator: string, matcher: string) => {
  return [
    ['x', "'y'"],
    ['x', '`y`'],
    ['x', '`y${z}`'],
  ].reduce((cases, [a, b]) => [
    ...cases,
    ...[
      `expect(${a} ${operator} ${b}).${matcher}(true)`,
      `expect(${a} ${operator} ${b}).${matcher}(false)`,
      `expect(${a} ${operator} ${b}).not.${matcher}(true)`,
      `expect(${a} ${operator} ${b}).not.${matcher}(false)`,
      `expect(${b} ${operator} ${a}).${matcher}(true)`,
      `expect(${b} ${operator} ${a}).${matcher}(false)`,
      `expect(${b} ${operator} ${a}).not.${matcher}(true)`,
      `expect(${b} ${operator} ${a}).not.${matcher}(false)`,
      `expect(${a} ${operator} ${b}).${matcher}(true)`,
      `expect(${a} ${operator} ${b}).${matcher}(false)`,
      `expect(${a} ${operator} ${b}).not.${matcher}(true)`,
      `expect(${a} ${operator} ${b}).not.${matcher}(false)`,
      `expect(${b} ${operator} ${a}).${matcher}(true)`,
      `expect(${b} ${operator} ${a}).${matcher}(false)`,
      `expect(${b} ${operator} ${a}).not.${matcher}(true)`,
      `expect(${b} ${operator} ${a}).not.${matcher}(false)`,
      `expect(${b} ${operator} ${b}).not.${matcher}(false)`,
      `expect(${b} ${operator} ${b}).resolves.not.${matcher}(false)`,
      `expect(${b} ${operator} ${b}).resolves.${matcher}(false)`,
    ],
  ]);
};

const testComparisonOperator = (
  operator: string,
  preferredMatcher: string,
  preferredMatcherWhenNegated: string,
) => {
  ruleTester.run(`prefer-to-be-comparison: ${operator}`, rule, {
    valid: [
      'expect()',
      'expect({}).toStrictEqual({})',
      `expect(value).${preferredMatcher}(1);`,
      `expect(value).${preferredMatcherWhenNegated}(1);`,
      `expect(value).not.${preferredMatcher}(1);`,
      `expect(value).not.${preferredMatcherWhenNegated}(1);`,
      ...['toBe', 'toEqual', 'toStrictEqual'].reduce<string[]>(
        (cases, equalityMatcher) => [
          ...cases,
          ...generateValidStringLiteralCases(operator, equalityMatcher),
        ],
        [],
      ),
    ],
    invalid: ['toBe', 'toEqual', 'toStrictEqual'].reduce<
      Array<TSESLint.InvalidTestCase<'useToBeComparison', never>>
    >(
      (cases, equalityMatcher) => [
        ...cases,
        ...generateInvalidCases(
          operator,
          equalityMatcher,
          preferredMatcher,
          preferredMatcherWhenNegated,
        ),
      ],
      [],
    ),
  });
};

testComparisonOperator('>', 'toBeGreaterThan', 'toBeLessThanOrEqual');
testComparisonOperator('<', 'toBeLessThan', 'toBeGreaterThanOrEqual');
testComparisonOperator('>=', 'toBeGreaterThanOrEqual', 'toBeLessThan');
testComparisonOperator('<=', 'toBeLessThanOrEqual', 'toBeGreaterThan');

ruleTester.run(`prefer-to-be-comparison`, rule, {
  valid: [
    'expect.hasAssertions',
    'expect.hasAssertions()',
    'expect.assertions(1)',
    'expect(true).toBe(...true)',
    'expect()',
    'expect({}).toStrictEqual({})',
    'expect(a === b).toBe(true)',
    'expect(a !== 2).toStrictEqual(true)',
    'expect(a === b).not.toEqual(true)',
    'expect(a !== "string").toStrictEqual(true)',
    'expect(5 != a).toBe(true)',
    'expect(a == "string").toBe(true)',
    'expect(a == "string").not.toBe(true)',
  ],
  invalid: [],
});
