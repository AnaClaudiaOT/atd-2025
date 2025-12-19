// Obtém a BASE_URL da variável de ambiente ou usa valor padrão
export function getBaseUrl() {
    return __ENV.BASE_URL || 'http://localhost:3000';
}
