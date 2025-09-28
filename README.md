# Zenith Finance

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/simulanics/ZenithExpenseTracker)

Zenith Finance is a modern, minimalist personal finance tracker designed for clarity and ease of use. It empowers users to effortlessly track their income and expenses through a clean, intuitive interface. The core of the application is an AI-powered analytics engine, utilizing the high-speed Groq API, which provides users with intelligent insights and actionable suggestions to improve their financial health. The application features a central dashboard for a quick financial overview, detailed transaction logs, visual analytics reports, and a dedicated AI chat interface for personalized financial advice. The entire experience is crafted to be visually stunning, responsive, and calming, transforming financial management from a chore into an empowering activity.

## Key Features

-   **Effortless Transaction Tracking**: Quickly add and view all your income and expenses.
-   **AI-Powered Analytics**: Gain intelligent insights and actionable suggestions powered by the Groq API.
-   **At-a-Glance Dashboard**: A central hub for your current balance, monthly summaries, and recent activity.
-   **Detailed Transaction History**: A comprehensive, sortable, and filterable log of all your transactions.
-   **Visual Reports**: Understand your financial health with beautiful, easy-to-read charts and graphs.
-   **Interactive AI Chat**: Ask natural language questions about your finances and get personalized advice.
-   **Minimalist & Responsive Design**: A clean, beautiful, and intuitive interface that works flawlessly on any device.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **UI Components**: shadcn/ui, Framer Motion, Recharts, Lucide React
-   **State Management**: Zustand
-   **Forms & Validation**: React Hook Form & Zod
-   **Backend**: Cloudflare Workers & Hono
-   **AI Integration**: Groq API

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/zenith_finance_tracker.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd zenith_finance_tracker
    ```

3.  **Install dependencies:**
    ```sh
    bun install
    ```

4.  **Set up environment variables:**

    Create a `.dev.vars` file in the root of the project for local development. You will need to get the necessary API keys and credentials.

    ```ini
    # .dev.vars

    # Cloudflare AI Gateway URL and Key
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"

    # Groq API Key (for Phase 2)
    # GROQ_API_KEY="your-groq-api-key"
    ```

## Running the Development Server

To start the local development server, which includes both the Vite frontend and the Cloudflare Worker backend, run:

```sh
bun dev
```

The application will be available at `http://localhost:3000`. The frontend will automatically reload as you make changes.

## Usage

Once the application is running, you can start tracking your finances:

1.  **Dashboard**: The main page provides a summary of your finances.
2.  **Add Transaction**: Click the "Add Transaction" button to open a form where you can input income or expenses.
3.  **View Transactions**: Navigate to the "Transactions" page to see a complete history of your financial activities.
4.  **Analyze**: Go to the "Analytics" page to see visual representations of your spending and income habits.
5.  **Chat with AI**: Use the "AI Chat" page to ask for financial advice based on your data.

## Deployment to Cloudflare

This project is configured for easy deployment to Cloudflare's global network.

1.  **Login to Cloudflare:**
    If you haven't already, log in to your Cloudflare account via the command line:
    ```sh
    bun wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the application and deploy it to your Cloudflare account.
    ```sh
    bun run deploy
    ```

Wrangler will handle the process of uploading your assets and worker script. Once complete, it will provide you with the URL to your live application.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/simulanics/ZenithExpenseTracker)

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.