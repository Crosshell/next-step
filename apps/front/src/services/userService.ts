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
