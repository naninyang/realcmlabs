import { useState } from 'react';
import styles from '@/styles/Converters.module.sass';

const nativeUnits = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
const nativeTens = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];

const getNativeKoreanNumber = (num: number): string => {
  if (num < 1 || num > 199) return '1부터 199 사이의 숫자만 지원';
  if (num === 100) return '백';
  if (num > 100) return '백' + getNativeKoreanNumber(num - 100);

  const tens = Math.floor(num / 10);
  const units = num % 10;

  return nativeTens[tens] + nativeUnits[units];
};

const sinoUnits = ['일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

const getSinoNumber = (num: number): string => {
  if (num < 1 || num > 199) return '1부터 199 사이의 숫자만 지원';
  const hundreds = Math.floor(num / 100);
  const tens = Math.floor((num % 100) / 10);
  const ones = num % 10;

  let result = '';
  if (hundreds > 0) result += '백';
  if (tens > 0) result += (tens === 1 ? '' : sinoUnits[tens - 1]) + '십';
  if (ones > 0) result += sinoUnits[ones - 1];
  return result;
};

const getDateWord = (n: number): string => {
  const dateWords = [
    '',
    '하루',
    '이틀',
    '사흘',
    '나흘',
    '닷새',
    '엿새',
    '이레',
    '여드레',
    '아흐레',
    '열흘',
    '열하루',
    '열이틀',
    '열사흘',
    '열나흘',
    '열닷새',
    '열엿새',
    '열이레',
    '열여드레',
    '열아흐레',
    '스무날',
    '세이레',
  ];

  if (n <= 21) return dateWords[n];
  return getSinoNumber(n) + '일';
};

const getShortNative = (num: number): string => {
  return getNativeKoreanNumber(num)
    .replace(/하나$/, '한')
    .replace(/둘$/, '두')
    .replace(/셋$/, '세')
    .replace(/넷$/, '네')
    .replace(/스물$/, '스무');
};

const getUnitWord = (num: number): string => getShortNative(num) + '개';
const getAgeWord = (num: number): string => getShortNative(num) + '살';
const getHourWord = (num: number): string => getShortNative(num) + '시';

const getMonthWord = (num: number): string => {
  if (num === 1) return '한달';
  if (num === 2) return '두달';
  if (num === 3) return '석달';
  if (num === 4) return '넉달';
  return getShortNative(num) + '달';
};

const getOrderWord = (num: number): string => {
  if (num < 1 || num > 199) return '(1~199만 지원)';

  const base = getNativeKoreanNumber(num);
  const lastDigit = num % 10;

  if (num <= 99) {
    if ([1, 2, 3, 4].includes(lastDigit)) {
      const prefix = base.replace(/하나$/, '').replace(/둘$/, '').replace(/셋$/, '').replace(/넷$/, '');

      const suffix = {
        1: '첫째',
        2: '둘째',
        3: '셋째',
        4: '넷째',
      }[lastDigit];

      return prefix + suffix;
    }

    return base + '째';
  }

  return getShortNative(num) + '번째';
};

export default function Counter() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleClick = () => {
    const num = parseInt(input, 10);
    if (Number.isNaN(num) || num < 1 || num > 199) {
      setResults(['⚠️ 1부터 199 사이의 숫자만 입력해주세요.']);
      return;
    }

    setResults([
      `<dt>🔢 고유어 수</dt><dd>${getNativeKoreanNumber(num)}</dd>`,
      `<dt>🔢 한자어 수</dt><dd>${getSinoNumber(num)}</dd>`,
      `<dt>📦 단위 결합</dt><dd>${getUnitWord(num)}</dd>`,
      `<dt>🗓️ 날짜 경과</dt><dd>${getDateWord(num)}</dd>`,
      `<dt>➡️ 순서형</dt><dd>${getOrderWord(num)}</dd>`,
      `<dt>👶 나이형</dt><dd>${getAgeWord(num)}</dd>`,
      `<dt>🕒 시간형</dt><dd>${getHourWord(num)}</dd>`,
      `<dt>📅 월 수형</dt><dd>${getMonthWord(num)}</dd>`,
    ]);
  };

  return (
    <section className={`${styles.section} ${styles['section-full']}`}>
      <div className={styles.module}>
        <h2>숫자 세기</h2>
        <div className={styles.form}>
          <div className={styles.fieldset}>
            <div className={styles.group}>
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                min={1}
                max={199}
                placeholder="1부터 199 사이의 숫자만 지원"
              />
            </div>
            <div className={styles.submit}>
              <button type="button" onClick={handleClick}>
                <span>숫자 세기</span>
              </button>
            </div>
          </div>
        </div>
        {results.length > 0 && (
          <div className={`${styles.result} ${styles['result-counter']}`}>
            <dl>
              {results.map((r, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: r }} />
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
