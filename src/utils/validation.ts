// Funciones de validación reutilizables para formularios

export function getPasswordValidationErrors(password: string): string[] {
  const errors: string[] = [];
  if (!/[A-Z]/.test(password)) {
    errors.push('Al menos una letra mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Al menos una letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Al menos un número');
  }
  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  return errors;
}
