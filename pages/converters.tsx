import Anchor from '@/components/Anchor';
import AreaConverter from '@/components/convertors/Area';
import LengthConverter from '@/components/convertors/Length';
import MassConverter from '@/components/convertors/Mass';
import PowerCalculator from '@/components/convertors/Power';
import SpeedConverter from '@/components/convertors/Speed';
import StorageConverter from '@/components/convertors/Storage';
import Supported from '@/components/convertors/Supported';
import TemperatureConverter from '@/components/convertors/Temperature';
import TimeBreakdown from '@/components/convertors/TimeBreakdown';
import VolumeConverter from '@/components/convertors/Volume';
import { LeftArrow } from '@/components/Svgs';
import styles from '@/styles/Converters.module.sass';

export default function Converters() {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <div className={styles.backlink}>
          <Anchor href="/">
            <LeftArrow />
            <span>뒤로가기</span>
          </Anchor>
        </div>
        <LengthConverter />
        <MassConverter />
        <TemperatureConverter />
        <AreaConverter />
        <VolumeConverter />
        <SpeedConverter />
        <StorageConverter />
        <Supported />
        <PowerCalculator />
        <TimeBreakdown />
      </div>
    </main>
  );
}
