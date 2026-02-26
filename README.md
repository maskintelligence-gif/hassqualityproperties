<div align="center">

# 🏠 HASS Quality Properties
### The Ultimate Real Estate Management Platform for Premium Properties in Uganda.

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)
[![GitHub Issues](https://img.shields.io/github/issues/maskintelligence-gif/hassqualityproperties?style=flat-square&color=orange)](https://github.com/maskintelligence-gif/hassqualityproperties/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/maskintelligence-gif/hassqualityproperties?style=flat-square&color=green)](https://github.com/maskintelligence-gif/hassqualityproperties/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/maskintelligence-gif/hassqualityproperties?style=flat-square)](https://github.com/maskintelligence-gif/hassqualityproperties/commits/main)
[![Top Language](https://img.shields.io/github/languages/top/maskintelligence-gif/hassqualityproperties?style=flat-square&color=blueviolet)](https://github.com/maskintelligence-gif/hassqualityproperties)

[**Explore the Docs »**](https://github.com/maskintelligence-gif/hassqualityproperties) | [**View Demo »**](https://maskintelligence-gif.github.io/hassqualityproperties/#/) | [**Report Bug »**](https://github.com/maskintelligence-gif/hassqualityproperties/issues)

</div>

---

## 📖 Table of Contents
1. [About The Project](#-about-the-project)
    - [Built With](#-built-with)
2. [Key Features](#-key-features)
3. [Architecture & Project Structure](#-architecture--project-structure)
4. [Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
5. [Usage Guide](#-usage-guide)
6. [Roadmap](#-roadmap)
7. [Contributing](#-contributing)
8. [License](#-license)
9. [Contact](#-contact)
10. [Acknowledgments](#-acknowledgments)

---

## 🧐 About The Project

**HASS Quality Properties** is a high-performance, enterprise-grade real estate management ecosystem specifically engineered for the Ugandan market. Developed by **MASK INTELLIGENCE**, this platform bridges the gap between premium property owners and discerning buyers/renters through a sophisticated digital interface.

### The Problem
The Ugandan real estate market has traditionally relied on fragmented brokerage systems and informal listings, leading to transparency issues, outdated data, and poor user experiences for high-end clients.

### Our Solution
We have architected a centralized "Source of Truth" for premium listings. By leveraging a modern tech stack (React, TypeScript, and PostgreSQL), we ensure:
- **Data Integrity**: Type-safe operations across the entire stack.
- **Performance**: Optimized rendering and lightning-fast search queries.
- **Scalability**: A modular architecture ready to handle thousands of concurrent listings and inquiries.

### 🛠 Built With

*   ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) - Frontend UI Library
*   ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) - Type Safety & Developer Experience
*   ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) - Relational Database
*   ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) - Styling & Responsive Design
*   ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) - Modern ORM (Recommended for the stack)

---

## ✨ Key Features

### 🏢 Property Listing Management
Dynamic CRUD operations for properties. Admins can upload high-resolution images, set pricing tiers, and define specific property attributes (e.g., acreage, number of bedrooms, proximity to Kampala CBD).

### 🔍 Advanced Search & Filtering
A multi-faceted search engine allowing users to filter by:
- **Location**: Specific districts and suburbs within Uganda.
- **Price Range**: Flexible currency handling.
- **Property Type**: Commercial, Residential, or Land.
- **Status**: Available, Under Contract, or Sold.

### 📊 Admin Dashboard & Analytics
A comprehensive command center for stakeholders.
- **Inquiry Tracking**: Monitor lead conversion rates.
- **Inventory Overview**: Visual representation of property distribution.
- **User Activity**: Heatmaps of which properties are gaining the most traction.

### 🔐 User Authentication & Security
Implemented using industry-standard JWT protocols and encrypted password hashing, ensuring that sensitive client data and administrative controls remain secure.

### 📱 Responsive Web UI
A "Mobile-First" design philosophy ensuring that the platform looks stunning on everything from high-end desktop monitors to entry-level smartphones used by field agents.

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**: v18.x or higher
- **npm** or **pnpm**: v8.x or higher
- **PostgreSQL**: v14.x or higher (or Docker)
- **Git**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/maskintelligence-gif/hassqualityproperties.git
    cd hassqualityproperties
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or if using pnpm
    pnpm install
    ```

3.  **Database Setup**
    Ensure your PostgreSQL instance is running, then:
    ```bash
    # Run migrations to create tables
    npx prisma migrate dev
    # Seed the database with initial property types
    npm run seed
    ```

4.  **Start Development Server**
    ```bash
    npm run dev
    ```

### Environment Variables

Create a `.env` file in the root directory and populate it with the following:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://user:pass@localhost:5432/hass_db` |
| `JWT_SECRET` | Secret key for auth tokens | `your_super_secret_random_string` |
| `VITE_API_URL` | Frontend API endpoint | `http://localhost:5000/api` |
| `CLOUDINARY_URL` | Image hosting service URL | `cloudinary://api_key:api_secret@cloud_name` |

---

## 💡 Usage Guide

### Fetching Properties (API Example)
To fetch the latest premium listings from the backend:

```typescript
import axios from 'axios';

const fetchProperties = async (filter: string) => {
  try {
    const response = await axios.get(`/api/properties?category=${filter}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }
};
```

### Creating a New Listing (Admin)
The platform uses a multi-step form for property creation to ensure data completeness:
1. **Basic Info**: Title, Description, Price.
2. **Media**: Image uploads via Cloudinary.
3. **Location**: Integration with Google Maps API for precise coordinates.
4. **Publish**: Toggle visibility on the public marketplace.

---

## 🗺 Roadmap

- [ ]  **Phase 1**: Core MVP - Listing and Search functionality. (Completed)
- [ ]  **Phase 2**: Advanced Analytics Dashboard for Admins. (In Progress)
- [ ]  **Phase 3**: Integration with local Ugandan Payment Gateways (Flutterwave/Airtel/MTN).
- [ ]  **Phase 4**: AI-powered Property Valuation Tool.
- [ ]  **Phase 5**: Mobile App (React Native) for iOS and Android.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the **Unlicense**. See `LICENSE` for more information.

---

## 📞 Contact

[**MASK INTELLIGENCE**](https://mask-intelligence.web.app) / Lead Development Team

*   **Email**: maskintell1@gmail.com
*   **Tel**: +256 791715573
*   **Project Link**: [https://github.com/maskintelligence-gif/hassqualityproperties](https://github.com/maskintelligence-gif/hassqualityproperties)

---

## 💖 Acknowledgments

*   [Lucide React](https://lucide.dev/) - For the beautiful iconography.
*   [React Query](https://tanstack.com/query/latest) - For powerful data fetching.
*   [Shadcn/UI](https://ui.shadcn.com/) - For the accessible UI components.
*   [Prisma](https://www.prisma.io/) - For making database management effortless.

---
<div align="center">
    <i>Built with ❤️ in Uganda by MASK INTELLIGENCE.</i>
</div>