import { createHash } from 'crypto';

export function md5(thing: any) {
  return createHash('md5').update(JSON.stringify(thing)).digest('hex');
}
