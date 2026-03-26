from ai.intelligent_assistant.assistant import build_prompt
from ai.intelligent_assistant.mock_llm import mock_llm
from ai.intelligent_assistant.knowledge_loader import load_knowledge

# 1. Cargar conocimiento (solo para validar que existe)
docs = load_knowledge()
print(f"Documentos cargados: {len(docs)}")

# 2. Mock de empresa y terreno
company = {
    "sector": "Agroindustria",
    "activity_type": "Procesamiento",
    "export_focus": "Alta"
}

land = {
    "zone_type": "Industrial",
    "area_m2": 3000,
    "distance_port_km": 4.2
}

# 3. Pregunta real de negocio
question = "¿Esta empresa puede operar bajo régimen ZEEP y qué beneficios tendría?"

# 4. Construir prompt
prompt = build_prompt(company, land, question)

print("\n--- PROMPT GENERADO ---\n")
print(prompt)

# 5. Simular respuesta IA
response = mock_llm(prompt)

print("\n--- RESPUESTA IA (SIMULADA) ---\n")
print(response)
