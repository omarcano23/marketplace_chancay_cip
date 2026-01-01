def build_visual_prompt(company, land):
    return f"""
Vista aérea y a nivel de suelo de una operación industrial en la ZEEP Chancay.
Empresa del sector {company['sector']} con actividad {company['activity_type']}.

Terreno:
- Zona {land['zone_type']}
- Área aproximada {land['area_m2']} m2
- Cercanía al puerto de Chancay

Mostrar:
- Camiones operando
- Infraestructura moderna
- Flujo logístico eficiente
- Estilo realista, industrial, limpio
"""
