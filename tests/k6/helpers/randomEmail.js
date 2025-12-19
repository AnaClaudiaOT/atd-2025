// Gera um email aleatório para registro de usuário
export function randomEmail() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    return `user_${timestamp}_${random}@test.com`;
}
