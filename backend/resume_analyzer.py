def analyze_resume(text):
    feedback = []
    score = 10  # Starting with perfect score, deduct for issues
    
    # Checking for required sections
    required_sections = {
        'education': ['education', 'academic background'],
        'experience': ['experience', 'work history', 'employment'],
        'skills': ['skills', 'technical skills'],
        'projects': ['projects', 'personal projects']
    }
    
    text_lower = text.lower()
    
    # Checking section presence
    for section, keywords in required_sections.items():
        found = any(keyword in text_lower for keyword in keywords)
        if not found:
            feedback.append(f"Missing section: {section.capitalize()}")
            score -= 1.5
    
    # Checking objective length
    objective_keywords = ['objective', 'summary', 'about']
    objective_found = any(f"{kw}:" in text_lower or f"{kw} " in text_lower for kw in objective_keywords)
    
    if objective_found:
        # Finding the objective section
        for kw in objective_keywords:
            if f"{kw}:" in text_lower:
                start = text_lower.index(f"{kw}:") + len(kw) + 1
                break
            elif f"{kw} " in text_lower:
                start = text_lower.index(f"{kw} ") + len(kw) + 1
                break
        
        # Finding the end of the objective (next section or end of text)
        next_sections = [text_lower.find(sec) for sec in ['\neducation', '\nexperience', '\nskills'] if sec in text_lower]
        end = min([pos for pos in next_sections if pos > start], default=len(text))
        
        objective_text = text[start:end].strip()
        if len(objective_text.split()) < 20:  # Less than 20 words
            feedback.append("Objective/Summary is too short. Consider expanding it to 30-50 words.")
            score -= 0.5
    
    # Check for buzzwords
    buzzwords = [
        'team player', 'problem solving', 'hard working', 
        'detail oriented', 'fast learner', 'self motivated'
    ]
    found_buzzwords = [word for word in buzzwords if word in text_lower]
    if found_buzzwords:
        feedback.append(f"Consider replacing overused phrases: {', '.join(found_buzzwords)}")
        score -= 0.5
    
    # Check resume length
    word_count = len(text.split())
    if word_count < 200:
        feedback.append("Resume might be too short. Consider adding more details.")
        score -= 1
    elif word_count > 800:
        feedback.append("Resume might be too long. Consider trimming unnecessary details.")
        score -= 0.5
    
    # Ensure score is within bounds
    score = max(0, min(10, score))
    
    return feedback, round(score, 1)