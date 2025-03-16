from pyspark.sql import SparkSession

# Initialize a Spark session
spark = SparkSession.builder.appName("ADRDetection").getOrCreate()

# Load data into a Spark DataFrame (you could load large Reddit datasets here)
df = spark.read.csv('reddit_posts.csv', header=True, inferSchema=True)

# Show DataFrame
df.show()
