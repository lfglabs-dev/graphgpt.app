import type { Config } from "tailwindcss";

// All colors flow from CSS variables for easy theming
const primary = "rgb(var(--color-primary))";
const background = "rgb(var(--color-background))";
const light = "rgb(var(--color-light))";

const config: Config = {
  // Use class strategy; .dark on <html> or <body>
  darkMode: "class",
  content: [
    "./app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary,
        background,
        foreground: "rgb(var(--color-foreground))",
        surface: "rgb(var(--color-surface))",
        border: "rgb(var(--color-border))",
        white: "#ffffff",
        light,
        // Map text tokens to CSS vars for light/dark parity
        "text-secondary-light": "rgb(var(--color-text-secondary-light))",
        "text-secondary-semi-light": "rgb(var(--color-text-secondary-semi-light))",
        "text-secondary": "rgb(var(--color-text-secondary))",
        "text-secondary-dark": "rgb(var(--color-text-secondary-dark))",
        text: "rgb(var(--color-text))",
        "muted-foreground": "rgb(var(--color-muted-foreground))",
      },
      fontFamily: {
        handwriting: ["var(--font-handwriting)", "cursive"],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            blockquote: {
              borderLeftColor: primary,
            },
            "ul > li::marker": {
              color: "rgb(var(--color-text))",
            },
            color: "rgb(var(--color-text))",
            h2: {
              color: "rgb(var(--color-text-secondary))",
            },
          },
        },
        invert: {
          css: {
            blockquote: {
              borderLeftColor: primary,
            },
            color: "rgb(var(--color-foreground))",
          },
        },
      }),
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        accordionOpen: {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionClose: {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: { height: "0px" },
        },
        dialogOverlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        dialogContentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -45%) scale(0.95)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "slide-up-fade": {
          from: {
            opacity: "0",
            transform: "translateY(12px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        "slide-down-fade": {
          from: {
            opacity: "0",
            transform: "translateY(-26px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
      },
      animation: {
        hide: "hide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        // Accordion
        accordionOpen: "accordionOpen 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        accordionClose: "accordionClose 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        // Dialog
        dialogOverlayShow:
          "dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogContentShow:
          "dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade ease-in-out",
        "slide-up-fade": "slide-up-fade ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
export default config;
