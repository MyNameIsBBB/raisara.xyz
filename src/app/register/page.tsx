import { AuthForm } from "@/components/auth-form";

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string }>;
}) {
    const params = await searchParams;

    return (
        <AuthForm
            mode="register"
            redirectTarget={params.redirect || "/tools"}
        />
    );
}
