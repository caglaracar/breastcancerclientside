// jwtUtils.js
export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        return Date.now() > expirationTime;
    } catch (error) {
        console.error('Failed to parse token:', error);
        return true; // Token geçerli değilse veya parsing hatası varsa expired olarak kabul edin
    }
};
