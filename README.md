🚀 Playwright-AI Assisted Test Automation Framework (Modern Automation Framework)

A scalable Playwright Test Automation Framework built using TypeScript + Page Object Model (POM) for testing Travel & E-commerce applications.
⚡ Built using Playwright MCP with GitHub Copilot to enhance productivity and intelligent automation development.





📌 Project Overview

This repository demonstrates a real-world automation framework using Playwright with best practices like:

✅ Page Object Model (POM)
✅ Reusable test components
✅ Cross-browser testing support
✅ Clean and maintainable structure
✅ API + UI Testing capability







🤖 AI-assisted development using GitHub Copilot + Playwright MCP
🧠 Key Features
🔹 End-to-End UI Automation using Playwright
🔹 POM-based architecture for scalability
🔹 Supports Flight Search (Travel Domain) scenarios
🔹 API Testing included (api.spec.ts)
🔹 Screenshot validation (logo.spec.ts)
🔹 Parallel execution support
🔹 Easy debugging and reporting
🔹 AI-powered code assistance using GitHub Copilot








📂 Project Structure
Playwright-MCP/
│── tests/
│   ├── pages/
│   │   └── flightSearchPage.ts     # Page Object Model
│   ├── api.spec.ts                # API Test
│   ├── flight-search.spec.ts      # UI Test
│   ├── flight-search.pom.spec.ts  # POM-based Test
│   ├── logo.spec.ts               # UI validation
│   └── logo-screenshot.png
│
│── playwright.config.ts           # Playwright Config
│── package.json                   # Dependencies
│── .gitignore






🧪 Sample Test Scenario

✔️ Flight Search (Round Trip)

Select round-trip option
Add passengers (2 travelers)
Choose cabin class (Economy)
Enter From: London (LHR)
Enter To: New York (JFK)
Select departure & return dates
Validate search results






⚙️ Tech Stack
🟦 TypeScript
🎭 Playwright
🧪 Playwright Test Runner
🌐 Node.js
🤖 GitHub Copilot (AI-assisted coding)
⚡ Playwright MCP







▶️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/ArpitChoubey/Playwright-MCP.git
cd Playwright-MCP
2️⃣ Install Dependencies
npm install
3️⃣ Install Playwright Browsers
npx playwright install
🚀 Run Tests
Run All Tests
npx playwright test
Run Specific Test
npx playwright test tests/flight-search.pom.spec.ts
Run in Headed Mode
npx playwright test --headed
📊 Reporting
npx playwright show-report
Interactive HTML Reports
Screenshots on failure
Trace viewer support





💡 Why This Project Stands Out

✔️ Real-world use case (Travel domain)
✔️ Industry-standard framework design
✔️ Clean POM implementation
✔️ API + UI coverage
✔️ AI-assisted modern development (Copilot + MCP)
✔️ Easy to extend for enterprise projects

🔥 Future Enhancements
CI/CD Integration (GitHub Actions)
Data-driven testing
Environment-based config
Docker integration
Advanced reporting (Allure)
🤝 Contribution

Contributions are welcome!
Feel free to fork, improve, and raise PRs 🚀

👨‍💻 Author

Arpit Choubey
SDET | QA | Automation Engineer

🔗 LinkedIn: https://www.linkedin.com/in/arpitchoubey/

✍️ Medium: https://medium.com/@ArpitChoubey9

⭐ Support

If this repository helped you, please ⭐ star it to support and motivate further contributions in it.
