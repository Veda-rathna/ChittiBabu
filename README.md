# PC Diagnosis Chatbot

This project is a web-based chatbot designed to help users diagnose and resolve PC issues. Built with Django, it integrates with an LMstudio-powered language model to provide interactive troubleshooting and step-by-step solutions.

## Features
- Interactive chat interface for describing PC problems
- AI-powered assistant asks targeted questions to identify issues
- Step-by-step solutions for user-fixable problems
- Professional service recommendations for complex issues
- Clean, readable formatting for all responses

## How It Works
1. User describes their PC issue in the chat interface.
2. The assistant asks follow-up questions to gather details.
3. After diagnosing, the assistant provides actionable steps or recommends professional help.

## Tech Stack
- **Backend:** Django
- **Frontend:** HTML, CSS, JavaScript
- **AI Model:** LMstudio (e.g., Llama-2-13b-chat)

## Setup Instructions
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Veda-rathna/ChittiBabu.git
   cd ChittiBabu
   ```
2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
3. **Run migrations:**
   ```sh
   python manage.py migrate
   ```
4. **Start the LMstudio server:**
   - Download and run LMstudio locally (see [LMstudio documentation](https://lmstudio.ai/)).
   - Ensure it is accessible at `http://127.0.0.1:1234/v1/chat/completions` or update the URL in `diagnosis/views.py`.
5. **Start the Django server:**
   ```sh
   python manage.py runserver
   ```
6. **Access the chatbot:**
   - Open your browser and go to `http://127.0.0.1:8000/diagnosis/chat/`

## File Structure
```
db.sqlite3
manage.py
diagnosis/
    views.py
    urls.py
    models.py
    templates/diagnosis/chat.html
    static/chat.css
    static/chat.js
pc_diagnosis/
    settings.py
    urls.py
    ...
```

## Customization
- **Model:** Change the model name in `diagnosis/views.py` (`llama-2-13b-chat`) to use a different LMstudio model.
- **System Prompt:** Edit the `SYSTEM_PROMPT` in `views.py` to adjust assistant behavior.

## License
This project is licensed under the MIT License.

## Acknowledgments
- [LMstudio](https://lmstudio.ai/) for local language model serving
- [Django](https://www.djangoproject.com/) for the web framework
