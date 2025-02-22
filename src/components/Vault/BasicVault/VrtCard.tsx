// We put the code of UI of old VAI pool (which will be live for quite some time) into this seperated
// file, instead of merging its logic into general pool UI which is in `./Card.js` thus we can easily
// remove this VAI pool code in the future when it's about to be deprecated
import React, { useState, useEffect } from 'react';

import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import useRefresh from 'hooks/useRefresh';
import { useToken, useVrtVaultProxy } from 'hooks/useContract';
import { getVrtVaultProxyAddress } from 'utilities/addressHelpers';

import CardContent from './CardContent';
import CardHeader from './CardHeader';
import { VaultCardWrapper } from '../styles';

const DAYS_OF_YEAR = 365;
const BLOCK_PER_MINUTE = 60 / 3;
const BLOCK_PER_DAY = BLOCK_PER_MINUTE * 60 * 24;

export default function VaultCard() {
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();

  const vrtTokenContract = useToken('vrt');
  const vrtVaultProxyContract = useVrtVaultProxy();

  const [dailyEmission, setDailyEmission] = useState(new BigNumber(0));
  const [interestRatePerBlock, setInterestRatePerBlock] = useState(new BigNumber(0));
  const [vaultVrtBalance, setVaultVrtBalance] = useState(new BigNumber(0));
  const [userVrtAllowance, setUserVrtAllowance] = useState(new BigNumber(0));
  const [userVrtStakedAmount, setUserVrtStakedAmount] = useState(new BigNumber(0));
  const [userVrtBalance, setUserVrtBalance] = useState(new BigNumber(0));
  const [userPendingReward, setUserPendingReward] = useState(new BigNumber(0));

  const [expanded, setExpanded] = useState(false);

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '() => Promise<() => void>' is no... Remove this comment to see the full error message
  useEffect(async () => {
    let isMounted = true;

    let userVrtBalanceTemp = new BigNumber(0);
    let userVrtStakedAmountTemp = new BigNumber(0);
    let userPendingRewardTemp = new BigNumber(0);
    let userVrtAllowanceTemp = new BigNumber(0);

    const [interestRatePerBlockTemp, vaultVrtBalanceTemp] = await Promise.all([
      vrtVaultProxyContract.methods.interestRatePerBlock().call(),
      vrtTokenContract.methods.balanceOf(getVrtVaultProxyAddress()).call(),
    ]);

    if (account) {
      [
        userVrtBalanceTemp,
        { totalPrincipalAmount: userVrtStakedAmountTemp },
        userPendingRewardTemp,
        userVrtAllowanceTemp,
      ] = await Promise.all([
        vrtTokenContract.methods.balanceOf(account).call(),
        vrtVaultProxyContract.methods.userInfo(account).call(),
        vrtVaultProxyContract.methods.getAccruedInterest(account).call(),
        vrtTokenContract.methods.allowance(account, getVrtVaultProxyAddress()).call(),
      ]);
    }

    if (isMounted) {
      // total info
      setDailyEmission(
        new BigNumber(interestRatePerBlockTemp)
          .div(1e18)
          .multipliedBy(BLOCK_PER_DAY)
          .multipliedBy(vaultVrtBalance)
          .div(1e18)
          .dp(2, 1),
      );
      setInterestRatePerBlock(new BigNumber(interestRatePerBlockTemp));
      setVaultVrtBalance(new BigNumber(vaultVrtBalanceTemp));
      setUserVrtBalance(new BigNumber(userVrtBalanceTemp));
      setUserVrtStakedAmount(new BigNumber(userVrtStakedAmountTemp));
      setUserPendingReward(new BigNumber(userPendingRewardTemp));
      setUserVrtAllowance(new BigNumber(userVrtAllowanceTemp));
    }

    return () => {
      isMounted = false;
    };
  }, [fastRefresh, account]);

  return (
    <VaultCardWrapper>
      <CardHeader
        stakedToken="VRT"
        rewardToken="VRT"
        apy={interestRatePerBlock
          .multipliedBy(DAYS_OF_YEAR * BLOCK_PER_DAY)
          .div(1e18)
          .multipliedBy(100)
          .toFixed(2)}
        totalStakedAmount={vaultVrtBalance.div(1e18)}
        totalPendingRewards={vaultVrtBalance.div(1e18)}
        dailyEmission={dailyEmission}
        onExpand={() => {
          setExpanded(!expanded);
        }}
      />
      <div className="content-container">
        {expanded && (
          <CardContent
            userPendingReward={userPendingReward}
            userStakedTokenBalance={userVrtBalance}
            userStakedAllowance={userVrtAllowance}
            userStakedAmount={userVrtStakedAmount}
            stakedToken="VRT"
            rewardToken="VRT"
            fullWithdraw
            onClaimReward={() => vrtVaultProxyContract.methods.claim().send({ from: account })}
            onStake={stakeAmount =>
              vrtVaultProxyContract.methods.deposit(stakeAmount.toFixed(0)).send({ from: account })
            }
            onApprove={amt =>
              vrtTokenContract.methods
                .approve(vrtVaultProxyContract.options.address, amt.toFixed(0))
                .send({ from: account })
            }
            onWithdraw={() => vrtVaultProxyContract.methods.withdraw().send({ from: account })}
          />
        )}
      </div>
    </VaultCardWrapper>
  );
}
