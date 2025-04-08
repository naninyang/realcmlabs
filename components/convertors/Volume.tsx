import { useState } from 'react';
import { ErrorIcon, RightArrow } from '../Svgs';
import styles from '@/styles/Converters.module.sass';

const unitGroups = {
  '국제 단위 (SI 단위)': ['L', 'mL', 'm³', 'cm³'],
  '영미권 단위': ['gal', 'pt', 'cup'],
};

const conversionRates: Record<string, Record<string, number>> = {
  L: { mL: 1000, 'm³': 0.001, 'cm³': 1000, gal: 0.264172, pt: 2.11338, cup: 4.22675, L: 1 },
  mL: { L: 0.001, 'm³': 1e-6, 'cm³': 1, gal: 0.000264172, pt: 0.00211338, cup: 0.00422675, mL: 1 },
  'm³': { L: 1000, mL: 1e6, 'cm³': 1e6, gal: 264.172, pt: 2113.38, cup: 4226.75, 'm³': 1 },
  'cm³': { L: 0.001, mL: 1, 'm³': 1e-6, gal: 0.000264172, pt: 0.00211338, cup: 0.00422675, 'cm³': 1 },
  gal: { L: 3.78541, mL: 3785.41, 'm³': 0.00378541, 'cm³': 3785.41, pt: 8, cup: 16, gal: 1 },
  pt: { L: 0.473176, mL: 473.176, 'm³': 0.000473176, 'cm³': 473.176, gal: 0.125, cup: 2, pt: 1 },
  cup: { L: 0.236588, mL: 236.588, 'm³': 0.000236588, 'cm³': 236.588, gal: 0.0625, pt: 0.5, cup: 1 },
};

export default function VolumeConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('L');
  const [toUnit, setToUnit] = useState('mL');
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
        <h2>부피 변환</h2>
        <form onScroll={handleConvert}>
          <fieldset>
            <legend>부피변환 폼</legend>
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
