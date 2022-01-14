import { IButtonStyles, IComboBoxStyles, IComboBoxOptionStyles } from '@fluentui/react';

export const multiSelectStyles: Partial<IComboBoxStyles> = {
  root: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--background-color)`,
    '.ms-ComboBox-container &:hover::after': {
      borderColor: 'var(--palette-black-alpha-60)',
    },
  },
  rootHovered: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--background-color)`,
    '& > .ms-ComboBox-Input': {
      color: `var(--text-primary-color)`,
    },
    '&:hover > .ms-ComboBox-Input': {
      color: `var(--text-primary-color)`,
    },
  },
  rootFocused: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--background-color)`,
    '& > .ms-ComboBox-Input': {
      color: `var(--text-primary-color)`,
    },
    '&:hover > .ms-ComboBox-Input': {
      color: `var(--text-primary-color)`,
    },
  },
  rootPressed: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--background-color)`,
    '& > .ms-ComboBox-Input': {
      color: `var(--text-primary-color)`,
    },
    '&:hover > .ms-ComboBox-Input': {
      color: `var(--text-primary-color)`,
    },
  },
  input: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--background-color)`,
    '::placeholder': {
      color: `var(--text-primary-color)`,
      backgroundColor: `var(--background-color)`,
      opacity: 1,
    },
    '.ms-ComboBox-container > .ms-ComboBox:hover &::placeholder': {
      color: `var(--text-primary-color)`,
    },
  },
  optionsContainer: {
    '& > .ms-ComboBox-divider': {
      backgroundColor: `var(--background-color)`,
    },
  },
};

export const multiSelectCaretDownButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--background-color)`,
  },
  rootHovered: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--palette-black-alpha-10)`,
  },
  rootChecked: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--palette-black-alpha-10)`,
  },
  rootCheckedHovered: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--palette-black-alpha-10)`,
  },
  rootCheckedPressed: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--palette-black-alpha-10)`,
  },
  rootExpanded: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--palette-black-alpha-10)`,
  },
  rootExpandedHovered: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--palette-black-alpha-10)`,
  },
  rootFocused: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--palette-black-alpha-10)`,
  },
  rootHasMenu: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--palette-black-alpha-10)`,
  },
  rootPressed: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--palette-black-alpha-10)`,
  },
};

export const multiSelectComboBoxOptionStyles: Partial<IComboBoxOptionStyles> = {
  root: {
    color: `var(--text-primary-color)`,
    backgroundColor: `var(--background-color)`,
    ':hover': {
      color: `var(--text-primary-color)`,
      backgroundColor: `rgb(var(--palette-neutral-8))`,
    },
  },
  rootHovered: {
    color: `var(--text-primary-color)`,
    backgroundColor: `rgb(var(--palette-neutral-8))`,
  },
  rootChecked: {
    color: `var(--text-primary-color)`,
    backgroundColor: `rgb(var(--palette-neutral-10))`,
  },
  rootCheckedHovered: {
    color: `var(--text-primary-color)`,
    backgroundColor: `rgb(var(--palette-neutral-8))`,
  },
  rootCheckedPressed: {
    color: `var(--text-primary-color)`,
    backgroundColor: `rgb(var(--palette-neutral-10))`,
  },
  rootExpanded: {
    color: `var(--text-primary-color)`,
    backgroundColor: `rgb(var(--palette-neutral-10))`,
  },
  rootExpandedHovered: {
    color: `var(--text-primary-color)`,
    backgroundColor: `rgb(var(--palette-neutral-10))`,
  },
  rootFocused: {
    color: `var(--text-primary-color)`,
    backgroundColor: `rgb(var(--palette-neutral-10))`,
  },
  rootHasMenu: {
    color: `var(--text-primary-color)`,
    backgroundColor: `rgb(var(--palette-neutral-10))`,
  },
  rootPressed: {
    color: `var(--text-primary-color)`,
    backgroundColor: `rgb(var(--palette-neutral-10))`,
  },
  label: {
    '.ms-Checkbox-checkbox': {
      borderColor: `var(--palette-black-alpha-10)`,
    },
  },
};
