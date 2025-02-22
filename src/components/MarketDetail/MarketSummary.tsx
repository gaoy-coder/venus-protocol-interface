import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import { connectAccount } from 'core';
import { State } from 'core/modules/initialState';
import * as constants from 'utilities/constants';
import { vtokenDecimals } from '../../config';

const MarketSummaryWrapper = styled.div`
  .label {
    font-size: 16px;
    font-weight: normal;
    color: var(--color-text-main);
  }

  .value {
    font-size: 17px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  .description {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-bg-active);
    }

    @media only screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 10px;
    }
  }
`;

const format = commaNumber.bindWith(',', '.');

interface Props extends RouteComponentProps {
  marketInfo: Partial<$TSFixMe>;
  currentAsset: string;
}

function MarketSummary({ marketInfo, currentAsset }: Props) {
  return (
    <MarketSummaryWrapper>
      <div className="description">
        <p className="label">Price</p>
        <p className="value">
          {`$${new BigNumber(marketInfo.underlyingPrice || 0)
            .div(
              new BigNumber(10).pow(
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                36 - constants.CONTRACT_TOKEN_ADDRESS[currentAsset].decimals,
              ),
            )
            .dp(8, 1)
            .toString(10)}`}
        </p>
      </div>
      <div className="description">
        <p className="label">Market Liquidity</p>
        <p className="value">
          {`${format(
            new BigNumber(marketInfo.cash || 0)
              .div(
                new BigNumber(10).pow(
                  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                  constants.CONTRACT_TOKEN_ADDRESS[currentAsset].decimals,
                ),
              )
              .dp(8, 1)
              .toString(10),
          )} ${marketInfo.underlyingSymbol || ''}`}
        </p>
      </div>
      <div className="description">
        <p className="label"># of Suppliers</p>
        <p className="value">{format(marketInfo.supplierCount)}</p>
      </div>
      <div className="description">
        <p className="label"># of Borrowers</p>
        <p className="value">{format(marketInfo.borrowerCount)}</p>
      </div>
      <div className="description">
        <p className="label">Borrow Cap</p>
        <p className="value">
          ${format(new BigNumber(marketInfo.totalBorrowsUsd).dp(2, 1).toString(10))}
        </p>
      </div>
      <div className="description">
        <p className="label">Interest Paid/Day</p>
        <p className="value">
          $
          {format(
            new BigNumber(marketInfo.supplierDailyVenus)
              .plus(new BigNumber(marketInfo.borrowerDailyVenus))
              .div(new BigNumber(10).pow(18))
              .multipliedBy(marketInfo.tokenPrice)
              .dp(2, 1)
              .toString(10),
          )}
        </p>
      </div>
      <div className="description">
        <p className="label">Reserves</p>
        <p className="value">
          {`${new BigNumber(marketInfo.totalReserves || 0)
            .div(
              new BigNumber(10).pow(
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                constants.CONTRACT_TOKEN_ADDRESS[currentAsset].decimals,
              ),
            )
            .dp(8, 1)
            .toString(10)} ${marketInfo.underlyingSymbol || ''}`}
        </p>
      </div>
      <div className="description">
        <p className="label">Reserve Factor</p>
        <p className="value">
          {`${new BigNumber(marketInfo.reserveFactor || 0)
            .div(new BigNumber(10).pow(18))
            .multipliedBy(100)
            .dp(8, 1)
            .toString(10)}%`}
        </p>
      </div>
      <div className="description">
        <p className="label">Collateral Factor</p>
        <p className="value">
          {/* @BF: Collateral Factor */}
          {`${new BigNumber(marketInfo.collateralFactor || 0)
            .div(new BigNumber(10).pow(18))
            .times(100)
            .dp(2, 1)
            .toString(10)}%`}
        </p>
      </div>
      <div className="description">
        <p className="label">Total Supply</p>
        <p className="value">
          {`$${format(new BigNumber(marketInfo.totalSupplyUsd || 0).dp(2, 1).toString(10))}`}
        </p>
      </div>
      <div className="description">
        <p className="label">Total Borrow</p>
        <p className="value">
          {`$${format(new BigNumber(marketInfo.totalBorrowsUsd || 0).dp(2, 1).toString(10))}`}
        </p>
      </div>
      <div className="description">
        <p className="label">v{marketInfo.underlyingSymbol} Minted</p>
        <p className="value">{format(marketInfo.totalSupply2)}</p>
      </div>
      <div className="description">
        <p className="label">Exchange Rate</p>
        <p className="value">
          {`1 ${marketInfo.underlyingSymbol || ''} = ${Number(
            new BigNumber(1)
              .div(
                new BigNumber(marketInfo.exchangeRate).div(
                  new BigNumber(10).pow(
                    18 +
                      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      constants.CONTRACT_TOKEN_ADDRESS[currentAsset].decimals -
                      vtokenDecimals,
                  ),
                ),
              )
              .toString(10),
          ).toFixed(6)} ${marketInfo.symbol || ''}`}
        </p>
      </div>
    </MarketSummaryWrapper>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(withRouter(MarketSummary));
