<template>
    <div class="flex justify-content-center align-items-center w-full h-full">
        <Toast />
        
        <Card class="w-full surface-50">
            <template #title>Change Password</template>
            <template #subtitle>
                <p class="mb-4 text-surface-500">Update your personal security information such as password.</p>
            </template>

            <template #content>
                <Form v-slot="$form" :initialValues :resolver="formResolver" :validateOnBlur="true" @submit="onFormSubmit" class="flex flex-column gap-4 w-full sm:w-60">
                    <FormField v-slot="$field" name="currentPassword" initialValue="" class="flex flex-column gap-2">
                        <Password placeholder="Current password" :feedback="false" toggleMask fluid />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                            <ul class="my-0 px-4 flex flex-column gap-1">
                                <li v-for="(error, index) of $form.currentPassword.errors" :key="index">{{ error.message }}</li>
                            </ul>
                        </Message>
                    </FormField>

                    <FormField v-slot="$field" name="password" initialValue="" class="flex flex-column gap-2">
                        <Password placeholder="New password" :feedback="false" toggleMask fluid />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                            <ul class="my-0 px-4 flex flex-column gap-1">
                                <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                            </ul>
                        </Message>
                    </FormField>
                    <FormField v-slot="$field" name="confirmPassword" initialValue="" class="flex flex-column gap-2">
                        <Password placeholder="Confirm password" :feedback="false" toggleMask fluid />
                        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                            <ul class="my-0 px-4 flex flex-column gap-1">
                                <li v-for="(error, index) of $form.confirmPassword.errors" :key="index">{{ error.message }}</li>
                            </ul>
                        </Message>
                    </FormField>

                    <div class="flex justify-content-end">
                        <Button type="submit" label="Update password" severity="primary">
                            <Spinner v-if="loading" />
                        </Button>
                    </div>
                </Form>
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
    import { useApi } from '@/composables/useApi'
    import { AuthService } from '@/services/AuthService'
    import { useUserStore } from '@/stores/userStore'
    import { useAuthStore } from '@/stores/authStore'
    import { useRouter } from 'vue-router'

    const { loading, error, execute } = useApi()
    const toast = useToast()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const router = useRouter()

    const resetPasswordSchema = z.object({
        currentPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters.' })
            .regex(/[A-Z]/, { message: 'Must contain an uppercase letter.' })
            .regex(/[a-z]/, { message: 'Must contain a lowercase letter.' })
            .regex(/[0-9]/, { message: 'Must contain a number.' })
            .regex(/[^A-Za-z0-9]/, { message: 'Must contain a special character.' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters.' })
            .regex(/[A-Z]/, { message: 'Must contain an uppercase letter.' })
            .regex(/[a-z]/, { message: 'Must contain a lowercase letter.' })
            .regex(/[0-9]/, { message: 'Must contain a number.' })
            .regex(/[^A-Za-z0-9]/, { message: 'Must contain a special character.' }),
            
        // Keep it simple. It just needs to be a string.
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match.", path: ["confirmPassword"] })

    type ForgotPasswordFormValues = z.infer<typeof resetPasswordSchema>

    const initialValues = ref<ForgotPasswordFormValues>({
        currentPassword: '',
        password: '',
        confirmPassword: ''
    })

    const formResolver = ref(zodResolver(resetPasswordSchema))

    // On form Submit
    const onFormSubmit = async (e: FormSubmitEvent) => {
        if (e.valid) {
            try {
                const payload = { 
                    id: userStore.getUser?.id,
                    currentPassword: e.values.currentPassword,
                    newPassword: e.values.password,
                    confirmPassword: e.values.confirmPassword
                }

                await execute(() => AuthService.changePassword(payload))

                e.reset()

                await execute(() => AuthService.logout()) // Execute login with nessery header and Bearer token
                authStore.setAuthenticated(false)
                userStore.setUser(null)

                toast.add({ severity: 'success', summary: 'Password Changed Successfuly!', detail: 'Use new password to sign in', life: 5000 })
                await router.push({ name: 'login' })
                return
            } catch (err) {
                console.log(err)
                toast.add({ severity: 'error', summary: 'Password Change Failed', detail: error.value, life: 5000 })
                return
            }
        } else {
            console.error('Validation failed.')
            toast.add({ severity: 'error', summary: 'Password Change Failed', detail: 'Please fix the errors in the form.', life: 5000 })
            return
        }
    }
</script>