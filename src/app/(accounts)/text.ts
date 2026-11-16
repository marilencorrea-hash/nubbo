// Every word the account pages and their e-mails show, in one place: translate the site by editing only this file.
export const text = {
  signIn: {
    title: 'Bienvenido de nuevo',
    lead: 'Inicia sesión para continuar.',
    submit: 'Iniciar sesión',
    forgot: '¿Has olvidado tu contraseña?',
    other: '¿Eres nuevo?',
    otherLink: 'Crear una cuenta',
  },
  signUp: {
    title: 'Crea tu cuenta',
    lead: 'Te llevará menos de un minuto.',
    submit: 'Crear cuenta',
    other: '¿Ya tienes cuenta?',
    otherLink: 'Iniciar sesión',
  },
  fields: {
    name: 'Nombre',
    email: 'E-mail',
    password: 'Contraseña',
    newPassword: 'Nueva contraseña',
    currentPassword: 'Contraseña actual',
    code: 'Código',
  },
  google: 'Continuar con Google',
  orEmail: 'o con tu e-mail',
  googleFailed: 'No se pudo completar el acceso con Google. Inténtalo de nuevo.',
  googleNotLinked:
    'Este e-mail ya tiene una cuenta con contraseña. Entra con ella y confirma tu e-mail en /account; después Google también funcionará.',
  wait: 'Espera un momento…',
  verifyingHuman: 'Verificando que eres una persona…',
  failed: 'Algo ha fallado. Inténtalo de nuevo.',
  passwordHint: 'Mínimo 8 caracteres.',
  /** loginfix: inside another site's frame, a browser that keeps no sign-in there */
  framedBlocked:
    'Has iniciado sesión, pero este navegador no mantiene la sesión dentro de otra web. Abre la aplicación en su propia pestaña.',
  openNewTab: 'Abrir en una pestaña nueva',
  /** ownermail: the preview's sign-in and sign-up only — its accounts live in the preview's own database */
  previewAccounts:
    'Vista previa: las cuentas creadas aquí son de prueba. La web publicada tiene sus propias cuentas: regístrate de nuevo allí.',
  /** what a wrong, old or over-tried code answers (better-auth's codes) */
  codeErrors: {
    INVALID_OTP: 'Ese código no es correcto. Compruébalo e inténtalo de nuevo.',
    OTP_EXPIRED: 'Ese código ha caducado. Pide uno nuevo.',
    TOO_MANY_ATTEMPTS: 'Demasiados intentos fallidos. Pide un código nuevo.',
  } as Partial<Record<string, string>>,
  verify: {
    title: 'Revisa tu e-mail',
    lead: (email: string) => `Hemos enviado un código de 8 dígitos a ${email}. Introdúcelo para confirmar tu dirección.`,
    leadNoEmail: 'Escribe tu e-mail y el código de 8 dígitos que te enviamos.',
    submit: 'Confirmar e-mail',
    done: 'Tu e-mail está confirmado.',
  },
  resend: {
    send: 'Enviarme un código',
    again: 'Enviar un código nuevo',
    wait: (seconds: number) => `Código nuevo en ${String(seconds)} s`,
    sent: 'Código enviado. Vale durante 10 minutos.',
  },
  forgot: {
    title: 'Restablece tu contraseña',
    lead: 'Escribe tu e-mail y te enviaremos un código de 8 dígitos.',
    sendCode: 'Enviar código',
    codeLead: (email: string) =>
      `Si ${email} tiene cuenta, el código va de camino. Introdúcelo con una contraseña nueva.`,
    submit: 'Guardar contraseña nueva',
    done: 'Contraseña cambiada. Inicia sesión con la nueva.',
    back: 'Volver a iniciar sesión',
  },
  account: {
    title: 'Tu cuenta',
    signedInWith: (methods: string) => `Sesión iniciada con ${methods}`,
    profile: 'Perfil',
    save: 'Guardar',
    saved: 'Guardado.',
    verified: 'Confirmado',
    unverified: 'Sin confirmar',
    confirmEmail: 'Confirma tu e-mail',
    password: 'Contraseña',
    changePassword: 'Cambiar contraseña',
    passwordChanged: 'Contraseña cambiada. Se cerró la sesión en tus otros dispositivos.',
    devices: 'Dispositivos',
    unknownDevice: 'Dispositivo desconocido',
    signOut: 'Cerrar sesión',
    adminAccess: 'Acceso de administrador',
    adminLead: (email: string) => `Confirma ${email} para abrir las páginas de administración.`,
    danger: 'Eliminar cuenta',
    dangerLead: 'Esto elimina tu cuenta y cierra tu sesión. No se puede deshacer.',
    deleteConfirm: 'Eliminar mi cuenta',
    deleteFailed: 'No se pudo eliminar tu cuenta. Inténtalo de nuevo o contáctanos.',
  },
  email: {
    verifySubject: 'Tu código de confirmación',
    resetSubject: 'Tu código para restablecer la contraseña',
    body: (code: string) =>
      `<p>Tu código es:</p><p style="font-size:28px;font-weight:600;letter-spacing:6px;font-family:monospace">${code}</p><p>Vale durante 10 minutos. Si no lo has pedido, ignora este e-mail.</p>`,
  },
};
