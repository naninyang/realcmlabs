import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from '@/styles/Converters.module.sass';
import { Bullet } from '../Svgs';
import Anchor from '../Anchor';

type Unit = '초' | '분' | '시간' | '일' | '주' | '개월' | '년';

const units: Unit[] = ['초', '분', '시간', '일', '주', '개월', '년'];

const unitInSeconds: Record<Unit, number> = {
  초: 1,
  분: 60,
  시간: 3600,
  일: 86400,
  주: 604800,
  개월: 2592000,
  년: 31536000,
};

const breakdownMap: Record<Unit, Unit[][]> = {
  초: [
    ['분', '초'],
    ['시간', '분', '초'],
    ['일', '시간', '분', '초'],
    ['주', '일', '시간', '분', '초'],
    ['개월', '주', '일', '시간', '분', '초'],
    ['년', '개월', '주', '일', '시간', '분', '초'],
  ],
  분: [
    ['시간', '분'],
    ['일', '시간', '분'],
    ['주', '일', '시간', '분'],
    ['개월', '주', '일', '시간', '분'],
    ['년', '개월', '주', '일', '시간', '분'],
  ],
  시간: [
    ['일', '시간'],
    ['주', '일', '시간'],
    ['개월', '주', '일', '시간'],
    ['년', '개월', '주', '일', '시간'],
  ],
  일: [
    ['주', '일'],
    ['개월', '주', '일'],
    ['년', '개월', '주', '일'],
  ],
  주: [
    ['개월', '주'],
    ['년', '개월', '주'],
  ],
  개월: [['년', '개월']],
  년: [['년']],
};

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({
    query: `(max-width: ${991 / 16}rem)`,
  });
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);
  return isMobile;
}

export default function TimeBreakdown() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState<Unit>('초');
  const [higherResults, setHigherResults] = useState<string[][]>([]);
  const [lowerResults, setLowerResults] = useState<string[]>([]);
  const isMobile = useMobile();

  const handleConvert = () => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) return;

    const totalSeconds = num * unitInSeconds[from];
    const stages = breakdownMap[from];
    const newResults: string[][] = [];
    let prevResult = '';

    for (const stage of stages) {
      let remaining = totalSeconds;
      const line: string[] = [];

      for (const unit of stage) {
        const unitSeconds = unitInSeconds[unit];
        const count = Math.floor(remaining / unitSeconds);
        if (count > 0) {
          line.push(`${count} ${unit}`);
          remaining %= unitSeconds;
        }
      }

      const joined = line.join(' ');
      if (joined && joined !== prevResult) {
        newResults.push(line);
        prevResult = joined;
      }
    }

    setHigherResults(newResults);

    const fromIndex = units.indexOf(from);
    const lowerUnits = units.slice(0, fromIndex);
    const lowerList = lowerUnits.map((unit) => {
      const converted = totalSeconds / unitInSeconds[unit];
      const rounded = Number.isInteger(converted) ? converted : converted.toFixed(2);
      return `${rounded} ${unit}`;
    });

    setLowerResults(lowerList);
  };

  return (
    <section className={`${styles.section} ${styles['section-full']}`}>
      <div className={styles.module}>
        <h2>시간 계산기</h2>
        <div className={styles.form}>
          <div className={styles.fieldset}>
            <div className={styles.group}>
              <input
                type="number"
                value={value}
                min="0"
                onChange={(e) => setValue(e.target.value)}
                placeholder="값 입력"
              />
              <select value={from} onChange={(e) => setFrom(e.target.value as Unit)}>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.submit}>
              <button type="button" onClick={handleConvert}>
                <span>계산</span>
              </button>
            </div>
          </div>
        </div>
        {(higherResults.length > 0 || lowerResults.length > 0) && (
          <div
            className={`${styles.result} ${isMobile ? styles._coffee : styles._latte} ${higherResults.length > 0 && lowerResults.length > 0 ? styles._both : ''}`}
          >
            {isMobile ? (
              <ul>
                {lowerResults.map((line, i) => (
                  <li key={i}>
                    <Bullet />
                    <span>{line}</span>
                  </li>
                ))}
                {higherResults.map((line, i) => (
                  <li key={i}>
                    <Bullet />
                    <span>{line.join(' ')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                {lowerResults.length > 0 && (
                  <ul>
                    {lowerResults.map((line, i) => (
                      <li key={i}>
                        <Bullet />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {higherResults.length > 0 && (
                  <ul>
                    {higherResults.map((line, i) => (
                      <li key={i}>
                        <Bullet />
                        <span>{line.join(' ')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
        <p className={styles.announcement}>
          * 날짜 계산기는 <Anchor href="https://timelab.dev1stud.io">여기</Anchor>를 이용해 주세요
        </p>
      </div>
    </section>
  );
}
