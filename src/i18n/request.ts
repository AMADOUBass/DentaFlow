import { getRequestConfig } from 'next-intl/server';
import { getTranslations } from '../lib/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || 'fr';
  return {
    locale,
    messages: getTranslations(locale as any) as any
  };
});
