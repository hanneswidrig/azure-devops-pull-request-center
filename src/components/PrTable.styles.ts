import { IDetailsListStyleProps, IDetailsListStyles, IStyleFunctionOrObject } from '@fluentui/react';

export const detailsListStyles: Partial<IStyleFunctionOrObject<IDetailsListStyleProps, IDetailsListStyles>> = {
  headerWrapper: {
    marginTop: '-16px',
    '& > .ms-DetailsHeader': {
      borderColor: `rgb(var(--palette-neutral-10))`,
      backgroundColor: `var(--background-color)`,
    },
    '& > .ms-DetailsHeader > .ms-DetailsHeader-cell': {
      color: `var(--text-primary-color)`,
    },
    '&:hover > .ms-DetailsHeader > .ms-DetailsHeader-cell': {
      backgroundColor: `rgb(var(--palette-neutral-2))`,
    },
  },
  focusZone: {
    '.ms-List > .ms-List-surface > .ms-List-page > .ms-List-cell > .ms-DetailsRow': {
      borderColor: `rgb(var(--palette-neutral-10))`,
      backgroundColor: `var(--background-color)`,
    },
    '.ms-List > .ms-List-surface > .ms-List-page > .ms-List-cell > .ms-DetailsRow:hover': {
      backgroundColor: `rgb(var(--palette-neutral-2))`,
    },
    '.ms-List > .ms-List-surface > .ms-List-page > .ms-List-cell > .ms-DetailsRow > .ms-DetailsRow-fields > .ms-DetailsRow-cell': {
      color: `var(--text-primary-color)`,
    },
  },
};
