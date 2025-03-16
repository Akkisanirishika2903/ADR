from flask import Flask, request, jsonify
from flask_cors import CORS
import praw
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from textblob import TextBlob

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Reddit API Credentials
reddit = praw.Reddit(
    client_id='x4oSy9aOTC178anrPe5Euw',
    client_secret='O3EPsOkrkl5U5skEW1CIPkorSgEo7A',
    user_agent='drug_review_fetcher by Ok-Kaleidoscope4960'
)

# Define ADR-related keywords
ADR_KEYWORDS = [
    "side effect", "adverse reaction", "allergy", "rash", "nausea", 
    "vomiting", "dizziness", "headache", "swelling", "fatigue", "pain", 
    "fever", "stomach ache", "blood pressure", "heart rate", "breathing issues"
]

# Initialize NLTK resources (Stopwords, Tokenizer, Stemmer)
nltk.download('stopwords')
nltk.download('punkt')
stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

# Preprocessing function for text
def preprocess_text(text):
    text = text.lower()  # Convert to lowercase
    words = word_tokenize(text)  # Tokenize the text into words
    words = [stemmer.stem(word) for word in words if word.isalpha() and word not in stop_words]  # Remove stopwords and stem words
    return ' '.join(words)

# Sentiment analysis function using TextBlob
def get_sentiment(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity
    if sentiment > 0:
        return "Positive"
    elif sentiment < 0:
        return "Negative"
    else:
        return "Neutral"

# Home route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the ADR Detection API. Use /get-adr-results?drug_name=<drug_name> to fetch ADR-related results."})

# Route to get ADR results
@app.route('/get-adr-results', methods=['GET'])
def get_adr_results():
    drug_name = request.args.get('drug_name', '').strip()
    subreddit_name = request.args.get('subreddit', 'all')  # Default to 'all' subreddit
    keyword_filter = request.args.get('keywords', '')  # Optional filter for keywords

    if not drug_name:
        return jsonify({"error": "Please provide a valid drug_name query parameter."}), 400

    try:
        # Fetch posts from the specified subreddit
        subreddit = reddit.subreddit(subreddit_name)
        posts = subreddit.search(drug_name, limit=5)  # Fetch top 5 relevant posts
        
        adr_results = []

        # Process the fetched posts
        for post in posts:
            post_comments = []
            post.comments.replace_more(limit=2)  # Prevent deep nested comments
            
            for comment in post.comments.list():
                comment_text = preprocess_text(comment.body)  # Preprocess text
                if any(keyword in comment_text for keyword in ADR_KEYWORDS):
                    # Optional: Filter by additional keyword if provided
                    if keyword_filter and keyword_filter not in comment_text:
                        continue
                    # Perform sentiment analysis
                    sentiment = get_sentiment(comment.body)
                    post_comments.append({
                        "comment": comment.body,
                        "sentiment": sentiment
                    })

            # Append only if relevant ADR comments are found
            if post_comments:
                adr_results.append({
                    "title": post.title,
                    "selftext": post.selftext if post.selftext else "No description available",
                    "comments": post_comments[:5]  # Limit to 5 relevant ADR comments
                })

        if not adr_results:
            return jsonify({"message": "No ADRs detected for this drug."}), 200

        return jsonify({"drug_name": drug_name, "adr_results": adr_results})

    except praw.exceptions.APIException as api_error:
        print(f"Reddit API Error: {str(api_error)}")  # Log the error
        return jsonify({"error": f"Reddit API Error: {str(api_error)}"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")  # Log the error
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
