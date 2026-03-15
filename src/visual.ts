"use strict";

import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;

import Chart from "chart.js/auto";

export class Visual implements IVisual {

    private target: HTMLElement;
    private questionInput: HTMLInputElement;
    private askButton: HTMLButtonElement;
    private resultDiv: HTMLDivElement;
    private canvas: HTMLCanvasElement;

    private dataset: any[] = [];
    private chart: any;

    constructor(options: VisualConstructorOptions) {

        this.target = options.element;
        this.target.innerHTML = "";

        const container = document.createElement("div");
        container.style.fontFamily = "Segoe UI";
        container.style.padding = "10px";

        const title = document.createElement("h3");
        title.innerText = "🤖 AI Data Assistant";

        this.questionInput = document.createElement("input");
        this.questionInput.type = "text";
        this.questionInput.placeholder = "Ask a question about your data";
        this.questionInput.style.width = "100%";
        this.questionInput.style.padding = "6px";

        this.askButton = document.createElement("button");
        this.askButton.innerText = "Ask";
        this.askButton.style.marginTop = "8px";

        this.resultDiv = document.createElement("div");
        this.resultDiv.style.marginTop = "10px";

        this.canvas = document.createElement("canvas");
        this.canvas.style.marginTop = "15px";

        container.appendChild(title);
        container.appendChild(this.questionInput);
        container.appendChild(this.askButton);
        container.appendChild(this.resultDiv);
        container.appendChild(this.canvas);

        this.target.appendChild(container);

        this.askButton.onclick = async () => {

            const question = this.questionInput.value;

            if (!question || this.dataset.length === 0) {
                this.resultDiv.innerHTML = "⚠ Please add data and ask a question.";
                return;
            }

            this.resultDiv.innerHTML = "⏳ Asking AI...";

            try {

                const response = await fetch("http://127.0.0.1:5000/ask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: question,
                        data: this.dataset
                    })
                });

                const result = await response.json();

                this.resultDiv.innerHTML = `
                    <h4>AI Insight</h4>
                    <b>Recommended Chart:</b> ${result.chart}<br/>
                    <b>Category:</b> ${result.category}<br/>
                    <b>Measure:</b> ${result.measure}<br/><br/>
                    ${result.insight}
                `;

                this.renderChart(result.chart);

            } catch (error) {

                this.resultDiv.innerHTML = "⚠ Unable to connect to AI backend";

            }

        };

    }

    private renderChart(chartType: string) {

        if (this.chart) {
            this.chart.destroy();
        }

        let type = "bar";

        if (chartType.toLowerCase().includes("line")) {
            type = "line";
        }

        if (chartType.toLowerCase().includes("pie")) {
            type = "pie";
        }

        this.chart = new Chart(this.canvas, {

            type: type as any,

            data: {

                labels: this.dataset.map(d => d.category),

                datasets: [{
                    label: "Value",
                    data: this.dataset.map(d => d.value),
                    borderWidth: 1
                }]

            },

            options: {
                responsive: true
            }

        });

    }

    public update(options: VisualUpdateOptions) {

        if (!options.dataViews || !options.dataViews[0]) {
            return;
        }

        const dataView: DataView = options.dataViews[0];

        if (!dataView.categorical) {
            return;
        }

        const categories = dataView.categorical.categories;
        const values = dataView.categorical.values;

        if (!categories || !values || categories.length === 0 || values.length === 0) {
            return;
        }

        const categoryData = categories[0].values;
        const measureData = values[0].values;

        this.dataset = categoryData.map((cat, i) => ({
            category: cat,
            value: measureData[i]
        }));

    }

}