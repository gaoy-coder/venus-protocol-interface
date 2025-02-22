/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { formatApy } from 'utilities/common';
import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import { Table } from '.';
import { Toggle } from '../Toggle';
import { Icon } from '../Icon';

const styles = {
  asset: css`
    display: flex;
    align-items: center;
    img {
      height: 18px;
      width: 18px;
      margin-right: 4px;
    }
    span {
      display: flex;
      justify-self: flex-end;
    }
  `,
  apy: css`
    color: #18df8b;
    svg {
      margin-right: 12px;
      fill: #18df8b;
    }
  `,
};

function createData(
  asset: keyof typeof CONTRACT_TOKEN_ADDRESS,
  apy: number,
  wallet: number,
  collateral: boolean,
) {
  return [
    {
      key: asset,
      value: asset,
      render: () => (
        <div css={styles.asset}>
          <img src={CONTRACT_TOKEN_ADDRESS[asset]?.asset} alt={asset} />
          <span>{asset.toUpperCase()}</span>
        </div>
      ),
    },
    {
      key: apy.toString(),
      value: apy,
      render: () => (
        <div css={styles.apy}>
          <Icon name="longArrow" size="12px" />
          {formatApy(apy)} {asset.toUpperCase()}
        </div>
      ),
    },
    { key: wallet.toString(), value: wallet, render: () => `${wallet} ${asset}` },
    {
      key: collateral.toString(),
      value: collateral,
      render: () => <Toggle onChange={console.log} value={collateral} />,
    },
  ];
}

const rows = [
  createData('sxp', 0.18, 0, true),
  createData('usdc', 12.05, 90, false),
  createData('usdt', 0.8, 160, true),
  createData('bnb', 1.18, 37, false),
  createData('xvs', 0.15, 160, true),
];

const columns = [
  { key: 'asset', label: 'Asset', orderable: false },
  { key: 'APY', label: 'APY', orderable: true },
  { key: 'Wallet', label: 'Wallet', orderable: true },
  { key: 'Collateral', label: 'Collateral', orderable: true },
];

export default {
  title: 'Components/Table',
  component: Table,
  decorators: [withCenterStory({ width: 800 }), withThemeProvider],
} as ComponentMeta<typeof Table>;

export const TableDefault = () => (
  <Table columns={columns} data={rows} title="Market Data" minWidth="650px" />
);
