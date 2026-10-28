/**
 * Environment & Application Configuration
 * Contains client-side configuration for EmailJS on static hosts like GitHub Pages.
 */
window.ENV = {
    // EmailJS Public Key (from Account > API Keys)
    EMAILJS_PUBLIC_KEY: "zKGfcU1Zjo7_6kU4o",

    // EmailJS Service ID (from Email Services tab)
    EMAILJS_SERVICE_ID: "service_tf78bnm",

    // EmailJS Template ID for incoming inquiry emails (from Email Templates tab)
    EMAILJS_TEMPLATE_ID: "template_fbm5rfr",

    // Optional: EmailJS Template ID for sending an instant auto-reply back to the visitor
    // Set this if you create an auto-reply template using email-reply-template.html
    EMAILJS_AUTOREPLY_TEMPLATE_ID: "template_e2j2x7l"
};
