import os
import openai
import argparse


def main():
    argParser = argparse.ArgumentParser()
    argParser.add_argument("--input", "-i", type=str, required=True)
    args = argParser.parse_args()
    input = args.input
    print(f"Input : {input}")
    generate_instagram_caption(input)


def generate_instagram_caption(theme: str):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    prompt = f"Generate an instagram caption related to {theme} : "
    response = openai.Completion.create(
        engine="davinci-instruct-beta-v3", prompt=prompt, max_tokens=50)

    print(response["choices"][0]["text"].strip())


if __name__ == "__main__":
    main()
