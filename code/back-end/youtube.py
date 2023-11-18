from googleapiclient.discovery import build
from transformers import pipeline

# Replace 'YOUR_API_KEY' with your actual API key
API_KEY = 'AIzaSyBfnqL3eTT9Ihxy7uu_VoEdRR3EdCTVeq0'

# Create a service object for the YouTube Data API
youtube = build('youtube', 'v3', developerKey=API_KEY)


search_query = input("Enter your video choice: ")
search_response = youtube.search().list(
    q=search_query,
    type='video',
    part='id',
    maxResults=5  
).execute()

top_rated_videos = []
for search_result in search_response.get('items', []):
    video_id = search_result['id']['videoId']
    video_response = youtube.videos().list(
        id=video_id,
        part='snippet,statistics'
    ).execute()

    video_data = video_response.get('items', [])[0]
    video_info = {
        'title': video_data['snippet']['title'],
        'url': f'https://www.youtube.com/watch?v={video_id}',
        'views': int(video_data['statistics']['viewCount']),
        'likes': int(video_data['statistics']['likeCount']),
        'comments': int(video_data['statistics']['commentCount'])
    }
    video_info['total_count'] = video_info['likes'] + video_info['comments'] + video_info['views']
    top_rated_videos.append(video_info)

top_rated_videos.sort(key=lambda x: x['total_count'], reverse=True)

classifier = pipeline('sentiment-analysis', model="nlptown/bert-base-multilingual-uncased-sentiment")

TOXICITY_THRESHOLD = 0.54

print("Top-rated videos based on total count (likes + comments + views):\n")
for idx, video_info in enumerate(top_rated_videos[:5], start=1):
    comment_text = video_info['title']  
    toxicity_prediction = classifier(comment_text)[0]

    if toxicity_prediction['score'] >= TOXICITY_THRESHOLD:
        video_info['comment_type'] = 'Bad'
        threshold_percentage = round(toxicity_prediction['score'] * 100)
        complement_percentage = 100 - threshold_percentage
    else:
        video_info['comment_type'] = 'Good'
        complement_percentage = round(toxicity_prediction['score'] * 100)
        threshold_percentage = 100 - complement_percentage

    print(f"Video {idx}: {video_info['title']}")
    print(f"   URL: {video_info['url']}")
    print(f"   Views: {video_info['views']}")
    print(f"   Likes: {video_info['likes']}")
    print(f"   Comments: {video_info['comments']}")
    print(f"   Total Count: {video_info['total_count']}")
    print(f"   Percentage of Bad comments: {threshold_percentage}%")
    print(f"   Percentage of Good comments: {complement_percentage}%")
    print()
