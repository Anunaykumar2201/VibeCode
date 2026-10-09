import React from 'react';

/**
 * <T pirate="..." official="..." />
 * Text translator component rendering pirate flavor text with official subtitle or title tooltip.
 */
export default function T({ pirate, official, children }) {
  const pirateText = pirate || children;
  const officialText = official || '';

  if (!officialText) {
    return <span>{pirateText}</span>;
  }

  return (
    <span className="pirate-t-text" title={`Official: ${officialText}`}>
      {pirateText}
    </span>
  );
}
