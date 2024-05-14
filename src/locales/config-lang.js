'use client';

import merge from 'lodash/merge';
// date fns
import { enUS as enUSAdapter } from 'date-fns/locale';

// core (MUI)
import { enUS as enUSCore } from '@mui/material/locale';
// data grid (MUI)
import { enUS as enUSDataGrid } from '@mui/x-data-grid';
// date pickers (MUI)
import { enUS as enUSDate } from '@mui/x-date-pickers/locales';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
    numberFormat: {
      code: 'en-US',
      currency: 'USD',
    },
  },
];

export const defaultLang = allLangs[0]; // English

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
