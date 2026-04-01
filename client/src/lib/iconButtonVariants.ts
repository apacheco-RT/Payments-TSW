import type { IconButtonVariant } from '@ds-foundation/react';

const TSW_VARIANT_MAP = {
  view:      'info',
  confirm:   'success',
  complete:  'primary',
  reextract: 'warning',
  fail:      'danger',
  default:   'neutral',
} as const satisfies Record<string, IconButtonVariant>;

export type TswIconButtonVariant = keyof typeof TSW_VARIANT_MAP;

export const toIconButtonVariant = (v: TswIconButtonVariant): IconButtonVariant =>
  TSW_VARIANT_MAP[v];
