import { useState } from 'react';
import { sin, cos, tan, sinh, cosh, tanh, pi, e as E } from 'mathjs';
import { evaluateExpression } from '@/lib/evaluate';
import styles from '@/styles/Calculator.module.sass';

export default function Calculator() {
  const [input, setInput] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');

  const handleButtonClick = (value: string) => {
    setInput((prev) => {
      if (prev === '0') return value;
      if (prev === '-0') return '-' + value;
      return prev + value;
    });
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
      setInput((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
    } else if (type === '%') {
      try {
        const result = parseFloat(input) / 100;
        setInput(result.toString());
      } catch {
        setInput('Error');
      }
    }
    if (input === '0' || input === '-0') {
      setInput('0');
    }
  };

  const handleScientific = (btn: string) => {
    const x = parseFloat(input);
    if (isNaN(x)) return setInput('Error');

    try {
      const result =
        btn === 'xʸ'
          ? input + '^'
          : btn === '𝑒ˣ'
            ? Math.exp(x)
            : btn === '10ˣ'
              ? Math.pow(10, x)
              : btn === 'ln'
                ? Math.log(x)
                : btn === 'log₁₀'
                  ? Math.log10(x)
                  : input;

      setInput(typeof result === 'number' ? result.toString() : result);
    } catch {
      setInput('Error');
    }
  };

  const handleTrig = (btn: string) => {
    const x = parseFloat(input);
    if (isNaN(x)) return setInput('Error');

    if (['sin', 'cos', 'tan'].includes(btn)) {
      const angle = angleMode === 'deg' ? (x * Math.PI) / 180 : x;
      const result = btn === 'sin' ? sin(angle) : btn === 'cos' ? cos(angle) : tan(angle);
      return setInput(result.toString());
    }

    if (['sinh', 'cosh', 'tanh'].includes(btn)) {
      const result = btn === 'sinh' ? sinh(x) : btn === 'cosh' ? cosh(x) : tanh(x);
      return setInput(result.toString());
    }

    const angle = angleMode === 'deg' ? (x * Math.PI) / 180 : x;

    try {
      const result =
        btn === 'sin'
          ? sin(angle)
          : btn === 'cos'
            ? cos(angle)
            : btn === 'tan'
              ? tan(angle)
              : btn === 'sinh'
                ? sinh(angle)
                : btn === 'cosh'
                  ? cosh(angle)
                  : btn === 'tanh'
                    ? tanh(angle)
                    : input;

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
    if (isNaN(x)) return setInput('Error');

    if (btn === '¹⁄ₓ') {
      if (x === 0) return setInput('Error');
      return setInput((1 / x).toString());
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
                : btn === '¹⁄ₓ'
                  ? 1 / x
                  : input;

      setInput(result.toString());
    } catch {
      setInput('Error');
    }
  };

  const handleAdvanced = (btn: string) => {
    const x = parseFloat(input);
    if (btn === '2nd') return;
    if (btn === 'Rand') return setInput(Math.random().toString());
    if (btn === 'x!') {
      if (isNaN(x) || x < 0 || !Number.isInteger(x)) return setInput('Error');
      const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
      return setInput(factorial(x).toString());
    }
    if (btn === 'EE') return setInput((prev) => prev + '×10^');
    if (btn === 'Deg') return setAngleMode('deg');
    if (btn === 'Rad') return setAngleMode('rad');
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
  ];

  const baseButtons = ['AC', '⁺/₋', '%', '7', '8', '9', '4', '5', '6', '1', '2', '3', 'AC', '0', '.'];
  const operatorButtons = ['÷', '×', '-', '+', '='];
  const renderButtons = [...scientificButtons, angleMode === 'deg' ? 'Rad' : 'Deg'];

  return (
    <section className={styles.calculator}>
      <div className={styles.module}>
        <h2>공학 계산기</h2>
        <div className={styles.notice}>
          <p>* AC 버튼을 누르기 전까지는 절대 리셋되지 않습니다.</p>
          <p>* AC 버튼을 누르더라도 Rad/Deg 상태는 초기화되지 않습니다.</p>
        </div>
        <div className={styles.display} role="status" aria-live="polite" aria-atomic="true">
          {angleMode === 'rad' && <span>Rad</span>}
          <strong>{input}</strong>
        </div>
        <div className={styles.calc}>
          <div className={`${styles.group} ${styles.scientific}`}>
            {renderButtons.map((btn) => (
              <div className={styles.button} key={btn}>
                <button
                  onClick={() => {
                    if (btn === 'Rad') return setAngleMode('rad');
                    if (btn === 'Deg') return setAngleMode('deg');

                    if (['mc', 'm+', 'm-', 'mr'].includes(btn)) return handleMemory(btn);
                    if (['xʸ', '𝑒ˣ', '10ˣ', 'ln', 'log₁₀'].includes(btn)) return handleScientific(btn);
                    if (['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh'].includes(btn)) return handleTrig(btn);
                    if (['π', '𝑒'].includes(btn)) return handleInsertConstant(btn);
                    if (['x²', 'x³', '√x', '³√x', '¹⁄ₓ'].includes(btn)) return handlePowerAndRoots(btn);
                    if (['x!', 'Rand', 'EE', '2nd'].includes(btn)) return handleAdvanced(btn);

                    return handleButtonClick(btn);
                  }}
                  className={styles.button}
                  aria-label={
                    btn === '𝑒'
                      ? "Euler's number"
                      : btn === 'π'
                        ? 'Pi'
                        : btn === 'Rad'
                          ? 'Switch to radian mode'
                          : btn === 'Deg'
                            ? 'Switch to degree mode'
                            : btn
                  }
                >
                  {btn}
                </button>
              </div>
            ))}
          </div>
          <div className={styles.groups}>
            <div className={styles.group}>
              {baseButtons.map((btn) => (
                <div className={styles.button} key={btn}>
                  <button
                    onClick={() =>
                      btn === 'AC'
                        ? handleClear()
                        : btn === '⁺/₋' || btn === '%'
                          ? handleSpecial(btn)
                          : handleButtonClick(btn)
                    }
                    className={styles.button}
                    aria-label={btn === '⁺/₋' ? '토글 기호' : btn}
                  >
                    {btn}
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.group}>
              {operatorButtons.map((btn) => (
                <div className={`${styles.button} ${styles.operator}`} key={btn}>
                  <button onClick={() => (btn === '=' ? handleEvaluate() : handleButtonClick(btn))}>{btn}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
