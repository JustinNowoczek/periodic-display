import { PeriodicElementType } from './periodic-element-type';

export type PeriodicElementFetchType =
  | {
      ok: true;
      message: PeriodicElementType[];
    }
  | { ok: false; message: string };
