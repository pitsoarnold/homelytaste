# Homely Taste Bakery

Create a premium, elegant single-page bakery website named "Homely Taste".

Design & Branding:
Use a color palette of rich dark brown (like #2b1a12), cream (like #f5f1e8), and elegant gold (like #d4af37) to match the brand logo. Use the logo at [INSERT_LOGO_URL_HERE] in the header. Adopt a clean, modern layout with large rounded corners, subtle shadows, and high-quality food photography of cakes and pastries, heavily inspired by high-end bakery websites.

Key Navigation and Sections:

Header: Logo on left, Navigation links (Home, Menu, About, Contact) in center, and a prominent "Order via WhatsApp" button on the right.

Notice Banner: Place a prominent, eye-catching banner at the top of the page (and inside the cart/modal) stating: "Please place your order at least 2 days before the day you need your baked goods."

Hero Section: Headline "Handcrafted Delights for Every Occasion". A large "Explore Menu" button and a "Chat on WhatsApp" button.

Bestsellers Section: A grid of product cards (e.g., Chocolate Fudge Cake, Red Velvet Cupcakes, Butter Croissant).

WhatsApp Ordering System (No Cart):
Do not include a traditional checkout or payment system. Instead, when a user clicks an "Order" button on a product card, open a modal that reminds them of the 2-day notice. Inside the modal, have a specific button that says "Place Order on WhatsApp".

Critical Backend Logic: When clicked, this button must open a pre-filled WhatsApp chat to the number +266 62119056 containing a message like: "Hello Homely Taste! I would like to order [Product Name]. Please confirm availability."

Contact Details (Footer & Section):
Include a clear contact section with:
Calls Only: (+266) 53378522
WhatsApp: (+266) 62119056
Email: homelytaste.25@gmail.com

Backend:
Connect Supabase to create a products table to store the menu items (name, description, image URL, price). Ensure Read-Only access for visitors (RLS enabled) so they can view the menu but not alter it.

Ive attached the logo, inspiration of the quality of UI look and feel it should exceed (If it cant match) and the images from the Bakery to use on the menu and across the website where appropriate, The client wants to remain as authentic as possible when it comes to the content on the website.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a024a640-2f44-4a24-8a25-ea4e19830e5d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
