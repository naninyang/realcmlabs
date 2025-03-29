import { useState } from 'react';
import { sin, cos, tan, pi, e as E } from 'mathjs';
import { evaluateExpression } from '@/lib/evaluate';
import styles from '@/styles/Calculator.module.sass';

export default function Calculator() {
  const [input, setInput] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');

  const handleButtonClick = (value: string) => {
    setInput((prev) => (prev === '0' ? value : prev + value));
  };

  const handleClear = () => setInput('0');

  const handleEvaluate = () => {
    const result = evaluateExpression(input.replace('×', '*').replace('÷', '/'));
    setInput(result);
  };

  const handleMemory = (type: string) => {
    const current = parseFloat(input);
    switch (type) {
      case 'mc':
        setMemory(0);
        break;
      case 'm+':
        setMemory((prev) => prev + current);
        break;
      case 'm-':
        setMemory((prev) => prev - current);
        break;
      case 'mr':
        setInput(memory.toString());
        break;
    }
  };

  const handleSpecial = (type: string) => {
    if (type === '⁺/₋') {
      if (input.startsWith('-')) setInput(input.slice(1));
      else setInput('-' + input);
    } else if (type === '%') {
      try {
        const result = parseFloat(input) / 100;
        setInput(result.toString());
      } catch {
        setInput('Error');
      }
    }
  };

  const handleScientific = (btn: string) => {
    const x = parseFloat(input);

    if (isNaN(x)) {
      setInput('Error');
      return;
    }

    try {
      const result =
        btn === 'x^y'
          ? input + '^'
          : btn === '𝑒^x'
            ? Math.exp(x)
            : btn === '10^x'
              ? Math.pow(10, x)
              : btn === 'ln'
                ? Math.log(x)
                : btn === 'log₁₀'
                  ? Math.log10(x)
                  : input;

      if (typeof result === 'number') setInput(result.toString());
      else setInput(result);
    } catch {
      setInput('Error');
    }
  };

  const handleTrig = (btn: string) => {
    const x = parseFloat(input);
    if (isNaN(x)) {
      setInput('Error');
      return;
    }

    const angle = angleMode === 'deg' ? (x * Math.PI) / 180 : x;

    try {
      const result = btn === 'sin' ? sin(angle) : btn === 'cos' ? cos(angle) : btn === 'tan' ? tan(angle) : input;

      setInput(result.toString());
    } catch {
      setInput('Error');
    }
  };

  const handleInsertConstant = (btn: string) => {
    const value = btn === 'π' ? pi : E;
    setInput((prev) => (prev === '0' ? value.toString() : prev + value.toString()));
  };

  const handlePowerAndRoots = (btn: string) => {
    const x = parseFloat(input);
    if (isNaN(x)) {
      setInput('Error');
      return;
    }

    try {
      const result =
        btn === 'x²'
          ? Math.pow(x, 2)
          : btn === 'x³'
            ? Math.pow(x, 3)
            : btn === '√x'
              ? Math.sqrt(x)
              : btn === '³√x'
                ? Math.cbrt(x)
                : input;

      setInput(result.toString());
    } catch {
      setInput('Error');
    }
  };

  const handleAdvanced = (btn: string) => {
    const x = parseFloat(input);
    if (btn === '2nd') {
      return;
    }

    if (btn === 'Rand') {
      const rand = Math.random();
      setInput(rand.toString());
      return;
    }

    if (btn === 'x!') {
      if (isNaN(x) || x < 0 || !Number.isInteger(x)) {
        setInput('Error');
        return;
      }

      const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

      setInput(factorial(x).toString());
      return;
    }

    if (btn === 'EE') {
      setInput((prev) => prev + '×10^');
      return;
    }
  };

  const scientificButtons = [
    '(',
    ')',
    'mc',
    'm+',
    'm-',
    'mr',
    '2nd',
    'x²',
    'x³',
    'xʸ',
    '𝑒ˣ',
    '10ˣ',
    '¹⁄ₓ',
    '√x',
    '³√x',
    'ʸ√x',
    'ln',
    'log₁₀',
    'x!',
    'sin',
    'cos',
    'tan',
    '𝑒',
    'EE',
    'Rand',
    'sinh',
    'cosh',
    'tanh',
    'π',
    'Deg',
  ];

  const baseButtons = ['AC', '⁺/₋', '%', '7', '8', '9', '4', '5', '6', '1', '2', '3', 'AC', '0', '.'];
  const operatorButtons = ['÷', '×', '-', '+', '='];

  return (
    <section className={styles.calculator}>
      <div className={styles.module}>
        <h2>공학 계산기</h2>
        <div className={styles.display} role="status" aria-live="polite" aria-atomic="true">
          {input}
        </div>
        <div className={styles.calc}>
          <div className={`${styles.group} ${styles.scientific}`}>
            {scientificButtons.map((btn) => (
              <div className={styles.button} key={btn}>
                <button
                  onClick={() => {
                    if (['mc', 'm+', 'm-', 'mr'].includes(btn)) return handleMemory(btn);
                    if (['x^y', '𝑒^x', '10^x', 'ln', 'log₁₀'].includes(btn)) return handleScientific(btn);
                    if (['sin', 'cos', 'tan'].includes(btn)) return handleTrig(btn);
                    if (['π', '𝑒'].includes(btn)) return handleInsertConstant(btn);
                    if (btn === 'Deg/Rad') return setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'));
                    if (['x²', 'x³', '√x', '³√x'].includes(btn)) return handlePowerAndRoots(btn);
                    if (['x!', 'Rand', 'EE', '2nd'].includes(btn)) return handleAdvanced(btn);
                    return handleButtonClick(btn);
                  }}
                  className={styles.button}
                  aria-label={
                    btn === '𝑒'
                      ? "Euler's number"
                      : btn === 'π'
                        ? 'Pi'
                        : btn === 'Deg'
                          ? angleMode === 'deg'
                            ? 'Degree mode'
                            : 'Radian mode'
                          : btn
                  }
                  aria-pressed={btn === 'Deg' ? angleMode === 'deg' : undefined}
                >
                  {btn === 'Deg/Rad' ? angleMode.toUpperCase() : btn}
                </button>
              </div>
            ))}
          </div>
          <div className={styles.groups}>
            <div className={styles.group}>
              {baseButtons.map((btn) => (
                <div className={styles.button} key={btn}>
                  <button
                    key={btn}
                    onClick={() =>
                      btn === 'AC'
                        ? handleClear()
                        : btn === '⁺/₋' || btn === '%'
                          ? handleSpecial(btn)
                          : handleButtonClick(btn)
                    }
                    className={styles.button}
                    aria-label={btn === '⁺/₋' ? 'Toggle sign' : btn}
                  >
                    {btn}
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.group}>
              {operatorButtons.map((btn) => (
                <div className={`${styles.button} ${styles.operator}`} key={btn}>
                  <button key={btn} onClick={() => (btn === '=' ? handleEvaluate() : handleButtonClick(btn))}>
                    {btn}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
