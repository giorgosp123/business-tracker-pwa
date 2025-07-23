// Διόρθωση των broken emojis στο subscription.html

// Πρώτα, ανοίξτε το subscription.html και βρείτε τις γραμμές:
// Γραμμή 2785: notificationWelcome: "� Καλώς ήρθατε...
// Γραμμή 2892: notificationWelcome: "� Welcome to your...

// Αντικαταστήστε τα με:
console.log("🌟 Emoji fix για τα notification messages:");

const fixes = {
    el: {
        notificationWelcome: "🌟 Καλώς ήρθατε στην Premium εμπειρία! Ξεκινήστε την εξερεύνηση των προηγμένων δυνατοτήτων! ✨",
        notificationCanceled: "💙 Η συνδρομή σας ακυρώθηκε με επιτυχία. Σας ευχαριστούμε που μας δοκιμάσατε!"
    },
    en: {
        notificationWelcome: "🌟 Welcome to your Premium experience! Start exploring advanced features! ✨",
        notificationCanceled: "💙 Your subscription has been successfully canceled. Thank you for trying us!"
    }
};

// Αντικαταστήστε χειροκίνητα τα broken emojis με αυτά:
console.log("Ελληνικά fixes:", fixes.el);
console.log("English fixes:", fixes.en);

// Τα σπασμένα emojis (�) πρέπει να αντικατασταθούν με 🌟
