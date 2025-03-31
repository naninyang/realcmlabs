import { useState } from 'react';
import { ErrorIcon, RightArrow } from '../Svgs';
import styles from '@/styles/Converters.module.sass';

const unitGroups = {
  '일반 단위': ['평', '㎡'],
  '영미권 단위': ['ft²', 'yd²', 'chain²', 'acre'],
};

const conversionRates: Record<string, Record<string, number>> = {
  평: { '㎡': 3.3058, 평: 1 },
  '㎡': { 평: 1 / 3.3058, '㎡': 1 },
  'ft²': { 'yd²': 1 / 9, 'chain²': 1 / 4356, acre: 1 / 43560, 'ft²': 1 },
  'yd²': { 'ft²': 9, 'chain²': 1 / 484, acre: 1 / 4840, 'yd²': 1 },
  'chain²': { 'ft²': 4356, 'yd²': 484, acre: 1 / 10, 'chain²': 1 },
  acre: { 'ft²': 43560, 'yd²': 4840, 'chain²': 10, acre: 1 },
};

export default function AreaConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('㎡');
  const [toUnit, setToUnit] = useState('평');
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
    setResult(`${convertedValue.toFixed(4)} ${toUnit}`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.module}>
        <h2>면적 변환</h2>
        <div className={styles.form}>
          <div className={styles.fieldset}>
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
                    {units
                      .filter(
                        (unit) =>
                          !(fromUnit === '평' && group === '영미권 단위') &&
                          !(unit === '평' && unitGroups['영미권 단위'].includes(fromUnit)),
                      )
                      .map((unit) => (
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
