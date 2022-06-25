import type { Arrayable, Options, Part } from '../../types';

const separator = '\r\n';

async function* generate<T>(
  iterable: AsyncIterable<string>,
  options?: Options
): AsyncGenerator<Arrayable<Part<T, string>>> {
  const is_eager = !options || !options.multiple;

  let buffer = '';
  let is_preamble = true;
  let payloads: any[] = [];

  try {
    outer: for await (const chunk of iterable) {

      if (payloads.length) yield payloads;
    }
  } finally {
    if (payloads.length) yield payloads;
  }
}

export default generate;