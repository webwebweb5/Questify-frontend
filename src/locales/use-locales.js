'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettingsContext } from 'src/components/settings';

import { allLangs, defaultLang } from './config-lang';

// ----------------------------------------------------------------------

export function useLocales() {
  const currentLang = defaultLang;

  return {
    allLangs,
    currentLang,
    timeZone: currentLang.timeZone, // Provide the time zone information
  };
}

// ----------------------------------------------------------------------

export function useTranslate() {
  const { t, i18n, ready } = useTranslation();

  const settings = useSettingsContext();

  const onChangeLang = useCallback(
    (newLang) => {
      i18n.changeLanguage(newLang);
      settings.onChangeDirectionByLang(newLang);
    },
    [i18n, settings]
  );

  return {
    t,
    i18n,
    ready,
    onChangeLang,
  };
}
