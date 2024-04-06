from flask import Flask, render_template, request
import requests
from bs4 import BeautifulSoup
from googlesearch import search
from transformers import pipeline
from openai_integration import call_openai_api
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)

# Initialize the summarization pipeline
summarizer = pipeline("summarization")

def process_url(url):
    try:
        response = requests.get(url, timeout=5)
        if response.status_code != 200:
            print(f"Error: Received status code {response.status_code} for URL: {url}")
            return None
        soup = BeautifulSoup(response.text, 'html.parser')
        # Extract relevant text from the HTML
        text_content = ' '.join([p.get_text() for p in soup.find_all('p')])
        # Split the text into chunks to avoid token indices sequence length error
        chunks = [text_content[i:i+1000] for i in range(0, len(text_content), 1000)]
        # Use the summarizer here
        summaries = [summarizer(chunk, max_length=60, min_length=30, do_sample=False)[0]['summary_text'] for chunk in chunks]
        return ' '.join(summaries)
    except Exception as e:
        print(f"Error processing URL: {url}: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search')
def search_and_summarize():
    query = request.args.get('query')
    seo_query = f"{query} -site:wikipedia.org"
    
    # Use the query to fetch search results
    search_results = list(search(query, num=10, stop=10))

    summaries = []
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = executor.map(process_url, search_results)
        for result in results:
            if result is not None:
                summaries.append(result)

    # Combine the summaries into one aggregated summary
    aggregated_summary = ' '.join(summaries)[:1000]
    print(aggregated_summary)
    
    # Call the OpenAI API only if the aggregated summary is not empty
    if aggregated_summary:
        openai_generated_text = call_openai_api(aggregated_summary)
        return openai_generated_text
    else:
        return "No valid summary to generate text from."

if __name__ == '__main__':
    app.run(debug=True)
