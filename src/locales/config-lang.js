'use client';

import merge from 'lodash/merge';
// date fns
// eslint-disable-next-line import/no-unresolved
import th from 'date-fns/locale/th';

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
    adapterLocale: th,
    icon: 'flagpack:gb-nir',
    numberFormat: {
      code: 'en-US',
      currency: 'USD',
    },
    timeZone: 'Asia/Bangkok', // Add time zone information here
  },
];

export const defaultLang = allLangs[0]; // English
