<template>
    <div class="flex justify-content-center align-items-center w-full h-full">
        <Toast />
        
        <Card class="w-24rem">
            <template #title>Sign in</template>

            <template #content>
                <Form v-slot="$form" :initialValues :resolver="formResolver" :validateOnBlur="true" @submit="onFormSubmit" class="flex flex-column gap-4 w-full sm:w-60">
                    <FormField v-slot="$field" name="email" initialValue="" class="flex flex-column gap-2">
                        <InputText type="text" placeholder="Enter email" fluid />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                    </FormField>

                    <FormField v-slot="$field" name="password" initialValue="" class="flex flex-column gap-2">
                        <Password placeholder="Enter password" :feedback="false" toggleMask fluid />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                            <ul class="my-0 px-4 flex flex-column gap-1">
                                <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                            </ul>
                        </Message>
                    </FormField>

                    <FormField v-slot="$field" name="rememberMe" :initialValue="false" class="flex flex-column gap-1">
                        <div class="flex gap-2 align-items-center justify-content-between">
                            <div class="flex gap-2 align-items-center">
                                <Checkbox binary inputId="remember-me" />
                                <Label for="remember-me" class="text-sm">Remember Me</Label>
                            </div>

                            <RouterLink to="/forgot-password" class="text-xs text-primary">Forgot Password?</RouterLink>
                        </div>
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                    </FormField>

                    <Button type="submit" label="Sign In" severity="secondary">
                        <Spinner v-if="loading" />
                    </Button>
                </Form>
            </template>

            <template #footer>
                <p class="text-xs mt-3">
                    Don't have an account? 
                    <RouterLink to="/register" class="text-primary">Sign Up</RouterLink>
                </p>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { zodResolver } from '@primevue/forms/resolvers/zod'
    import { z } from 'zod'
    import type { FormSubmitEvent } from '@/types/Form.types'
    import { useToast } from 'primevue/usetoast'
    import { useAuthStore } from '@/stores/authStore'
    import { useUserStore } from '@/stores/userStore'
    import { useRouter } from 'vue-router'
    import { AuthService } from '@/services/AuthService'
    import { useApi } from '@/composables/useApi'

    const router = useRouter()
    const { loading, error, execute } = useApi()
    const toast = useToast()
    const authStore = useAuthStore()
    const userStore = useUserStore()

    const loginSchema = z.object({
        email: z.email({ error: 'Invalid email address.' })
            .min(1, { error: 'Email is required.' }),
        password: z.string()
            .min(6, { error: 'Password must be at least 6 characters long.' })
            // 1. Check for at least one uppercase letter
            .regex(/[A-Z]/, { error: 'Password must contain at least one uppercase letter.' })
            // 2. Check for at least one lowercase letter
            .regex(/[a-z]/, { error: 'Password must contain at least one lowercase letter.' })
            // 3. Check for at least one special character
            .regex(/[^A-Za-z0-9]/, { error: 'Password must contain at least one special character.' }),
        rememberMe: z.boolean().optional().default(false)
    })

    type LoginFormValues = z.infer<typeof loginSchema>

    const initialValues = ref<LoginFormValues>({
        email: '',
        password: '',
        rememberMe: false
    })

    const formResolver = ref(zodResolver(loginSchema))

    // On form Submit
    const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
        if (valid) {
            try {
                const response = await execute(() => AuthService.login(values))
                authStore.setAuthenticated(AuthService.isAuthenticated())
                userStore.setUser(response?.data?.user)

                toast.add({ severity: 'success', summary: 'Login Successfull!', detail: `Welcome, ${response?.data?.user?.username || 'user'}!`, life: 5000 })
                router.replace({ name: 'home' })
                return
            } catch (err) {
                toast.add({ severity: 'error', summary: 'LogIn Failed', detail: error.value, life: 5000 })
                return
            }
        } else {
            console.error('Validation failed.')
            toast.add({ severity: 'error', summary: 'LogIn Failed', detail: 'Please fix the errors in the form.', life: 5000 })
            return
        }
    }
</script>


