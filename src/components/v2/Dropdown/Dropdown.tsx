import React, { useState } from 'react';
import { uid } from 'react-uid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { ReactComponent as IconArrow } from './assets/arrow.svg';
import { SELECTED_MENU_ITEM_CLASSNAME, useDropdownStyles } from './DropdownStyles';

interface Option {
  value: string;
  label: string;
  img?: string;
}

interface ISelectProps {
  options: Option[];
  defaultValue: Option;
  onSelect?: (value?: string) => void;
}

export const Dropdown = ({ options, defaultValue, onSelect }: ISelectProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue.value);
  const [isOpened, setIsOpened] = useState(false);
  const styles = useDropdownStyles({ isOpened });

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;
    setSelectedValue(newValue);
    if (onSelect) onSelect(newValue);
  };

  const handleClose = () => {
    setIsOpened(false);
  };

  const handleOpen = () => {
    setIsOpened(true);
  };

  return (
    <FormControl fullWidth hiddenLabel>
      <Select
        value={selectedValue}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label', disableUnderline: true }}
        IconComponent={IconArrow}
        MenuProps={{
          autoFocus: false,
          PaperProps: {
            style: styles.menuPaper,
          },
          MenuListProps: {
            style: styles.menuList,
          },
        }}
        open={isOpened}
        onClose={handleClose}
        onOpen={handleOpen}
        sx={styles.select}
      >
        {options.map(({ value, label, img }) => (
          <MenuItem
            key={uid(value)}
            classes={{ selected: SELECTED_MENU_ITEM_CLASSNAME }}
            sx={styles.menuItem}
            value={value}
          >
            {img && <img style={styles.asset} src={img} alt={value} />}
            <Typography display="inline">{label}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
