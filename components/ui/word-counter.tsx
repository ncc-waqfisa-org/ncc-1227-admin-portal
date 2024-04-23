import React from "react";
import { cn } from "../../src/utils";
import { useTranslation } from "react-i18next";

interface WordCounterProps {
  value: string | undefined | null;
  maxWords: number;
}

const WordCounter: React.FC<WordCounterProps> = ({ value, maxWords }) => {
  const { t } = useTranslation("common");
  // Function to count words
  const countWords = (text: string) => {
    return text.split(/\s+/).filter(Boolean).length; // Split by whitespace and filter out empty strings
  };

  const wordCount = countWords(value ?? "");

  return (
    <div className={cn(wordCount > maxWords && "text-error")}>
      {wordCount}/{maxWords} {t("words")}
    </div>
  );
};

export default WordCounter;
