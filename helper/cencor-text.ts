export const censorText = (userInput: string) => {
  const censoredInput = `${userInput.slice(0, 5)}****${userInput.slice(-4)}`;

  return censoredInput;
};
