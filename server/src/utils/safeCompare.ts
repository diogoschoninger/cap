import { timingSafeEqual } from 'crypto';

export default async (data: string, comparison: string) =>
  timingSafeEqual(Buffer.from(data), Buffer.from(comparison));
