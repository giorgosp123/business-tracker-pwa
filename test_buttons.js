/*
🧪 SCRIPT ΕΛΕΓΧΟΥ ΚΟΥΜΠΙΩΝ
Θα ελέγξει αν όλα τα κουμπιά λειτουργούν σωστά
*/

console.log("🔍 Έλεγχος Functions...");

// Έλεγχος αν υπάρχουν όλες οι functions
const requiredFunctions = [
    'startSubscription',
    'cancelSubscription', 
    'goBack',
    'toggleDarkMode',
    'toggleLanguage',
    'showNotification',
    'hideNotification'
];

let missingFunctions = [];
let workingFunctions = [];

requiredFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        workingFunctions.push(funcName);
        console.log(`✅ ${funcName} - OK`);
    } else {
        missingFunctions.push(funcName);
        console.log(`❌ ${funcName} - MISSING`);
    }
});

console.log(`\n📊 Αποτελέσματα:`);
console.log(`✅ Λειτουργούν: ${workingFunctions.length}/${requiredFunctions.length}`);
console.log(`❌ Λείπουν: ${missingFunctions.length}/${requiredFunctions.length}`);

if (missingFunctions.length === 0) {
    console.log(`\n🎉 ΟΛΑ ΤΑ ΚΟΥΜΠΙΑ ΔΟΥΛΕΥΟΥΝ!`);
} else {
    console.log(`\n⚠️ Πρόβλημα με: ${missingFunctions.join(', ')}`);
}

// Test notifications
setTimeout(() => {
    if (typeof showNotification === 'function') {
        console.log("🔔 Testing notifications...");
        showNotification("Test notification - Τα κουμπιά δουλεύουν!", 'success', 3000);
    }
}, 1000);
