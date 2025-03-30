import { evaluate, format } from 'mathjs';

export const evaluateExpression = (input: string): string => {
  try {
    const result = evaluate(input);
    return format(result, { notation: 'auto' });
  } catch {
    return 'Error';
  }
};
