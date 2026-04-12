# Agent Context & Memory: Marketing Hub Skills Development

This file serves as the memory and context for any AI development agent (like Jules) working on the Autonomous Marketing Control Center.

## Objective
To develop and manage "skills" (prompts, capabilities, and tool definitions) for the autonomous marketing agent following current best practices in agentic development, prompt engineering, and structured system prompts.

## Principles & Best Practices

### 1. Prompt Engineering (from DAIR.AI)
*   **Be clear and specific:** Use direct language. Avoid ambiguity.
*   **Use Delimiters:** Always use XML tags (`<instructions>`, `<example>`, `<context>`) to separate different parts of the prompt.
*   **Provide Context:** Give the model enough background information to perform the task.
*   **Few-Shot Prompting:** Provide examples of the expected input and output format.
*   **Chain of Thought (CoT):** Encourage the model to think step-by-step (`<thinking>` tag) before providing the final answer (`<output>` tag).
*   **Specify the Output Format:** Explicitly state if you want JSON, Markdown, a specific XML tag, etc.

### 2. Structured System Prompts (from Daniel Rosehill)
Every skill should be defined as a structured system prompt. A good skill structure includes:
*   `[Role/Persona]`: Who is the AI supposed to be? (e.g., Expert Automotive Copywriter).
*   `[Objective]`: What is the primary goal of this skill?
*   `[Rules/Constraints]`: What must the AI *never* do? What are the boundaries? (e.g., Zero Trust, HITL rules).
*   `[Context/Variables]`: What dynamic information will be injected?
*   `[Output Format]`: The exact expected output.

### 3. Open Claude Tool Constraints (Skills Format)
Skills should be designed so they can easily be mapped to Claude's Tool Calling API.
*   Each skill should have a clear `name` and `description`.
*   Input parameters should be defined as a JSON schema object.
*   The system prompt should use XML to encapsulate the logic.

### 4. Marketing Domain Expertise (from Corey Haines)
When creating marketing skills (like Ad Copy Generation, Audience Targeting):
*   Focus on frameworks like PAS (Problem, Agitate, Solution) or AIDA (Attention, Interest, Desire, Action).
*   Emphasize benefits over features.
*   Consider the buyer's journey (Awareness, Consideration, Decision).

## The Meta-Skill: Creating New Skills
We use a "Skill to Create Skills". When asked to create a new skill, use the `backend/skills/meta_skill_generator.xml` prompt. It acts as an expert prompt engineer to construct a highly optimized, structured system prompt for the new marketing capability.
