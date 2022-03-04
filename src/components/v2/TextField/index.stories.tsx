import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { TextField } from '.';

export default {
  title: 'TextField',
  component: TextField,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as ComponentMeta<typeof TextField>;

export const DefaultTextField = () => <TextField />;
