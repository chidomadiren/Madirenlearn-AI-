export function formatTutorText(rawText = '') {
  try {
    if (rawText == null) return '';

    const source =
      typeof rawText === 'string'
        ? rawText
        : String(
            rawText?.text ??
              rawText?.reply ??
              rawText?.answer ??
              rawText?.message ??
              rawText?.response ??
              ''
          );

    if (!source.trim()) return '';

    return source
      .replace(/â€”|â€“/g, ' - ')
      .replace(/\$\$([\s\S]*?)\$\$/g, '$1')
      .replace(/\$([^$\n]+)\$/g, '$1')
      .replace(/\$/g, '')
      .replace(/^\s*#{1,6}\s*/gm, '')
      .replace(/\s+#{1,6}\s*/g, '\n')
      .replace(/`+/g, '')
      .replace(/(?<!\w)_{1,3}([^_]+)_{1,3}(?!\w)/g, '$1')
      .replace(/_+/g, '')
      .replace(
        /\s+(?=(?:Proper Nouns|Common Nouns|Abstract Nouns|Collective Nouns|Definition|Example|Step \d+|Rule \d+)[:\s])/gi,
        '\n- '
      )
      .replace(/\s+(?=\d+\.\s+[A-Z])/g, '\n')
      .replace(/\s+\*\s+(?=[A-Za-z0-9])/g, '\n- ')
      .replace(
        /([.!?])\s+(Can you |What do you think|How would you|Why do you think|What other |Would you like|Try )/g,
        '$1\n\n$2'
      )
      .replace(/\*+/g, '')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  } catch (err) {
    return String(rawText ?? '')
      .replace(/\*+|\$/g, '')
      .trim();
  }
}

export const formatChatGPTText = formatTutorText;
export default formatTutorText;
