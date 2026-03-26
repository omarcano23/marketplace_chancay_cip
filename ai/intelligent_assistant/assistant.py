from .prompt_templates import BASE_SYSTEM_PROMPT, USER_CONTEXT_PROMPT

def build_prompt(company, land, question):
    context = USER_CONTEXT_PROMPT.format(
        sector=company["sector"],
        activity=company["activity_type"],
        export_focus=company["export_focus"],
        zone=land["zone_type"],
        area_m2=land["area_m2"],
        distance_port_km=land["distance_port_km"]
    )

    return f"""
{BASE_SYSTEM_PROMPT}

{context}

Pregunta del usuario:
{question}
"""
