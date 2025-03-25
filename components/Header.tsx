import Anchor from './Anchor';
import { useTheme } from './context/ThemeContext';
import { LogoDark, LogoLight, ModeDark, ModeLight, Outlink } from './Svgs';
import styles from '@/styles/Header.module.sass';

export default function Header() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <div className={styles.group}>
          <h1>
            <Anchor href="/">
              {isDarkMode ? <LogoLight /> : <LogoDark />}
              <span>리얼센치랩스(리치랩)</span>
            </Anchor>
          </h1>
          <ol>
            <li>
              <Anchor href="/converters">
                <span className={styles.link}>단위 컨버터/계산기</span>
              </Anchor>
            </li>
            <li>
              <Anchor href="https://timelab.dev1stud.io">
                <span className={styles.link}>타임랩</span>
                <Outlink />
              </Anchor>
            </li>
          </ol>
        </div>
        <button type="button" onClick={toggleTheme}>
          {isDarkMode ? <ModeLight /> : <ModeDark />}
          <span>{isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}</span>
        </button>
      </div>
    </header>
  );
}
