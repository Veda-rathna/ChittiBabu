

from django.shortcuts import render
from django.http import JsonResponse
import requests
from django.views.decorators.csrf import csrf_exempt

# LMstudio server URL (update this to your actual LMstudio endpoint)
LMSTUDIO_URL = 'http://127.0.0.1:1234/v1/chat/completions'

# Initial system prompt for diagnosis
SYSTEM_PROMPT = (
	"You are a helpful assistant specialized in diagnosing PC issues. "
	"The user will describe their problem in vague or general terms. "
	"Your job is to ask a series of clear, targeted questions to gather more details, identify the root cause, and then provide an accurate, step-by-step solution. "
	"If the issue is fixable by the user, provide clear, actionable steps. If it is not fixable by the user, politely recommend visiting a professional service center. "
	"Always format your answers so that each bullet point or numbered step appears on a new line, using explicit line breaks (\\n) after each item. "
	"Be patient, concise, and guide the user toward resolving their issue."
)

def chat(request):
	return render(request, 'diagnosis/chat.html')

@csrf_exempt
def message_api(request):
	if request.method == 'POST':
		user_message = request.POST.get('message', '')
		chat_history = request.session.get('chat_history', [])
		if not chat_history:
			chat_history.append({'role': 'system', 'content': SYSTEM_PROMPT})
		chat_history.append({'role': 'user', 'content': user_message})
		# Send to LMstudio
		payload = {
			'model': 'llama-2-13b-chat',
			'messages': chat_history,
			'max_tokens': 256,
			'temperature': 0.7
		}
		try:
			response = requests.post(LMSTUDIO_URL, json=payload, timeout=120)
			data = response.json()
			assistant_message = data['choices'][0]['message']['content']
		except Exception as e:
			assistant_message = f"Error contacting diagnosis model: {e}"
		chat_history.append({'role': 'assistant', 'content': assistant_message})
		request.session['chat_history'] = chat_history
		return JsonResponse({'message': assistant_message})
	return JsonResponse({'error': 'Invalid request'}, status=400)
