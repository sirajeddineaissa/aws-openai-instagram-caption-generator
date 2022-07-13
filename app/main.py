import os
from typing import List
import openai
import argparse
import re


def main():
    argParser = argparse.ArgumentParser()
    argParser.add_argument("--input", "-i", type=str, required=True)
    args = argParser.parse_args()
    input = args.input
    print(f"Input : {input}")
    caption_result = generate_instagram_caption(input)
    related_words_result = generate_related_words(input)
    print(caption_result)
    print(related_words_result)


def generate_related_words(theme: str) -> List[str]:
    # Load the API key generated from OpenAPI
    openai.api_key = os.getenv("OPENAI_API_KEY")

    prompt = f"Generate related caption words to {theme} : "
    response = openai.Completion.create(
        model="text-davinci-002", prompt=prompt, max_tokens=100)
    words = response["choices"][0]["text"]
    words = words.strip()

    words_list = re.split("-|,|\n", words)

    # Clean generated list of words
    words_list = [w.upper() for w in words_list if len(w)]

    return words_list


def generate_instagram_caption(theme: str) -> str:
    # Load the API key generated from OpenAPI
    openai.api_key = os.getenv("OPENAI_API_KEY")

    prompt = f"Generate an instagram caption related to {theme} : "
    response = openai.Completion.create(
        engine="davinci-instruct-beta-v3", prompt=prompt, max_tokens=50)
    caption = response["choices"][0]["text"]

    # Clean generated caption
    caption = caption.strip()

    return caption


if __name__ == "__main__":
    main()
