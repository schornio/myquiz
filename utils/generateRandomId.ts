// Generates a random id string of 25 characters from a-z and 0-9
export function generateRandomId() {
  return Array.from({ length: 25 }, () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }).join('');
}
