from .prompt_templates import build_visual_prompt

def generate_simulation_prompt(company, land):
    prompt = build_visual_prompt(company, land)

    return {
        "prompt": prompt,
        "resolution": "1024x1024",
        "style": "realistic"
    }
