import { time } from '@nomicfoundation/hardhat-network-helpers';

const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

(async () => {
  await time.increase(ONE_YEAR_IN_SECS);
})();
