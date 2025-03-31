import { useState } from 'react';
import { ErrorIcon, RightArrow } from '../Svgs';
import styles from '@/styles/Converters.module.sass';

const unitGroups = {
  저용량: ['bit', 'B'],
  중용량: ['KB', 'MB', 'GB', 'TB'],
  대용량: ['PB', 'EB', 'ZB'],
};

const conversionRates: Record<string, Record<string, number>> = {
  bit: {
    B: 1 / 8,
    bit: 1,
  },
  B: {
    bit: 8,
    KB: 1 / 1024,
    MB: 1 / 1024 ** 2,
    GB: 1 / 1024 ** 3,
    TB: 1 / 1024 ** 4,
    PB: 1 / 1024 ** 5,
    EB: 1 / 1024 ** 6,
    ZB: 1 / 1024 ** 7,
    B: 1,
  },
  KB: {
    B: 1024,
    MB: 1 / 1024,
    GB: 1 / 1024 ** 2,
    TB: 1 / 1024 ** 3,
    PB: 1 / 1024 ** 4,
    EB: 1 / 1024 ** 5,
    ZB: 1 / 1024 ** 6,
    KB: 1,
  },
  MB: {
    KB: 1024,
    B: 1024 ** 2,
    GB: 1 / 1024,
    TB: 1 / 1024 ** 2,
    PB: 1 / 1024 ** 3,
    EB: 1 / 1024 ** 4,
    ZB: 1 / 1024 ** 5,
    MB: 1,
  },
  GB: {
    MB: 1024,
    KB: 1024 ** 2,
    B: 1024 ** 3,
    TB: 1 / 1024,
    PB: 1 / 1024 ** 2,
    EB: 1 / 1024 ** 3,
    ZB: 1 / 1024 ** 4,
    GB: 1,
  },
  TB: {
    GB: 1024,
    MB: 1024 ** 2,
    KB: 1024 ** 3,
    B: 1024 ** 4,
    PB: 1 / 1024,
    EB: 1 / 1024 ** 2,
    ZB: 1 / 1024 ** 3,
    TB: 1,
  },
  PB: {
    TB: 1024,
    GB: 1024 ** 2,
    MB: 1024 ** 3,
    KB: 1024 ** 4,
    B: 1024 ** 5,
    EB: 1 / 1024,
    ZB: 1 / 1024 ** 2,
    PB: 1,
  },
  EB: {
    PB: 1024,
    TB: 1024 ** 2,
    GB: 1024 ** 3,
    MB: 1024 ** 4,
    KB: 1024 ** 5,
    B: 1024 ** 6,
    ZB: 1 / 1024,
    EB: 1,
  },
  ZB: {
    EB: 1024,
    PB: 1024 ** 2,
    TB: 1024 ** 3,
    GB: 1024 ** 4,
    MB: 1024 ** 5,
    KB: 1024 ** 6,
    B: 1024 ** 7,
    ZB: 1,
  },
};

export default function StorageConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('B');
  const [toUnit, setToUnit] = useState('KB');
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
    const manufacturerValue = value * ((conversionRates[fromUnit][toUnit] * 1000) / 1024);

    setResult(
      `<span><strong>${convertedValue} ${toUnit}</strong> 입니다.</span> <span>* 하드디스크 제조사 기준으로는 ${manufacturerValue} ${toUnit}일 수 있습니다.</span>`,
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.module}>
        <h2>데이터 크기 변환</h2>
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
          <div className={styles.result} role="status" aria-live="polite" aria-atomic="true">
            {result && <p dangerouslySetInnerHTML={{ __html: result }}></p>}
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
