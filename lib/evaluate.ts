import { evaluate } from 'mathjs';

export const evaluateExpression = (expression: string): string => {
  try {
    const result = evaluate(expression);
    return result.toString();
  } catch {
    return 'Error';
  }
};
