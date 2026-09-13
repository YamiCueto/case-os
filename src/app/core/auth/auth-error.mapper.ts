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
    return 'La contraseña es demasiado corta. Debe tener al menos 6 caracteres.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Debes confirmar tu correo electrónico antes de iniciar sesión.';
  }
  if (msg.includes('rate limit')) {
    return 'Demasiados intentos. Por favor, espera unos minutos e intenta nuevamente.';
  }
  if (msg.includes('user not found')) {
    // For privacy, usually we don't say user not found for login, but for reset pass we might
    return 'No hemos encontrado una cuenta con este correo.';
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
