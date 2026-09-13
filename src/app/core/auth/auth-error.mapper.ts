/**
 * Mapa y sanitiza mensajes de error crudos desde Supabase/Gotrue
 * hacia mensajes amigables y accesibles para el usuario.
 */
export function mapAuthError(rawMessage: string | null | undefined): string | null {
  if (!rawMessage) return null;

  const msg = rawMessage.toLowerCase();

  if (msg.includes('invalid login credentials')) {
    return 'El correo electrónico o la contraseña son incorrectos.';
  }
  if (msg.includes('user already registered')) {
    return 'Ya existe una cuenta con este correo electrónico.';
  }
  if (msg.includes('password should be at least')) {
    return 'La contraseña no cumple los requisitos configurados.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Debes confirmar tu correo electrónico antes de iniciar sesión.';
  }
  if (msg.includes('rate limit')) {
    return 'Demasiados intentos. Por favor, espera unos minutos e intenta nuevamente.';
  }
  if (msg.includes('user not found')) {
    return 'El correo electrónico o la contraseña son incorrectos.'; // prevent enumeration
  }
  if (msg.includes('missing email') || msg.includes('missing password')) {
    return 'Por favor, completa todos los campos requeridos.';
  }
  if (msg.includes('new password should be different')) {
    return 'La nueva contraseña debe ser diferente a la anterior.';
  }

  // Fallback para mensajes no mapeados
  console.warn('Unhandled auth error:', rawMessage);
  return 'Ha ocurrido un error inesperado. Por favor intenta de nuevo.';
}
