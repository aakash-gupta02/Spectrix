import LoginClient from "./LoginClient";

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  
  const demo = resolvedSearchParams?.demo;
  const loginDemo = resolvedSearchParams?.loginDemo;

  const autoFillDemo = demo === "true" || demo === "1";
  const loginDemoFlag = loginDemo === "true" || loginDemo === "1";

  return <LoginClient autoFillDemo={autoFillDemo} loginDemoFlag={loginDemoFlag} />;
}
