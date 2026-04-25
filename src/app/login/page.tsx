import { AuthForm } from "@/components/auth-form";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string }>;
}) {
    const params = await searchParams;

    return (
        <AuthForm mode="login" redirectTarget={params.redirect || "/tools"} />
    );
}
