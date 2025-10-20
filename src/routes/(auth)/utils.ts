import { goto } from "$app/navigation";
import { resolve } from "$app/paths";

import { authClient } from "$lib/auth-client";


export async function login(email: string, password: string): Promise<void> {
    // better-auth
    authClient.signIn.email({
        email,
        password,
    }, {
        onSuccess: () => {
            goto(resolve("/"));
        },
    });
}

export async function signup(email: string, password: string, name: string): Promise<void> {
    const { data, error } = await authClient.signUp.email(
        {
            email, // user email address
            password, // user password -> min 8 characters by default
            name, // user display name
            // image, // User image URL (optional)
            // callbackURL: "/dashboard" // A URL to redirect to after the user verifies their email (optional)
        },
        {
            onRequest: () => {
                //show loading
            },
            onSuccess: () => {
                //redirect to the dashboard or sign in page
                goto(resolve("/"));
            },
            onError: (ctx) => {
                // display the error message
                alert(ctx.error.message);
            },
        },
    );

    if (error) {
        console.error("Error signing up:", error.message);
    } else {
        console.log("Sign-up successful:", data);
    }
}

export async function logout(): Promise<void> {
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                goto(resolve("/login"));
            },
        },
    });
}