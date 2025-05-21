import React from "react";

interface HighlightProps {
  text: string;
  highlight: string;
}

/**
 * Component that highlights parts of text that match a search query
 */
export const Highlight: React.FC<HighlightProps> = ({ text, highlight }) => {
  // If no highlight text or it's less than 2 chars, just return the original text
  if (!highlight || highlight.length < 2) {
    return <>{text}</>;
  }

  // Case insensitive search
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark 
            key={i} 
            className="bg-transparent text-accent1-light dark:text-accent1-dark font-medium"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}; 

interface HighlightProps {
  text: string;
  highlight: string;
}

/**
 * Component that highlights parts of text that match a search query
 */
export const Highlight: React.FC<HighlightProps> = ({ text, highlight }) => {
  // If no highlight text or it's less than 2 chars, just return the original text
  if (!highlight || highlight.length < 2) {
    return <>{text}</>;
  }

  // Case insensitive search
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark 
            key={i} 
            className="bg-transparent text-accent1-light dark:text-accent1-dark font-medium"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}; 