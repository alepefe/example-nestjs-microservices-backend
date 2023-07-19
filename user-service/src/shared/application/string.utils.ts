function camelToSnake (str: string): string {
  let snakeCase = '';
  let previousCharWasLowerCase = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === char.toUpperCase()) {
      if (previousCharWasLowerCase) {
        snakeCase += '_';
      }
      snakeCase += char.toLowerCase();
      previousCharWasLowerCase = false;
    } else {
      snakeCase += char;
      previousCharWasLowerCase = true;
    }
  }

  return snakeCase;
}

function snakeToCamel (str: string): string {
  return str.replace(/_([a-z])/g, function (_, letter) {
    return letter.toUpperCase();
  });
}

const StringUtils = {
  camelToSnake,
  snakeToCamel
} as const;

export default StringUtils;
