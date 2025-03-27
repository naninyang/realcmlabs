import { useState, useEffect } from 'react';
import { isIOS, isAndroid } from 'react-device-detect';
import Seo from '@/components/Seo';
import Anchor from '@/components/Anchor';
import { Checked, ErrorIcon, Info, Unchecked } from '@/components/Svgs';
import styles from '@/styles/Home.module.sass';

type Unit = 'cm' | 'mm' | 'in';

type CalculatedValues = {
  displayWidth: number;
  displayHeight: number;
  displayWidthMM: number;
  displayHeightMM: number;
  displayWidthIN: number;
  displayHeightIN: number;
  pixelWidth: number;
  pixelHeight: number;
};

export default function Home() {
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [unit, setUnit] = useState<Unit>('cm');
  const [diagonalSize, setDiagonalSize] = useState<number>(24);
  const [diagonalUnit, setDiagonalUnit] = useState<Unit>('in');
  const [browserWidth, setBrowserWidth] = useState<number>(0);
  const [browserHeight, setBrowserHeight] = useState<number>(0);
  const [browserWidthCM, setBrowserWidthCM] = useState<number>(0);
  const [browserHeightCM, setBrowserHeightCM] = useState<number>(0);
  const [calculated, setCalculated] = useState<boolean>(false);
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [singleLength, setSingleLength] = useState<number>(10);
  const [singleUnit, setSingleUnit] = useState<Unit>('cm');
  const [isVertical, setIsVertical] = useState<boolean>(false);
  const [ios, setIos] = useState<boolean>();
  const [android, seAndroid] = useState<boolean>();
  const [monitor, setMonitor] = useState<boolean>();
  const [calculatedValues, setCalculatedValues] = useState({
    displayWidth: 0,
    displayHeight: 0,
    displayWidthMM: 0,
    displayHeightMM: 0,
    displayWidthIN: 0,
    displayHeightIN: 0,
    pixelWidth: 0,
    pixelHeight: 0,
  });

  useEffect(() => {
    if (isIOS) {
      setIos(true);
    } else if (isAndroid) {
      seAndroid(true);
    } else {
      setMonitor(true);
    }

    const updateSize = () => {
      setBrowserWidth(document.documentElement.clientWidth);
      setBrowserHeight(document.documentElement.clientHeight);
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const convertSize = (value: number, fromUnit: Unit, toUnit: Unit): number => {
    if (fromUnit === toUnit) return value;
    if (fromUnit === 'cm' && toUnit === 'mm') return value * 10;
    if (fromUnit === 'cm' && toUnit === 'in') return value / 2.54;
    if (fromUnit === 'mm' && toUnit === 'cm') return value / 10;
    if (fromUnit === 'mm' && toUnit === 'in') return value / 25.4;
    if (fromUnit === 'in' && toUnit === 'cm') return value * 2.54;
    if (fromUnit === 'in' && toUnit === 'mm') return value * 25.4;
    return value;
  };

  const handleModeChange = (newMode: 'single' | 'multi') => {
    setMode(newMode);
    setCalculated(false);
  };

  const handleDeviceSelect = (value: string) => {
    const inchValue = parseFloat(value);
    setDiagonalSize(inchValue);
    setDiagonalUnit('in');
  };

  const calculateSizes = () => {
    const diagonalInches = convertSize(diagonalSize, diagonalUnit, 'in');
    const screenDiagonalPx = Math.sqrt(window.screen.width ** 2 + window.screen.height ** 2);
    const newDevicePPI = screenDiagonalPx / diagonalInches;

    const updatedBrowserWidthCM = (browserWidth * 2.54) / newDevicePPI;
    const updatedBrowserHeightCM = (browserHeight * 2.54) / newDevicePPI;
    const vertical = updatedBrowserHeightCM > updatedBrowserWidthCM;

    setBrowserWidthCM(updatedBrowserWidthCM);
    setBrowserHeightCM(updatedBrowserHeightCM);
    setIsVertical(vertical);

    const resolution = newDevicePPI ?? 96;

    const newCalculatedValues: CalculatedValues =
      mode === 'single'
        ? (() => {
            const lengthCM = convertSize(singleLength, singleUnit, 'cm');
            return vertical
              ? {
                  displayWidth: 0,
                  displayHeight: lengthCM,
                  displayWidthMM: 0,
                  displayHeightMM: convertSize(lengthCM, 'cm', 'mm'),
                  displayWidthIN: 0,
                  displayHeightIN: convertSize(lengthCM, 'cm', 'in'),
                  pixelWidth: 1,
                  pixelHeight: (lengthCM * resolution) / 2.54,
                }
              : {
                  displayWidth: lengthCM,
                  displayHeight: 0,
                  displayWidthMM: convertSize(lengthCM, 'cm', 'mm'),
                  displayHeightMM: 0,
                  displayWidthIN: convertSize(lengthCM, 'cm', 'in'),
                  displayHeightIN: 0,
                  pixelWidth: (lengthCM * resolution) / 2.54,
                  pixelHeight: 1,
                };
          })()
        : (() => {
            const displayWidth = convertSize(width, unit, 'cm');
            const displayHeight = convertSize(height, unit, 'cm');
            return {
              displayWidth,
              displayHeight,
              displayWidthMM: convertSize(displayWidth, 'cm', 'mm'),
              displayHeightMM: convertSize(displayHeight, 'cm', 'mm'),
              displayWidthIN: convertSize(displayWidth, 'cm', 'in'),
              displayHeightIN: convertSize(displayHeight, 'cm', 'in'),
              pixelWidth: (displayWidth * resolution) / 2.54,
              pixelHeight: (displayHeight * resolution) / 2.54,
            };
          })();

    setCalculatedValues(newCalculatedValues);
    setCalculated(true);
  };

  const isSingleOverflow =
    (isVertical && calculatedValues.pixelHeight > browserHeight) ||
    (!isVertical && calculatedValues.pixelWidth > browserWidth);

  const timestamp = Date.now();

  return (
    <main className={styles.main}>
      <Seo pageImg={`https://realcmlabs.dev1stud.io/og.webp?ts=${timestamp}`} />
      <p className="seo">실제 사이즈를 알고 싶다면 리치랩!</p>
      <div className={`container ${styles.container}`}>
        <div className={styles.headline}>
          <h1>실제 길이/면적 계산</h1>
          <div className={styles.more}>
            <p>
              <Info />
              <span>
                다양한 컨버터/계산기를 원하시면 <Anchor href="/converters">여기</Anchor>를 누르세요
              </span>
            </p>
            {android && (
              <p>
                <Info />
                <span>
                  안드로이드 디바이스 화면 크기는 <Anchor href="https://m.gsmarena.com/">여기</Anchor>를 눌러서
                  확인하세요.
                </span>
              </p>
            )}
          </div>
          <div className={styles.notice}>
            <p>
              <ErrorIcon />
              <span>알고 싶은 길이가 브라우저 가로폭, 세로폭보다 큰 경우 제대로 표시가 되지 않을 수 있어요!</span>
            </p>
            <p>
              <ErrorIcon />
              {!monitor ? (
                <span>모바일, 태블릿의 방향이 바뀌지 않게 임시로 방향 고정해 주세요.</span>
              ) : (
                <span>피벗을 지원하는 모니터 사용시, 방향을 바꾸신 뒤에는 꼭 [계산하기] 버튼을 눌러주세요.</span>
              )}
            </p>
          </div>
        </div>
        <div className={styles.module}>
          <p>
            <Info />
            <span>
              사용자의 브라우저 크기는{' '}
              <strong>
                {browserWidth} px  ×  {browserHeight} px
              </strong>{' '}
              입니다.
            </span>
          </p>
          <div className={styles.form}>
            <div className={styles.group}>
              {ios ? (
                <>
                  <label htmlFor="real">디바이스 선택</label>
                  <select id="device" onChange={(e) => handleDeviceSelect(e.target.value)}>
                    <optgroup label="iPhone">
                      <option value={5.4}>13 mini</option>
                      <option value={6.1}>13 / 13 Pro</option>
                      <option value={6.7}>13 Pro Max</option>
                      <option value={6.1}>14 / 14 Pro</option>
                      <option value={6.7}>14 Plus / 14 Pro Max</option>
                      <option value={6.7}>15 Plus / 15 Pro Max</option>
                      <option value={6.1}>15 / 15 Pro / 16</option>
                      <option value={6.7}>16 Plus</option>
                      <option value={6.3}>16 Pro</option>
                      <option value={6.9}>16 Pro Max</option>
                    </optgroup>
                    <optgroup label="iPad">
                      <option value={9.7}>9.7″ / Pro 9.7″</option>
                      <option value={9.7}>Air / Air 2</option>
                      <option value={8.3}>Mini 6</option>
                      <option value={7.9}>Mini Series</option>
                      <option value={12.9}>Pro 12.9″, Air 4</option>
                      <option value={11}>Pro 11″</option>
                      <option value={10.5}>Air 3 / Pro 10.5″</option>
                      <option value={10.2}>10.2″ / 7</option>
                    </optgroup>
                  </select>
                </>
              ) : (
                <>
                  <label htmlFor="real">화면 대각선 길이</label>
                  <input
                    id="real"
                    type="number"
                    value={diagonalSize}
                    onChange={(e) => setDiagonalSize(Number(e.target.value))}
                  />
                  <select value={diagonalUnit} onChange={(e) => setDiagonalUnit(e.target.value as Unit)}>
                    <option value="in">in</option>
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                  </select>
                </>
              )}
            </div>
            {!ios && <p>화면 대각선 길이는 화면 크기가 몇인지를 입력하시면 됩니다.</p>}
            <div className={styles.radio}>
              <div className={styles.checkbox}>
                <input
                  type="radio"
                  id="single"
                  checked={mode === 'single'}
                  onChange={() => handleModeChange('single')}
                />
                {mode === 'single' ? (
                  <div className={styles.checked}>
                    <Checked />
                  </div>
                ) : (
                  <div className={styles.unchecked}>
                    <Unchecked />
                  </div>
                )}
                <label htmlFor="single">단일</label>
              </div>
              <div className={styles.checkbox}>
                <input type="radio" id="multi" checked={mode === 'multi'} onChange={() => handleModeChange('multi')} />
                {mode === 'multi' ? (
                  <div className={styles.checked}>
                    <Checked />
                  </div>
                ) : (
                  <div className={styles.unchecked}>
                    <Unchecked />
                  </div>
                )}
                <label htmlFor="multi">가로폭/세로폭</label>
              </div>
            </div>
            <div className={styles.groups}>
              {mode === 'single' ? (
                <div className={styles.group}>
                  <label htmlFor="line">알고 싶은 길이</label>
                  <input
                    id="line"
                    type="number"
                    value={singleLength}
                    onChange={(e) => setSingleLength(Number(e.target.value))}
                  />
                  <select value={singleUnit} onChange={(e) => setSingleUnit(e.target.value as Unit)}>
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                </div>
              ) : (
                <>
                  <div className={styles.group}>
                    <label htmlFor="horizontal">알고 싶은 가로폭</label>
                    <input
                      id="horizontal"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                    />
                    <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                  <div className={styles.group}>
                    <label htmlFor="vertical">알고 싶은 세로폭</label>
                    <input
                      id="vertical"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                    />
                    <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className={styles.submit}>
              <button type="button" onClick={calculateSizes}>
                <span>계산하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {calculated && (
        <div className={styles.result}>
          <div className={`container ${styles.container}`}>
            <h2>실제 길이</h2>
            {mode === 'multi' && (
              <dl>
                <div>
                  <dt>가로</dt>
                  <dd>
                    {unit !== 'cm' && `${calculatedValues.displayWidth.toFixed(2)} cm / `}
                    {unit !== 'mm' && `${calculatedValues.displayWidthMM.toFixed(2)} mm`}
                    {unit !== 'in' && ` / ${calculatedValues.displayWidthIN.toFixed(2)} in`}
                  </dd>
                </div>
                <div>
                  <dt>세로</dt>
                  <dd>
                    {unit !== 'cm' && `${calculatedValues.displayHeight.toFixed(2)} cm / `}
                    {unit !== 'mm' && `${calculatedValues.displayHeightMM.toFixed(2)} mm`}
                    {unit !== 'in' && ` / ${calculatedValues.displayHeightIN.toFixed(2)} in`}
                  </dd>
                </div>
              </dl>
            )}
            <div className={styles.info}>
              {mode === 'multi' ? (
                <>
                  <p>
                    브라우저 가로폭은 {browserWidthCM.toFixed(2)} cm이며, 세로폭은 {browserHeightCM.toFixed(2)}{' '}
                    cm입니다.
                  </p>
                  <p>면적은 {(calculatedValues.displayWidth * calculatedValues.displayHeight).toFixed(2)} cm²입니다.</p>
                </>
              ) : (
                <p>
                  브라우저 {isVertical ? '세로폭' : '가로폭'}은{' '}
                  <strong>{isVertical ? browserHeightCM.toFixed(2) : browserWidthCM.toFixed(2)} cm</strong>입니다.
                </p>
              )}
            </div>
          </div>
          <div className={styles.outter}>
            {mode === 'multi' ? (
              <div
                className={styles.realbox}
                style={{
                  width: calculatedValues.pixelWidth,
                  height: calculatedValues.pixelHeight,
                }}
              >
                <span>실제 크기</span>
                {(calculatedValues.pixelWidth > browserWidth || calculatedValues.pixelHeight > browserHeight) && (
                  <div className={styles.warning}>
                    <p>실제 길이가 브라우저에서 보여줄 수 있는 길이보다 긴 관계로 일부가 초과되었습니다.</p>
                    <dl>
                      {calculatedValues.pixelWidth > browserWidth && (
                        <div>
                          <dt>가로폭</dt>
                          <dd>
                            {(
                              ((calculatedValues.pixelWidth - browserWidth) * 2.54) /
                              (window.devicePixelRatio * 96)
                            ).toFixed(2)}{' '}
                            cm 초과
                          </dd>
                        </div>
                      )}
                      {calculatedValues.pixelHeight > browserHeight && (
                        <div>
                          <dt>세로폭</dt>
                          <dd>
                            {(
                              ((calculatedValues.pixelHeight - browserHeight) * 2.54) /
                              (window.devicePixelRatio * 96)
                            ).toFixed(2)}{' '}
                            cm 초과
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`${styles.realline} ${isVertical ? styles.vertical : styles.horizontal} ${isSingleOverflow ? styles.overflow : ''}`}
                style={isVertical ? { height: calculatedValues.pixelHeight } : { width: calculatedValues.pixelWidth }}
              >
                {isSingleOverflow ? (
                  <>
                    <div className={styles.guide}>
                      <span>
                        {(
                          ((isVertical
                            ? calculatedValues.pixelHeight - browserHeight
                            : calculatedValues.pixelWidth - browserWidth) *
                            2.54) /
                          (window.devicePixelRatio * 96)
                        ).toFixed(2)}{' '}
                        cm 초과됨
                      </span>
                    </div>
                    <div className={styles.warning}>
                      <p>실제 길이가 브라우저에서 보여줄 수 있는 길이보다 긴 관계로 일부가 초과되었습니다.</p>
                      <dl>
                        <div>
                          <dt>초과된 길이</dt>
                          <dd>
                            {(
                              ((isVertical
                                ? calculatedValues.pixelHeight - browserHeight
                                : calculatedValues.pixelWidth - browserWidth) *
                                2.54) /
                              (window.devicePixelRatio * 96)
                            ).toFixed(2)}{' '}
                            cm 초과
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </>
                ) : (
                  <div className={styles.guide}>
                    <span>
                      {isVertical
                        ? singleUnit === 'mm'
                          ? `${calculatedValues.displayHeight.toFixed(2)} cm / ${calculatedValues.displayHeightIN.toFixed(2)} in`
                          : singleUnit === 'cm'
                            ? `${calculatedValues.displayHeightMM.toFixed(2)} mm / ${calculatedValues.displayHeightIN.toFixed(2)} in`
                            : `${calculatedValues.displayHeightMM.toFixed(2)} mm / ${calculatedValues.displayHeight.toFixed(2)} cm`
                        : singleUnit === 'mm'
                          ? `${calculatedValues.displayWidth.toFixed(2)} cm / ${calculatedValues.displayWidthIN.toFixed(2)} in`
                          : singleUnit === 'cm'
                            ? `${calculatedValues.displayWidthMM.toFixed(2)} mm / ${calculatedValues.displayWidthIN.toFixed(2)} in`
                            : `${calculatedValues.displayWidthMM.toFixed(2)} mm / ${calculatedValues.displayWidth.toFixed(2)} cm`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
