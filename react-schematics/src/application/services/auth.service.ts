/**
 * @since January 2025
 * @author Nimish Jain
 * @desc Generic class for auth service
 */

class AuthService {
  private readonly TOKEN_KEY = "userdata";

  setToken(token: any): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): any {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  async login(payload: any) {
    try {
      const response = await fetch(
        "https://yash-ui-strapi.azurewebsites.net/api/auth/local", // Replace this with your own URL
        {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return error;
    }
  }
}

export default new AuthService();
