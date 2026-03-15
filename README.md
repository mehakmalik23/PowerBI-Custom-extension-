# PowerBI-Custom-extension-# AI Data Assistant for Power BI

This project implements a custom Power BI visual that allows users to query data using natural language. The system extracts data from a Power BI dataset and sends it to an AI backend for analysis and visualization recommendation.

## Components

### 1. Power BI Custom Visual
Developed using TypeScript and Power BI Visual Tools.

Files:
- src/visual.ts
- src/settings.ts
- pbiviz.json

### 2. AI Backend
Implemented using Python Flask and OpenAI API.

Features:
- Natural language query processing
- Dataset analysis
- Visualization recommendation

Files:
- smartQA-backend/app.py
- smartQA-backend/requirements.txt

### Workflow
1. User enters natural language query
2. Dataset is extracted from Power BI
3. Query and dataset sent to AI backend
4. AI recommends chart type
5. Visualization displayed in Power BI

## Technologies Used
- Power BI Custom Visual SDK
- TypeScript
- Python Flask
- OpenAI API
