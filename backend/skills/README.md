# Marketing Agent Skills Directory

This directory contains the core "Skills" (structured system prompts) that power the Autonomous Marketing Control Center.

## What is a Skill?
A skill is a highly optimized XML-based prompt that defines a specific capability of the agent. By isolating capabilities into individual XML files, we can update the agent's behavior without rewriting Python code, and we can easily map these files to tool-calling APIs (like OpenAI's Functions or Anthropic's Claude Tools).

## Included Skills
1. **`meta_skill_generator.xml`**: The "Skill to create skills". Use this prompt to generate new capabilities following our strict best practices.
2. **`ad_copy_generator.xml`**: An example of an applied skill. It uses the PAS (Problem, Agitate, Solution) framework to generate Meta Ads copy and image prompts for specific audiences.

## Adding a New Skill
1. Copy the contents of `meta_skill_generator.xml` into a ChatGPT/Claude interface.
2. Provide your idea (e.g., "I need a skill to analyze lead quality from a CRM webhook").
3. Save the resulting XML output into this folder as `new_skill_name.xml`.
