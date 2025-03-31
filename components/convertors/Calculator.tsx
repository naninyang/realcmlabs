import { useEffect, useRef, useState } from 'react';
import { sin, cos, tan, sinh, cosh, tanh, pi, e as E } from 'mathjs';
import { evaluateExpression } from '@/lib/evaluate';
import RippleButton from '../RippleButton';
import styles from '@/styles/Calculator.module.sass';

export default function Calculator() {
  const [input, setInput] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const displayRef = useRef<HTMLSpanElement | null>(null);
  const calculatorRef = useRef<HTMLElement | null>(null);

  const handleButtonClick = (value: string) => {
    setInput((prev) => {
      if (prev === '0') return value;
      if (prev === '-0') return '−' + value;
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
    if (type === '⁺⁄₋') {
      setInput((prev) => (prev.startsWith('−') ? prev.slice(1) : '−' + prev));
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
    if (btn === '2ⁿᵈ') return;
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;

    if (key === 'Escape') return handleClear();

    if (key === 'Backspace') {
      e.preventDefault();
      return handleBackspace();
    }

    if (key === 'Enter' || key === '=') return handleEvaluate();

    if (/^[0-9%()\.]$/.test(key)) return handleButtonClick(key);

    if (key === '/') return handleButtonClick('÷');
    if (key === '*') return handleButtonClick('×');
    if (key === '-') return handleButtonClick('−');
    if (key === '+') return handleButtonClick('+');

    if (key === '^') return handleScientific('xʸ');
    if (key === '!') return handleAdvanced('x!');
    if (key.toLowerCase() === 'p') return handleInsertConstant('π');
  };

  const scientificButtons = [
    '(',
    ')',
    'mc',
    'm+',
    'm-',
    'mr',
    '2ⁿᵈ',
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

  const ariaLabelsScientific: Record<string, string> = {
    '(': '괄호 열기',
    ')': '괄호 닫기',
    mc: '메모리 비우기',
    'm+': '표시된 값을 메모리에 더하기',
    'm-': '메모리에서 표시된 값 빼기',
    mr: '메모리에 저장된 값 재호출',
    '2ⁿᵈ': '일부 버튼의 대체 함수 표시',
    'x²': '특정 값의 제곱 계산',
    'x³': '특정 값의 세제곱 계산',
    xʸ: '첫 번째 값의 두 번째 값 거듭제곱 계산',
    '𝑒ˣ': '자연상수 e의 거듭제곱 계산',
    '10ˣ': '10의 거듭제곱 계산',
    ln: '자연로그 계산',
    'log₁₀': '상용로그 계산',
    sin: '사인 값 계산',
    cos: '코사인 값 계산',
    tan: '탄젠트 값 계산',
    sinh: '쌍곡 사인 계산',
    cosh: '쌍곡 코사인 계산',
    tanh: '쌍곡 탄젠트 계산',
    π: '원주율 파이 입력',
    '𝑒': '자연상수 e 입력',
    EE: '지수 입력 형식',
    Rand: '무작위 난수 입력',
    'x!': '팩토리얼 계산',
    '√x': '제곱근 계산',
    '³√x': '세제곱근 계산',
    '¹⁄ₓ': '역수 계산',
    Deg: '각도 단위를 도로 변경',
    Rad: '각도 단위를 라디안으로 변경',
  };

  const ariaLabelsBase: Record<string, string> = {
    AC: '모두 지우기',
    '⁺⁄₋': '특정 값의 부호 변경',
    '⌫': '백스페이스',
  };

  const ariaLabelsOperator: Record<string, string> = {
    '÷': '나누기',
    '×': '곱하기',
    '−': '빼기',
    '+': '더하기',
    '=': '동호',
  };

  const handleBackspace = () => {
    const replacements = ['×10^', '^', 'log₁₀', 'ln', '𝑒ˣ', '10ˣ', 'xʸ', '¹⁄ₓ', '√x', '³√x', 'ʸ√x'];

    for (const token of replacements) {
      if (input.endsWith(token)) {
        return setInput((prev) => prev.slice(0, -token.length));
      }
    }

    if (input.length <= 1) {
      setInput('0');
    } else {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  const baseButtons = ['AC', '⁺⁄₋', '%', '7', '8', '9', '4', '5', '6', '1', '2', '3', '⌫', '0', '.'];
  const operatorButtons = ['÷', '×', '−', '+', '='];
  const renderButtons = [...scientificButtons, angleMode === 'deg' ? 'Rad' : 'Deg'];

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [input]);

  return (
    <section className={styles.calculator} tabIndex={0} onKeyDown={handleKeyDown} ref={calculatorRef}>
      <div className={styles.module}>
        <h2>공학 계산기</h2>
        <div className={styles.notice}>
          <p>* AC 버튼을 누르기 전까지는 절대 리셋되지 않습니다.</p>
          <p>* AC 버튼을 누르더라도 Rad/Deg 상태는 초기화되지 않습니다.</p>
        </div>
        <div className={styles.usage}>
          <dl>
            <div>
              <dt>AC</dt>
              <dd>Esc 키</dd>
            </div>
            <div>
              <dt>⌫</dt>
              <dd>Backspace 키</dd>
            </div>
            <div>
              <dt>=</dt>
              <dd>= 또는 엔터(리턴) 키</dd>
            </div>
            <div>
              <dt>÷</dt>
              <dd>/ 키</dd>
            </div>
            <div>
              <dt>×</dt>
              <dd>* 키</dd>
            </div>
            <div>
              <dt>xʸ</dt>
              <dd>^ 키</dd>
            </div>
            <div>
              <dt>x!</dt>
              <dd>! 키</dd>
            </div>
            <div>
              <dt>π</dt>
              <dd>p 키</dd>
            </div>
            <div>
              <dt>숫자, 점, +, -</dt>
              <dd>그대로 사용</dd>
            </div>
          </dl>
          <div className={styles.notice}>
            <p>* 언급되지 않은 버튼은 직접 버튼을 눌러야 합니다.</p>
            <p>* 키보드로 연산을 하기 위해서는 계산기 아무 영역이나 한번 클릭해 주셔야 합니다.</p>
            <p>* 결과 나오는 영역을 누르면 결과값이 클립보드에 저장됩니다.</p>
          </div>
        </div>
        <div
          className={styles.display}
          role="button"
          aria-live="polite"
          aria-atomic="true"
          onClick={() => {
            navigator.clipboard.writeText(input);
            alert('계산된 결과값이 클립보드에 저장되었습니다.');
          }}
        >
          {angleMode === 'rad' && (
            <span aria-label="라디안" title="라디안">
              Rad
            </span>
          )}
          <strong ref={displayRef}>{input}</strong>
        </div>
        <div className={styles.calc}>
          <div className={`${styles.group} ${styles.scientific}`}>
            {renderButtons.map((btn) => (
              <div className={styles.button} key={btn}>
                <RippleButton
                  onClick={() => {
                    if (btn === 'Rad') return setAngleMode('rad');
                    if (btn === 'Deg') return setAngleMode('deg');

                    if (['mc', 'm+', 'm-', 'mr'].includes(btn)) return handleMemory(btn);
                    if (['xʸ', '𝑒ˣ', '10ˣ', 'ln', 'log₁₀'].includes(btn)) return handleScientific(btn);
                    if (['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh'].includes(btn)) return handleTrig(btn);
                    if (['π', '𝑒'].includes(btn)) return handleInsertConstant(btn);
                    if (['x²', 'x³', '√x', '³√x', '¹⁄ₓ'].includes(btn)) return handlePowerAndRoots(btn);
                    if (['x!', 'Rand', 'EE', '2ⁿᵈ'].includes(btn)) return handleAdvanced(btn);

                    return handleButtonClick(btn);
                  }}
                  className={`${styles.button} ${btn === '𝑒' || btn === '𝑒ˣ' || btn === '¹⁄ₓ' ? styles.symbol : ''}`}
                  ariaLabel={ariaLabelsScientific[btn] ?? btn}
                  title={ariaLabelsScientific[btn] ?? btn}
                >
                  {btn}
                </RippleButton>
              </div>
            ))}
          </div>
          <div className={styles.groups}>
            <div className={styles.group}>
              {baseButtons.map((btn) => (
                <div className={styles.button} key={btn}>
                  <RippleButton
                    onClick={() =>
                      btn === 'AC'
                        ? handleClear()
                        : btn === '⌫'
                          ? handleBackspace()
                          : btn === '⁺⁄₋' || btn === '%'
                            ? handleSpecial(btn)
                            : handleButtonClick(btn)
                    }
                    className={`${styles.button} ${btn === '⌫' ? styles.backspace : ''}`}
                    aria-label={ariaLabelsBase[btn] ?? btn}
                    title={ariaLabelsBase[btn] ?? btn}
                  >
                    {btn}
                  </RippleButton>
                </div>
              ))}
            </div>
            <div className={styles.group}>
              {operatorButtons.map((btn) => (
                <div className={`${styles.button} ${styles.operator}`} key={btn}>
                  <RippleButton
                    onClick={() => {
                      const symbol = btn === '−' ? '-' : btn;
                      return symbol === '=' ? handleEvaluate() : handleButtonClick(symbol);
                    }}
                    aria-label={ariaLabelsOperator[btn] ?? btn}
                  >
                    {btn}
                  </RippleButton>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
