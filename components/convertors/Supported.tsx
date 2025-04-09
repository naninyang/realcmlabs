import { useEffect, useState } from 'react';
import { isIOS, isAndroid } from 'react-device-detect';
import { SupportedHeadline, SupportedImage, SupportedText } from '../Svgs';
import Anchor from '../Anchor';
import styles from '@/styles/Converters.module.sass';

export default function Supported() {
  const [monitor, setMonitor] = useState<boolean>();

  useEffect(() => {
    const isMobile = isIOS || isAndroid;
    setMonitor(!isMobile);
  }, []);

  return (
    <section className={`${styles.section} ${styles['section-anthor']}`}>
      <div className={styles.module}>
        <h2>
          <SupportedHeadline />
        </h2>
        <div className={`${styles.gffd} ${monitor ? styles.latte : ''}`}>
          <div className={styles.image}>
            <SupportedImage />
          </div>
          <div className={styles.text}>
            <SupportedText />
          </div>
          <Anchor href="https://www.youtube.com/@GodFFreeDom_sadman">
            <span>채널 이동</span>
          </Anchor>
        </div>
      </div>
    </section>
  );
}
