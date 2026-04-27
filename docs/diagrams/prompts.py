FLOWCHART_PROMPT = """
Please generate a YAML specification file for draw.io diagramming based on the following description.
This file will be used by drawio-skill and must strictly adhere to its "Design System 2.0" format.
Requirements:
- Break down the flow logic into multiple layers (groups/swimlanes), reflecting a clear hierarchical structure with series/parallel block arrangements.
- Extract decision branches, parallel states, key arrows, and other logic as independent nodes or edges.
- The output must be valid YAML, with a root structure containing both `meta` and `spec` sections.
  - `meta`: Contains basic diagram information such as title, theme, layout, complexity, etc.
  - `spec`: Contains `nodes` and `edges` arrays, defining all graphical elements and connectors.

Flow description:
{ASCII_Diagram}

Provide the complete YAML code block without additional explanation.
"""

