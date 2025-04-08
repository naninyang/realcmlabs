import { useState } from 'react';
import { ErrorIcon, RightArrow } from '../Svgs';
import styles from '@/styles/Converters.module.sass';

const speedUnits = ['m/s', 'km/h', 'mph', 'knot'];

const conversionRates: Record<string, Record<string, number>> = {
  'm/s': {
    'km/h': 3.6,
    mph: 2.23694,
    knot: 1.94384,
    'm/s': 1,
  },
  'km/h': {
    'm/s': 0.277778,
    mph: 0.621371,
    knot: 0.539957,
    'km/h': 1,
  },
  mph: {
    'm/s': 0.44704,
    'km/h': 1.60934,
    knot: 0.868976,
    mph: 1,
  },
  knot: {
    'm/s': 0.514444,
    'km/h': 1.852,
    mph: 1.15078,
    knot: 1,
  },
};

export default function SpeedConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m/s');
  const [toUnit, setToUnit] = useState('km/h');
  const [result, setResult] = useState('');
  const [warning, setWarning] = useState('');

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(inputValue);
    if (!inputValue.trim() || isNaN(value)) {
      setResult('');
      setWarning('올바른 숫자를 입력하세요.');
      return;
    }

    if (!conversionRates[fromUnit] || !conversionRates[fromUnit][toUnit]) {
      setResult('');
      setWarning('변환할 수 없는 단위입니다.');
      return;
    }

    const convertedValue = value * conversionRates[fromUnit][toUnit];
    const displayValue =
      Math.abs(convertedValue) < 0.0001 || Math.abs(convertedValue) > 1e9
        ? convertedValue.toExponential(5)
        : convertedValue.toString();

    setResult(`${displayValue} ${toUnit}`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.module}>
        <h2>속도 변환</h2>
        <form onSubmit={handleConvert}>
          <fieldset>
            <legend>속도변환 폼</legend>
            <div className={styles.group}>
              <input
                type="text"
                maxLength={16}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="값 입력"
              />
            </div>
            <div className={styles.group}>
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                {speedUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <strong>
                <RightArrow />
                <span>에서</span>
              </strong>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                {speedUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <strong>
                <span>으(로)</span>
              </strong>
            </div>
            <div className={styles.submit}>
              <button type="submit">
                <span>변환</span>
              </button>
            </div>
          </fieldset>
        </form>
        {(result || warning) && (
          <div className={styles.result} role="status" aria-live="polite" aria-atomic="true">
            {result && (
              <p>
                <span>
                  <strong>{result}</strong> 입니다.
                </span>
              </p>
            )}
            {warning && (
              <p className={styles.danger}>
                <ErrorIcon />
                <span>{warning}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
