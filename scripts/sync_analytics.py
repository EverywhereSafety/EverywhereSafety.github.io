"""Install/check the shared Analytics loader on visitor-facing HTML pages."""

import argparse
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = '<script defer src="https://everywheresafety.github.io/assets/analytics.js"></script>'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.redirect = False
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'refresh':
            self.redirect = True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail if a visitor page lacks the loader')
    args = parser.parse_args()
    missing = []
    eligible = 0
    for path in sorted(ROOT.rglob('*.html')):
        # Generated artwork galleries are development fixtures, not site pages.
        if 'art-preview' in path.parts:
            continue
        text = path.read_text()
        if Page(text).redirect:
            continue
        if not re.search(r'</head\s*>', text, re.I):
            continue
        eligible += 1
        if SCRIPT in text:
            if text.count(SCRIPT) != 1:
                raise SystemExit(f'Duplicate Analytics loader: {path.relative_to(ROOT)}')
            continue
        missing.append(str(path.relative_to(ROOT)))
        if not args.check:
            path.write_text(re.sub(r'(</head\s*>)', SCRIPT + '\n' + r'\1', text, count=1, flags=re.I))
    if args.check and missing:
        raise SystemExit('Missing Analytics loader:\n' + '\n'.join(missing))
    print(f'{eligible} visitor pages checked; {len(missing)} ' + ('missing' if args.check else 'updated'))


if __name__ == '__main__':
    main()
