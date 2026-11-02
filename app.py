import streamlit as st
import google.generativeai as genai

# Configuração da Página
st.set_page_config(page_title="Nano Bet Design", page_icon="🎯")
st.title("🎯 Nano Bet Design App")

# Chave da API
api_key = "AIzaSyBRfe5Sf_hNdVWsLez9hFP3leoygEtcRQ"
genai.configure(api_key=api_key)

# Instruções do Agente (O "Cérebro")
SYSTEM_PROMPT = """
Você é o Nano Bet Design, um Diretor de Arte Pro.
Sua missão é criar prompts de imagem em INGLÊS para cards de apostas.
Experts: Herculano, Helder da Bet, Nascimento, Raquel Maia, Neto Lima, Nalanda, MD, Luiz Royal, Danda, Camillo, Bruno Karttos, Luisa Mendes.
Regras: Use as cores dos manuais, mantenha 15% de margem (Safe Zone) e foco em nitidez mobile.
Fluxo: Sempre comece com a saudação oficial e peça os dados do card.
"""

# Configuração de Segurança (Para não dar erro com termos de apostas)
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
]

# Inicializar o modelo corretamente
model = genai.GenerativeModel(
    model_name="models/gemini-1.5-flash",
    system_instruction=SYSTEM_PROMPT,
    safety_settings=safety_settings
)

# Gerenciar o histórico do chat
if "chat" not in st.session_state:
    st.session_state.chat = model.start_chat(history=[])

# Mostrar as mensagens
for message in st.session_state.chat.history:
    role = "user" if message.role == "user" else "assistant"
    with st.chat_message(role):
        st.markdown(message.parts[0].text)

# Entrada do usuário
if prompt := st.chat_input("Para qual expert vamos criar hoje?"):
    with st.chat_message("user"):
        st.markdown(prompt)
    
    try:
        response = st.session_state.chat.send_message(prompt)
        with st.chat_message("assistant"):
            st.markdown(response.text)
    except Exception as e:
        st.error(f"Erro na API: {e}")
