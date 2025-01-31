/**
 * @since January 2025
 * @author Nimish Jain
 * @desc Generic class for auth service
 */

class AuthService {
  private TOKEN_KEY = "userdata";

  setToken(token: any): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  async login(payload: any) {
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
    return response.json();
  }
}

export const authClass = new AuthService();
