export async function registerUser(data: {
  email: string;
  password: string;
  type: string;
}) {
  const response = await fetch('http://localhost:8020/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    let errors = [];

    if (Array.isArray(errorBody.errors)) {
      errors = errorBody.errors;
    } else if (typeof errorBody.message === 'string') {
      errors = [errorBody.message];
    } else {
      errors = ['Registration failed'];
    }

    return { error: errors };
  }

  return { data: await response.json() };
}

export async function checkUserConfirmed(token: string | null) {
  const response = await fetch(
    `http://localhost:8020/api/auth/verify?token=${token}`
  );

  if (!response.ok) {
    throw new Error('Failed to check confirmation status');
  }

  const result = await response.json();

  return !!result.confirmed;
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await fetch('http://localhost:8020/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include', // <- ВАЖЛИВО!
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    let errors = [];

    if (Array.isArray(errorBody.errors)) {
      errors = errorBody.errors;
    } else if (typeof errorBody.message === 'string') {
      errors = [errorBody.message];
    } else {
      errors = ['Sign In failed'];
    }

    return { error: errors };
  }

  return { data: await response.json() };
}

export async function forgetPass(data: { email: string }) {
  const response = await fetch(
    'http://localhost:8020/api/auth/forgot-password',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    let errors = [];

    if (Array.isArray(errorBody.errors)) {
      errors = errorBody.errors;
    } else if (typeof errorBody.message === 'string') {
      errors = [errorBody.message];
    } else {
      errors = ['Failed to send an email'];
    }

    return { error: errors };
  }

  return { data: await response.json() };
}

export async function resetPass(data: {
  token: string | null;
  password: string | undefined;
}) {
  const response = await fetch(
    `http://localhost:8020/api/auth/reset-password?token=${data.token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: data.password }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check confirmation status');
  }

  const result = await response.json();

  return !!result.confirmed;
}

export async function resendEmail(data: { email: string }) {
  const response = await fetch(`http://localhost:8020/api/auth/verify/resend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to check confirmation status');
  }

  const result = await response.json();

  return !!result.confirmed;
}

export async function logoutUser() {
  const response = await fetch('http://localhost:8020/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
}

export async function logoutAll() {
  const response = await fetch('http://localhost:8020/api/auth/logout-all', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
}
