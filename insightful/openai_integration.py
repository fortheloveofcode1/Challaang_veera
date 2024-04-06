import requests
import json

# Set your OpenAI API key
api_key = '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'

def call_openai_api(aggregated_summary):
    # Define the endpoint URL
    print("in the openai api function")
    url = 'https://api.openai.com/v1/chat/completions'

    # Define the request headers
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    # Define the request payload
    payload = {
        "model": "text-davinci-002",
        "messages": [{"role": "user", "content": aggregated_summary}],
        "temperature": 0.5  # Adjust the temperature as needed
    }

    # Make the POST request to the OpenAI API
    response = requests.post(url, headers=headers, json=payload)

    # Print out the response status code
    print("Response status code:", response.status_code)

    # Parse the response JSON
    data = response.json()

    # Print out the response data for debugging
    print("Response data:", data)

    # Extract the generated text from the response
    try:
        generated_text = data['choices'][0]['message']['content']
        # Split the text into sentences while preserving the delimiter '.'
        sentences = generated_text.split('. ')
        # Concatenate sentences if needed
        formatted_sentences = []
        for i in range(len(sentences)):
            if i > 0 and sentences[i][0].islower():
                formatted_sentences[-1] += '. ' + sentences[i]
            else:
                formatted_sentences.append(sentences[i])
        print(formatted_sentences)
        return formatted_sentences
    except KeyError:
        print("Error: Response does not contain the expected structure.")
        return None

