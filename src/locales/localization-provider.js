'use client';

import PropTypes from 'prop-types';
import th from 'date-fns/locale/th';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// import { useLocales } from './use-locales';

// ----------------------------------------------------------------------

export default function LocalizationProvider({ children }) {
  // const { currentLang } = useLocales();

  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
      {children}
    </MuiLocalizationProvider>
  );
}

LocalizationProvider.propTypes = {
  children: PropTypes.node,
};
