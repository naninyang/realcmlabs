import { useState } from 'react';
import { Checked, Unchecked } from '../Svgs';
import styles from '@/styles/Converters.module.sass';

export default function PowerCalculator() {
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [power, setPower] = useState<string>('');

  const [voltageChecked, setVoltageChecked] = useState(false);
  const [currentChecked, setCurrentChecked] = useState(false);
  const [powerChecked, setPowerChecked] = useState(false);

  const [calculatedVoltage, setCalculatedVoltage] = useState<string | null>(null);
  const [calculatedCurrent, setCalculatedCurrent] = useState<string | null>(null);
  const [calculatedPower, setCalculatedPower] = useState<string | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  const getCheckedCount = () => {
    return [voltageChecked, currentChecked, powerChecked].filter(Boolean).length;
  };

  const handleCheckboxChange = (type: 'V' | 'A' | 'W') => {
    if (type === 'V') {
      setVoltageChecked(!voltageChecked);
      if (voltageChecked) setVoltage('');
    } else if (type === 'A') {
      setCurrentChecked(!currentChecked);
      if (currentChecked) setCurrent('');
    } else if (type === 'W') {
      setPowerChecked(!powerChecked);
      if (powerChecked) setPower('');
    }
  };

  const handleDisabled = () => {
    alert('3개의 항목 중 2개의 항목만 선택하실 수 있습니다.');
  };

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    const V = voltageChecked ? parseFloat(voltage) || null : null;
    const A = currentChecked ? parseFloat(current) || null : null;
    const W = powerChecked ? parseFloat(power) || null : null;

    let newVoltage: string | null = null;
    let newCurrent: string | null = null;
    let newPower: string | null = null;

    if (V !== null && A !== null) {
      newPower = (V * A).toFixed(2);
    } else if (W !== null && A !== null) {
      newVoltage = (W / A).toFixed(2);
    } else if (W !== null && V !== null) {
      newCurrent = (W / V).toFixed(2);
    }

    setCalculatedVoltage(newVoltage);
    setCalculatedCurrent(newCurrent);
    setCalculatedPower(newPower);
    setIsCalculated(true);
  };

  const checkedCount = getCheckedCount();
  const disableVoltage = !voltageChecked && checkedCount >= 2;
  const disableCurrent = !currentChecked && checkedCount >= 2;
  const disablePower = !powerChecked && checkedCount >= 2;

  return (
    <section className={`${styles.section} ${styles['section-full']}`}>
      <div className={styles.module}>
        <h2>충전기 계산기</h2>
        <form onSubmit={handleConvert}>
          <fieldset>
            <legend>충전기 계산 폼</legend>
            <div className={styles.groups}>
              <div className={styles.group}>
                <div className={`${styles.checkbox} ${disableVoltage ? styles.disabled : ''}`}>
                  <input
                    type="checkbox"
                    id="voltage"
                    checked={voltageChecked}
                    onChange={() => handleCheckboxChange('V')}
                    disabled={disableVoltage}
                  />
                  <div className={voltageChecked ? styles.checked : styles.unchecked}>
                    {voltageChecked ? <Checked /> : <Unchecked />}
                  </div>
                  <label htmlFor="voltage">전압 (V)</label>
                  {disableVoltage && (
                    <button type="button" onClick={handleDisabled}>
                      <span>경고 보기</span>
                    </button>
                  )}
                </div>
                <div className={styles.value}>
                  <input
                    type="number"
                    placeholder="값 입력"
                    value={voltage}
                    onChange={(e) => setVoltage(e.target.value)}
                    disabled={!voltageChecked}
                  />
                </div>
              </div>
              <div className={styles.group}>
                <div className={`${styles.checkbox} ${disableCurrent ? styles.disabled : ''}`}>
                  <input
                    type="checkbox"
                    id="current"
                    checked={currentChecked}
                    onChange={() => handleCheckboxChange('A')}
                    disabled={disableCurrent}
                  />
                  <div className={currentChecked ? styles.checked : styles.unchecked}>
                    {currentChecked ? <Checked /> : <Unchecked />}
                  </div>
                  <label htmlFor="current">전류 (A)</label>
                  {disableCurrent && (
                    <button type="button" onClick={handleDisabled}>
                      <span>경고 보기</span>
                    </button>
                  )}
                </div>
                <div className={styles.value}>
                  <input
                    type="number"
                    placeholder="값 입력"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    disabled={!currentChecked}
                  />
                </div>
              </div>
              <div className={styles.group}>
                <div className={`${styles.checkbox} ${disablePower ? styles.disabled : ''}`}>
                  <input
                    type="checkbox"
                    id="power"
                    checked={powerChecked}
                    onChange={() => handleCheckboxChange('W')}
                    disabled={disablePower}
                  />
                  <div className={powerChecked ? styles.checked : styles.unchecked}>
                    {powerChecked ? <Checked /> : <Unchecked />}
                  </div>
                  <label htmlFor="power">전력 (W)</label>
                  {disablePower && (
                    <button type="button" onClick={handleDisabled}>
                      <span>경고 보기</span>
                    </button>
                  )}
                </div>
                <div className={styles.value}>
                  <input
                    type="number"
                    placeholder="값 입력"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    disabled={!powerChecked}
                  />
                </div>
              </div>
            </div>
            <div className={styles.submit}>
              <button type="submit">
                <span>계산</span>
              </button>
            </div>
          </fieldset>
        </form>

        {isCalculated && (
          <div className={styles.result} role="status" aria-live="polite" aria-atomic="true">
            <dl>
              {calculatedPower && (
                <div>
                  <dt>전력 (W)</dt>
                  <dd>{calculatedPower} W</dd>
                </div>
              )}
              {calculatedVoltage && (
                <div>
                  <dt>전압 (V)</dt>
                  <dd>{calculatedVoltage} V</dd>
                </div>
              )}
              {calculatedCurrent && (
                <div>
                  <dt>전류 (A)</dt>
                  <dd>{calculatedCurrent} A</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
