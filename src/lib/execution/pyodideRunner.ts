import { TestResult, TestCase } from "@/types";

declare global {
  interface Window {
    loadPyodide: any;
    pyodideInstance: any;
  }
}

export async function initPyodide() {
  if (window.pyodideInstance) return window.pyodideInstance;

  if (!document.getElementById("pyodide-script")) {
    const script = document.createElement("script");
    script.id = "pyodide-script";
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
    document.head.appendChild(script);

    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }

  if (window.loadPyodide && !window.pyodideInstance) {
    window.pyodideInstance = await window.loadPyodide();
  }

  return window.pyodideInstance;
}

export async function runPythonTests(
  userCode: string,
  tests: TestCase[],
): Promise<TestResult[]> {
  const pyodide = await initPyodide();
  const results: TestResult[] = [];

  for (const test of tests) {
    try {
      // Execute starter/user-edited code first
      await pyodide.runPythonAsync(userCode);

      // Execute the test expression directly
      const result = await pyodide.runPythonAsync(test.expression);
      const received = String(result);

      results.push({
        testId: test.id,
        expression: test.expression,
        expected: test.expected,
        received: received,
        passed: received === test.expected,
      });
    } catch (err: any) {
      results.push({
        testId: test.id,
        expression: test.expression,
        expected: test.expected,
        received: "Runtime Error",
        passed: false,
        error: err.message || "Execution error",
      });
    }
  }

  return results;
}
