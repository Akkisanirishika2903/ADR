const fetchRedditData = async () => {
    const response = await fetch('http://localhost:5000/api/reddit_data');
    const data = await response.json();
    return data;
  };
  