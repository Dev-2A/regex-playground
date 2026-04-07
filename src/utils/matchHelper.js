export function getMatches(regex, testString) {
  if (!regex || !testString) return [];

  const matches = [];
  const re = new RegExp(regex.source, regex.flags);

  if (re.flags.includes("g")) {
    let match;
    while ((match = re.exec(testString)) !== null) {
      matches.push({
        index: match.index,
        end: match.index + match[0].length,
        value: match[0],
        groups: match.slice(1),
        namedGroups: match.groups || {},
      });
      if (match[0].length === 0) {
        re.lastIndex++;
      }
    }
  } else {
    const match = re.exec(testString);
    if (match) {
      matches.push({
        index: match.index,
        end: match.index + match[0].length,
        value: match[0],
        groups: match.slice(1),
        namedGroups: match.groups || {},
      });
    }
  }

  return matches;
}

export function buildHighlightSegments(testString, matches) {
  if (!testString || matches.length === 0) {
    return [{ text: testString || "", highlight: false, matchIndex: -1 }];
  }

  const segments = [];
  let cursor = 0;

  for (let i = 0; i < matches.length; i++) {
    const { index, end } = matches[i];

    if (index > cursor) {
      segments.push({
        text: testString.slice(cursor, index),
        highlight: false,
        matchIndex: -1,
      });
    }

    if (end > index) {
      segments.push({
        text: testString.slice(index, end),
        highlight: true,
        matchIndex: i,
      });
    }

    cursor = end;
  }

  if (cursor < testString.length) {
    segments.push({
      text: testString.slice(cursor),
      highlight: false,
      matchIndex: -1,
    });
  }

  return segments;
}
