<template>
    <div class="flex justify-content-center align-items-center w-full h-full">
        <Toast />
        
        <Card class="w-24rem">
            <template #title>Reset Password</template>

            <template #content>
                <Form v-slot="$form" :initialValues :resolver="formResolver" :validateOnBlur="true" @submit="onFormSubmit" class="flex flex-column gap-4 w-full sm:w-60">

                    <FormField v-slot="$field" name="password" initialValue="" class="flex flex-column gap-2">
                        <Password placeholder="Enter password" :feedback="false" toggleMask fluid />
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

                    <Button type="submit" label="Reset" severity="secondary">
                        <Spinner v-if="loading" />
                    </Button>
                </Form>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { zodResolver } from '@primevue/forms/resolvers/zod'
    import { z } from 'zod'
    import type { FormSubmitEvent } from '@/types/Form.types'
    import { useToast } from 'primevue/usetoast'
    import { useApi } from '@/composables/useApi'
    import { useRouter } from 'vue-router'
    import { useRoute } from 'vue-router'
    import { AuthService } from '@/services/AuthService'

    const route = useRoute()
    const router = useRouter()
    const { loading, error, execute } = useApi()
    const toast = useToast()

    const token = ref<string | null>(null)
    const resetPasswordSchema = z.object({
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
        password: '',
        confirmPassword: ''
    })

    const formResolver = ref(zodResolver(resetPasswordSchema))

    const getURLToken = () => token.value = route.query.token

    // On form Submit
    const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
        if (valid) {
            try {
                await execute(() => AuthService.resetPassword({ token: token.value, password: values.password, confirmPassword: values.confirmPassword }))
                toast.add({ severity: 'success', summary: 'Reset Password Successful!', detail: 'Use new password to sign in', life: 5000 })
                router.replace({ name: 'login' }) 
                return
            } catch (err) {
                console.log(err)
                toast.add({ severity: 'error', summary: 'Sending Email Failed', detail: error.value, life: 5000 })
                return
            }
        } else {
            console.error('Validation failed.')
            toast.add({ severity: 'error', summary: 'Reset Password Failed', detail: 'Please fix the errors in the form.', life: 5000 })
            return
        }
    }

    onMounted(() => {
        getURLToken()
    })
</script>


