export const siteConfig = {
    name: "Jessy David",
    description: "Développeur Web Full-Stack | React, Next.js, Node.js",
    url: "https://jessy-david.dev",
    email: "contact@jessy-david.dev",
    location: "France",

    socials: {
        github: {
            url: "https://github.com/jessy-david-dev",
            label: "GitHub",
        },
        linkedin: {
            url: "https://linkedin.com/in/jessy-david",
            label: "LinkedIn",
        },
        x: {
            url: "https://x.com/UltraLion__",
            label: "Twitter / X",
        },
    },
} as const;

export type SiteConfig = typeof siteConfig;
