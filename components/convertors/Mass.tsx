import { useState } from 'react';
import { ErrorIcon, RightArrow } from '../Svgs';
import RippleButton from '../RippleButton';
import styles from '@/styles/Converters.module.sass';

const unitGroups = {
  '국제 단위 (SI 단위)': ['kg', 'g', 'mg', 'μg', 'ton', 'carat'],
  '영미권 단위': ['oz', 'lb', 'st', 'long ton', 'short ton'],
};

const conversionRates: Record<string, Record<string, number>> = {
  kg: {
    g: 1000,
    mg: 1_000_000,
    μg: 1_000_000_000,
    ton: 0.001,
    carat: 5000,
    oz: 35.27396,
    lb: 2.20462,
    st: 0.15747,
    'long ton': 0.000984,
    'short ton': 0.001102,
    kg: 1,
  },
  g: {
    kg: 0.001,
    mg: 1000,
    μg: 1_000_000,
    ton: 1e-6,
    carat: 5,
    oz: 0.03527396,
    lb: 0.00220462,
    st: 0.00015747,
    'long ton': 9.8421e-7,
    'short ton': 1.1023e-6,
    g: 1,
  },
};

export default function MassConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('g');
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
        <h2>질량 변환</h2>
        <form onSubmit={handleConvert}>
          <fieldset>
            <legend>질량변환 폼</legend>
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
              <RippleButton type="submit">변환</RippleButton>
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
