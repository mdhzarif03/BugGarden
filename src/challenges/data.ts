import { Challenge } from "@/types";

export const CHALLENGES: Challenge[] = [
  {
    id: "01",
    title: "The Broken Sum",
    category: "Logic Bugs",
    difficulty: "Beginner",
    language: "python",
    description: "This function is supposed to calculate and return the sum of two numbers, but it returns an unexpected result.",
    starterCode: "def add(a, b):\n    return a - b",
    solutionCode: "def add(a, b):\n    return a + b",
    tests: [
      { expression: "add(2, 3)", expected: "5" },
      { expression: "add(-1, 1)", expected: "0" },
      { expression: "add(0, 0)", expected: "0" }
    ],
    explanation: "Replaced subtraction (-) with addition (+).",
    concept: "Arithmetic Operators",
    hints: ["Check the math operator in the return statement."]
  },
  {
    id: "02",
    title: "Off by One Loop",
    category: "Logic Bugs",
    difficulty: "Beginner",
    language: "python",
    description: "Fix the function so that it returns a list containing numbers from 1 up to n (inclusive).",
    starterCode: "def count_up_to(n):\n    return list(range(1, n))",
    solutionCode: "def count_up_to(n):\n    return list(range(1, n + 1))",
    tests: [
      { expression: "count_up_to(3)", expected: "[1, 2, 3]" },
      { expression: "count_up_to(5)", expected: "[1, 2, 3, 4, 5]" }
    ],
    explanation: "Python range excludes stop. Incrementing stop to n + 1 includes n.",
    concept: "Range Boundaries",
    hints: ["Remember range() excludes the end index."]
  },
  {
    id: "03",
    title: "Palindrome Validator",
    category: "Logic Bugs",
    difficulty: "Intermediate",
    language: "python",
    description: "This function checks if a word is a palindrome, but fails on uppercase letters.",
    starterCode: "def is_palindrome(s):\n    return s == s[::-1]",
    solutionCode: "def is_palindrome(s):\n    s_clean = s.lower()\n    return s_clean == s_clean[::-1]",
    tests: [
      { expression: "is_palindrome(\"Racecar\")", expected: "True" },
      { expression: "is_palindrome(\"hello\")", expected: "False" }
    ],
    explanation: "Converting string to lowercase before comparing ensures case-insensitivity.",
    concept: "String Handling",
    hints: ["Use .lower() before comparing."]
  },
  {
    id: "04",
    title: "Find Maximum Value",
    category: "Data Structures",
    difficulty: "Beginner",
    language: "python",
    description: "Fix the function to return the highest number in a list without using built-in max().",
    starterCode: "def find_max(numbers):\n    max_val = 0\n    for n in numbers:\n        if n < max_val:\n            max_val = n\n    return max_val",
    solutionCode: "def find_max(numbers):\n    max_val = numbers[0]\n    for n in numbers:\n        if n > max_val:\n            max_val = n\n    return max_val",
    tests: [
      { expression: "find_max([3, 7, 2, 9, 4])", expected: "9" },
      { expression: "find_max([-5, -1, -10])", expected: "-1" }
    ],
    explanation: "Initialize max_val to numbers[0] and use > instead of <.",
    concept: "Array Traversal",
    hints: ["Check the comparison operator inside the loop."]
  }
];

export const challenges = CHALLENGES;
