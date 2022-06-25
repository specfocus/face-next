import { Tokenizer, type Token } from '@specfocus/pack-focus.json/tasks/tokenizer';
import type { NextRequest } from 'next/server';
import iterable from '@specfocus/main-focus/async/read-iterator';

export default async function* tokenize(req: NextRequest): AsyncIterable<Token> {
  if (req.body === null) {
    return;
  }
  const tokenizer = new Tokenizer(new Set([]));
  const reader = req.body.getReader();
  for await (const chunk of iterable(reader)) {
    if (chunk) {
      const tokens = tokenizer.tokenize(chunk);
      for (const token of tokens) {
        if (token.type === 'error') {
          return token;
        }
        yield token;
      }
    }
  }

  if (tokenizer.string && tokenizer.string.length) {
    const value = Number(tokenizer.string);
    if (!Number.isNaN(value)) {
      yield { path: [], type: 'value', value };
    }
  }
}
