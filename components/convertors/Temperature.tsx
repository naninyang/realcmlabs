import { useState } from 'react';
import { ErrorIcon, RightArrow } from '../Svgs';
import styles from '@/styles/Converters.module.sass';

const temperatureUnits = ['°C', '°F', 'K'];

const convertTemperature = (value: number, fromUnit: string, toUnit: string): number => {
  if (fromUnit === toUnit) return value;

  const celsius =
    fromUnit === '°C' ? value : fromUnit === '°F' ? (value - 32) * (5 / 9) : fromUnit === 'K' ? value - 273.15 : NaN;

  if (isNaN(celsius)) {
    throw new Error('Invalid fromUnit');
  }

  return toUnit === '°C' ? celsius : toUnit === '°F' ? celsius * (9 / 5) + 32 : toUnit === 'K' ? celsius + 273.15 : NaN;
};

export default function TemperatureConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('°C');
  const [toUnit, setToUnit] = useState('°F');
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

    const convertedValue = convertTemperature(value, fromUnit, toUnit);

    setWarning(
      convertedValue > 1e6 || convertedValue < -273.15 ? '변환된 값이 비정상적으로 높거나 절대영도 이하입니다.' : '',
    );
    setResult(`${convertedValue.toFixed(2)} ${toUnit}`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.module}>
        <h2>온도 변환</h2>
        <form onSubmit={handleConvert}>
          <fieldset>
            <legend>온도변환 폼</legend>
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
                {temperatureUnits.map((unit) => (
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
                {temperatureUnits.map((unit) => (
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
