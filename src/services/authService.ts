import { LoginCredentials, LoginResponse } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulation d’un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simule une connexion réussie pour n’importe quel email/mot de passe
    return {
      user: {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
      },
      token: 'fake-jwt-token',
    };
  },

  logout() {
    // Simulation de déconnexion
    console.log('Logout');
  },
};