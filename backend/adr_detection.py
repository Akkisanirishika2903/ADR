import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Download necessary NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

# Sample Reddit post (replace with actual Reddit data)
post_text = "I took Aspirin and now I have a headache and nausea."

# Tokenize and clean the text
tokens = word_tokenize(post_text)
cleaned_tokens = [word.lower() for word in tokens if word.isalpha()]
stop_words = set(stopwords.words('english'))
cleaned_tokens = [word for word in cleaned_tokens if word not in stop_words]

# Define ADR terms
adr_terms = ["headache", "nausea", "dizziness", "rash", "vomiting", "fatigue"]

# This function should analyze text and detect ADRs
def detect_adr(post_text):
    # If post_text is a list, join it into a string
    if isinstance(post_text, list):
        post_text = " ".join(post_text)
    
    print("Input text:", post_text)  # Debugging: Print the text being analyzed
    adr_keywords = ["headache", "nausea", "vomiting"]
    detected_adrs = [word for word in adr_keywords if word in post_text.lower()]
    return detected_adrs if detected_adrs else "No ADRs detected."


# Detect ADRs in the cleaned post tokens
adr_found = detect_adr(cleaned_tokens)
print(f"Detected ADRs: {adr_found}")
