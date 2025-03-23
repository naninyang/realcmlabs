import { useState } from 'react';
import { ErrorIcon, RightArrow } from '../Svgs';
import styles from '@/styles/Converters.module.sass';

const unitGroups = {
  '국제 단위 (SI 단위)': ['m', 'cm', 'mm', 'km', 'μm', 'nm'],
  '영미권 단위': ['in', 'ft', 'yd', 'mi', 'mile'],
  '특수 단위': ['nautical mile', 'parsec', 'light-year', 'AU'],
};

const conversionRates: Record<string, Record<string, number>> = {
  m: {
    cm: 100,
    mm: 1000,
    km: 0.001,
    μm: 1e6,
    nm: 1e9,
    in: 39.3701,
    ft: 3.28084,
    yd: 1.09361,
    mi: 0.000621371,
    mile: 0.000621371,
    'nautical mile': 0.000539957,
    parsec: 3.24078e-17,
    'light-year': 1.057e-16,
    AU: 6.68459e-12,
    m: 1,
  },
  km: {
    m: 1000,
    cm: 1e5,
    mm: 1e6,
    μm: 1e9,
    nm: 1e12,
    in: 39370.1,
    ft: 3280.84,
    yd: 1093.61,
    mi: 0.621371,
    mile: 0.621371,
    'nautical mile': 0.539957,
    parsec: 3.24078e-14,
    'light-year': 1.057e-13,
    AU: 6.68459e-9,
    km: 1,
  },
  mi: {
    m: 1609.34,
    km: 1.60934,
    cm: 160934,
    mm: 1.609e6,
    in: 63360,
    ft: 5280,
    yd: 1760,
    mile: 1,
    'nautical mile': 0.868976,
    parsec: 5.2155e-14,
    'light-year': 1.7011e-13,
    AU: 1.0758e-8,
    mi: 1,
  },
  mile: {
    m: 1609.34,
    km: 1.60934,
    cm: 160934,
    mm: 1.609e6,
    in: 63360,
    ft: 5280,
    yd: 1760,
    mi: 1,
    'nautical mile': 0.868976,
    parsec: 5.2155e-14,
    'light-year': 1.7011e-13,
    AU: 1.0758e-8,
    mile: 1,
  },
};

export default function LengthConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [result, setResult] = useState('');
  const [warning, setWarning] = useState('');

  const handleConvert = () => {
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

    if (Math.abs(convertedValue) < 1e-15 || Math.abs(convertedValue) > 1e15) {
      setWarning('변환된 값이 너무 작거나 너무 커서 정확한 사용에 유의해야 합니다.');
    } else {
      setWarning('');
    }

    const displayValue =
      Math.abs(convertedValue) < 0.0001 || Math.abs(convertedValue) > 1e9
        ? convertedValue.toExponential(5)
        : convertedValue.toString();

    setResult(`${displayValue} ${toUnit}`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.module}>
        <h2>길이 변환</h2>
        <div className={styles.form}>
          <div className={styles.fieldset}>
            <div className={styles.group}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="값 입력"
              />
            </div>
            <div className={styles.group}>
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                {Object.entries(unitGroups).map(([group, units]) => (
                  <optgroup key={group} label={group}>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <strong>
                <RightArrow />
                <span>에서</span>
              </strong>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                {Object.entries(unitGroups).map(([group, units]) => (
                  <optgroup key={group} label={group}>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <strong>
                <span>으(로)</span>
              </strong>
            </div>
            <div className={styles.submit}>
              <button type="button" onClick={handleConvert}>
                <span>변환</span>
              </button>
            </div>
          </div>
        </div>
        {(result || warning) && (
          <div className={styles.result}>
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
