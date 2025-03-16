import praw
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Reddit API credentials from .env
client_id = os.getenv('x4oSy9aOTC178anrPe5Euw')
client_secret = os.getenv('O3EPsOkrkl5U5skEW1CIPkorSgEo7A')
user_agent = os.getenv('user_agent": "python:drug_review_fetcher:1.0 (by /u/Ok-Kaleidoscope4960')

# Initialize PRAW with your credentials
reddit = praw.Reddit(client_id=client_id, client_secret=client_secret, user_agent=user_agent)

# Fetch Reddit posts based on a drug name
def fetch_reddit_data():
    subreddit_name = "Drugs"
    drug_name = "Aspirin"
    posts = reddit.subreddit(subreddit_name).search(drug_name, limit=10)

    reddit_posts = [{'title': post.title, 'url': post.url} for post in posts]
    return reddit_posts
