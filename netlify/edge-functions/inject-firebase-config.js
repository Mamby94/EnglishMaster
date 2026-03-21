export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  const apiKey = Deno.env.get("FIREBASE_API_KEY");
  if (!apiKey) {
    return response;
  }

  let html = await response.text();

  // Replace the hardcoded invalid API key with the one from environment variable
  html = html.replace(
    "AIzaSyDf9FvRly2ZndOwXc_egBEiTc2RPmWo-HI",
    apiKey
  );

  // Also inject other Firebase config values if provided
  const authDomain = Deno.env.get("FIREBASE_AUTH_DOMAIN");
  if (authDomain) {
    html = html.replace("english-master-407fd.firebaseapp.com", authDomain);
  }

  const projectId = Deno.env.get("FIREBASE_PROJECT_ID");
  if (projectId) {
    html = html.replace(/english-master-407fd(?=\.firebasestorage|")/g, projectId);
  }

  const storageBucket = Deno.env.get("FIREBASE_STORAGE_BUCKET");
  if (storageBucket) {
    html = html.replace(
      "english-master-407fd.firebasestorage.app",
      storageBucket
    );
  }

  const messagingSenderId = Deno.env.get("FIREBASE_MESSAGING_SENDER_ID");
  if (messagingSenderId) {
    html = html.replace("782947742298", messagingSenderId);
  }

  const appId = Deno.env.get("FIREBASE_APP_ID");
  if (appId) {
    html = html.replace(
      "1:782947742298:web:3de2f2dc4bf68450461e63",
      appId
    );
  }

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
};

export const config = {
  path: "/*",
};
