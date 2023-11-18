from flask import Flask, request, jsonify
from googleapiclient.discovery import build
from flask_cors import CORS
from transformers import pipeline  # Import the pipeline module for sentiment analysis

app = Flask(__name__)
CORS(app)
API_KEY = 'AIzaSyBfnqL3eTT9Ihxy7uu_VoEdRR3EdCTVeq0'

# Load pre-trained BERT model for text classification
classifier = pipeline('sentiment-analysis', model="nlptown/bert-base-multilingual-uncased-sentiment")

@app.route('/')
def index():
    return "Welcome to the YouTube search API"

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()  
    search_query = data.get('search_query')  

    youtube = build('youtube', 'v3', developerKey=API_KEY)
    search_response = youtube.search().list(
        q=search_query,
        type='video',
        part='id',
        maxResults=5
    ).execute()

    videos = []
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

        
        comment_text = video_info['title']  
        toxicity_prediction = classifier(comment_text)[0]
        video_info['toxicity_score'] = toxicity_prediction['score']
        
        print(f"Toxicity prediction for video '{video_info['title']}': {toxicity_prediction}")
        if toxicity_prediction['score'] >= 0.54:
            video_info['comment_type'] = 'Bad'
            threshold_percentage = round(toxicity_prediction['score'] * 100)
            complement_percentage = 100 - threshold_percentage
        else:
            video_info['comment_type'] = 'Good'
            complement_percentage = round(toxicity_prediction['score'] * 100)
            threshold_percentage = 100 - complement_percentage

        video_info['threshold_percentage'] = threshold_percentage
        video_info['complement_percentage'] = complement_percentage

        videos.append(video_info)
        print(video_info)
    videos.sort(key=lambda x: x['total_count'], reverse=True)

    return jsonify(videos)

if __name__ == '__main__':
    app.run(debug=True)
