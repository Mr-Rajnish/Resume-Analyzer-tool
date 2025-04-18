from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
from resume_analyzer import analyze_resume
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.pdf'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        
        # Extract text from PDF
        text = ""
        with fitz.open(filepath) as doc:
            for page in doc:
                text += page.get_text()
        
        # Analyze the resume text
        feedback, score = analyze_resume(text)
        
        return jsonify({
            'score': score,
            'feedback': feedback,
            'text': text  # Optional: return extracted text for debugging
        })
    
    return jsonify({'error': 'Invalid file format. Please upload a PDF.'}), 400

if __name__ == '__main__':
    app.run(debug=True)